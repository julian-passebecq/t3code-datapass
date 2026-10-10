// @effect-diagnostics nodeBuiltinImport:off - Effect has no static file server bound to a chosen interface.
/**
 * MosaicPreviewHost - serves built Mosaic client output for the preview browser.
 *
 * Each output folder gets its own loopback server on an OS-assigned port, so a
 * preview runs on an origin of its own and shares no storage with the T3 web
 * app. Cookies are not port-isolated (RFC 6265 §8.5), so a T3 server on the same
 * loopback host is same-site with every preview: HOST_CEILING_CSP keeps preview
 * scripts on their own origin, and `layerPreviewOriginGuard` makes the T3 server
 * refuse any request that still arrives with a preview Origin. The folder is
 * read on every request, so a rebuild shows after reload.
 *
 * @module MosaicPreviewHost
 */
import * as NodeFS from "node:fs";
import * as NodeHttp from "node:http";
import * as NodePath from "node:path";

import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/http";

import { contentSecurityPolicyFromHeaders } from "./mosaicReceipt.ts";

export class MosaicPreviewStartError extends Schema.TaggedError<MosaicPreviewStartError>()(
  "MosaicPreviewStartError",
  {
    cause: Schema.Defect(),
  },
) {
  override get message(): string {
    return "Failed to start the Mosaic preview server.";
  }
}

/** Used when a build declares no policy of its own: same-origin only, no network beyond it. */
export const DEFAULT_PREVIEW_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'";

/**
 * Sent on every response next to the build's own policy. Browsers enforce each
 * Content-Security-Policy header, so a `_headers` policy can only tighten this:
 * no fetch, socket, frame or form post to another origin, no plugins, and no
 * popups or top-level navigation (the sandbox leaves those out).
 */
export const HOST_CEILING_CSP =
  "connect-src 'self'; frame-src 'self'; form-action 'self'; object-src 'none'; base-uri 'self'; sandbox allow-scripts allow-same-origin allow-forms allow-modals allow-downloads";

const MAX_SERVERS = 8;

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".wasm": "application/wasm",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".bin": "application/octet-stream",
  ".csv": "text/csv; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".parquet": "application/octet-stream",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

/**
 * Resolves a request path inside `root`, or undefined when it escapes the
 * root or names a dot-segment (the build's `_headers` stays private too).
 */
export function resolvePreviewFile(root: string, requestUrl: string): string | undefined {
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, "http://preview.invalid").pathname);
  } catch {
    return undefined;
  }
  if (pathname.includes("\0")) return undefined;
  const segments = pathname.split("/").filter((segment) => segment !== "");
  if (segments.some((segment) => segment.startsWith(".") || segment === "_headers")) {
    return undefined;
  }
  if (segments.some((segment) => segment.includes("\\"))) return undefined;
  const resolved = NodePath.resolve(root, ...segments);
  const relative = NodePath.relative(root, resolved);
  if (relative.startsWith("..") || NodePath.isAbsolute(relative)) return undefined;
  return resolved;
}

const readPolicy = (root: string) => {
  try {
    return (
      contentSecurityPolicyFromHeaders(
        NodeFS.readFileSync(NodePath.join(root, "_headers"), "utf8"),
      ) ?? DEFAULT_PREVIEW_CSP
    );
  } catch {
    return DEFAULT_PREVIEW_CSP;
  }
};

/**
 * The real path of `file` (its `index.html` for a folder) when that is a regular
 * file inside the real `root`. The lexical check alone would let a symlink or
 * junction in the output lead the server outside it.
 */
export function realPreviewFile(root: string, file: string): string | undefined {
  try {
    const realRoot = NodeFS.realpathSync.native(root);
    let real = NodeFS.realpathSync.native(file);
    if (NodeFS.statSync(real).isDirectory()) {
      real = NodeFS.realpathSync.native(NodePath.join(real, "index.html"));
    }
    const relative = NodePath.relative(realRoot, real);
    if (relative === "" || relative.startsWith("..") || NodePath.isAbsolute(relative)) {
      return undefined;
    }
    return NodeFS.statSync(real).isFile() ? real : undefined;
  } catch {
    return undefined;
  }
}

