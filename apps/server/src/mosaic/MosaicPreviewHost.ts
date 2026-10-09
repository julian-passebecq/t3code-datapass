// @effect-diagnostics nodeBuiltinImport:off - Effect has no static file server bound to a chosen interface.
/**
 * MosaicPreviewHost - serves built Mosaic client output for the preview browser.
 *
 * Each output folder gets its own loopback server on an OS-assigned port, so a
 * preview runs on an origin of its own: it shares no cookies or storage with the
 * T3 web app and, under the default policy, cannot fetch anything but its own
 * files. The folder is read on every request, so a rebuild shows after reload.
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

const handle =
  (root: string) => (request: NodeHttp.IncomingMessage, response: NodeHttp.ServerResponse) => {
    const headers = {
      "Content-Security-Policy": readPolicy(root),
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "no-store",
      "Cross-Origin-Resource-Policy": "same-origin",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { ...headers, Allow: "GET, HEAD" }).end();
      return;
    }
    let file = resolvePreviewFile(root, request.url ?? "/");
    if (file === undefined) {
      response.writeHead(404, headers).end();
      return;
    }
    try {
      if (NodeFS.statSync(file).isDirectory()) file = NodePath.join(file, "index.html");
      const stat = NodeFS.statSync(file);
      if (!stat.isFile()) throw new Error("not a file");
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
  }
>()("t3/mosaic/MosaicPreviewHost") {}

const make = Effect.gen(function* () {
  const servers = new Map<string, { readonly server: NodeHttp.Server; readonly origin: string }>();

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

    const server = NodeHttp.createServer(handle(key));
    const origin = yield* Effect.callback<string, MosaicPreviewStartError>((resume) => {
      server.once("error", (cause) => resume(Effect.fail(new MosaicPreviewStartError({ cause }))));
      server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        if (address === null || typeof address === "string") {
          resume(Effect.fail(new MosaicPreviewStartError({ cause: new Error("no port") })));
          return;
        }
        resume(Effect.succeed(`http://127.0.0.1:${address.port}`));
      });
    });
    servers.set(key, { server, origin });
    return origin;
  });

  return MosaicPreviewHost.of({ serve });
});

export const layer = Layer.effect(MosaicPreviewHost, make);