const handle =
  (root: string, host: () => string) =>
  (request: NodeHttp.IncomingMessage, response: NodeHttp.ServerResponse) => {
    const headers = {
      "Content-Security-Policy": [readPolicy(root), HOST_CEILING_CSP],
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "no-store",
      "Cross-Origin-Resource-Policy": "same-origin",
    };
    // DNS rebinding: a page on another name that resolves to loopback must not read previews.
    if (request.headers.host !== host()) {
      response.writeHead(421, headers).end();
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { ...headers, Allow: "GET, HEAD" }).end();
      return;
    }
    const requested = resolvePreviewFile(root, request.url ?? "/");
    const file = requested === undefined ? undefined : realPreviewFile(root, requested);
    if (file === undefined) {
      response.writeHead(404, headers).end();
      return;
    }
    try {
      const stat = NodeFS.statSync(file);
      response.writeHead(200, {
        ...headers,
        "Content-Type":
          CONTENT_TYPES[NodePath.extname(file).toLowerCase()] ?? "application/octet-stream",
        "Content-Length": stat.size,
      });
      if (request.method === "HEAD") {
        response.end();
        return;
      }
      NodeFS.createReadStream(file)
        .on("error", () => response.destroy())
        .pipe(response);
    } catch {
      response.writeHead(404, headers).end();
    }
  };

export class MosaicPreviewHost extends Context.Service<
  MosaicPreviewHost,
  {
    /** The loopback origin serving `root`, started on first use and reused after. */
    readonly serve: (root: string) => Effect.Effect<string, MosaicPreviewStartError>;
    /** Whether `origin` was ever handed out; evicted servers' pages may still be open. */
    readonly isPreviewOrigin: (origin: string) => boolean;
  }
>()("t3/mosaic/MosaicPreviewHost") {}

const make = Effect.gen(function* () {
  const servers = new Map<string, { readonly server: NodeHttp.Server; readonly origin: string }>();
  const issuedOrigins = new Set<string>();

  const closeAll = Effect.sync(() => {
    for (const { server } of servers.values()) server.close();
    servers.clear();
  });
  yield* Effect.addFinalizer(() => closeAll);

  const serve = Effect.fn("MosaicPreviewHost.serve")(function* (root: string) {
    const key = NodePath.resolve(root);
    const existing = servers.get(key);
    if (existing !== undefined && existing.server.listening) return existing.origin;

    if (servers.size >= MAX_SERVERS) {
      const [oldestKey, oldest] = servers.entries().next().value!;
      oldest.server.close();
      servers.delete(oldestKey);
    }

    let host = "";
    const server = NodeHttp.createServer(handle(key, () => host));
    const origin = yield* Effect.callback<string, MosaicPreviewStartError>((resume) => {
      server.once("error", (cause) => resume(Effect.fail(new MosaicPreviewStartError({ cause }))));
      server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        if (address === null || typeof address === "string") {
          resume(Effect.fail(new MosaicPreviewStartError({ cause: new Error("no port") })));
          return;
        }
        host = `127.0.0.1:${address.port}`;
        resume(Effect.succeed(`http://${host}`));
      });
    });
    servers.set(key, { server, origin });
    issuedOrigins.add(origin);
    return origin;
  });

  return MosaicPreviewHost.of({
    serve,
    isPreviewOrigin: (origin) => issuedOrigins.has(origin.trim().toLowerCase()),
  });
});

export const layer = Layer.effect(MosaicPreviewHost, make);

/**
 * Refuses T3 HTTP and WebSocket requests sent from a preview page. Browsers
 * attach the loopback session cookie to them because previews are same-site,
 * and always send Origin on upgrades and on cross-origin fetches and posts.
 */
export const layerPreviewOriginGuard = HttpRouter.middleware(
  Effect.gen(function* () {
    const host = yield* MosaicPreviewHost;
    return <E, R>(httpEffect: Effect.Effect<HttpServerResponse.HttpServerResponse, E, R>) =>
      Effect.gen(function* () {
        const origin = (yield* HttpServerRequest.HttpServerRequest).headers.origin;
        if (origin !== undefined && host.isPreviewOrigin(origin)) {
          return HttpServerResponse.text("Mosaic previews cannot call T3 Code.", { status: 403 });
        }
        return yield* httpEffect;
      });
  }),
  { global: true },
);
