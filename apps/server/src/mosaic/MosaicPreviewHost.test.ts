// @effect-diagnostics nodeBuiltinImport:off globalFetchInEffect:off - requests the real loopback server.
import * as NodeFS from "node:fs";
import * as NodeHttp from "node:http";
import * as NodeOS from "node:os";
import * as NodePath from "node:path";

import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { HttpRouter, HttpServerResponse } from "effect/http";
import { afterEach, describe, expect } from "vite-plus/test";

import * as MosaicPreviewHost from "./MosaicPreviewHost.ts";

const roots: string[] = [];
const makeRoot = (files: Record<string, string>) => {
  const root = NodeFS.mkdtempSync(NodePath.join(NodeOS.tmpdir(), "t3-mosaic-preview-"));
  for (const [file, contents] of Object.entries(files)) {
    NodeFS.mkdirSync(NodePath.dirname(NodePath.join(root, file)), { recursive: true });
    NodeFS.writeFileSync(NodePath.join(root, file), contents);
  }
  roots.push(root);
  return root;
};

afterEach(() => {
  for (const root of roots.splice(0)) NodeFS.rmSync(root, { recursive: true, force: true });
});

/** A raw request, so the test controls the Host header fetch would set itself. */
const request = (origin: string, path: string, headers: Record<string, string> = {}) =>
  Effect.callback<{ status: number; headers: NodeHttp.IncomingHttpHeaders; body: string }>(
    (resume) => {
      const req = NodeHttp.request(`${origin}${path}`, { headers }, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => (body += chunk));
        res.on("end", () =>
          resume(Effect.succeed({ status: res.statusCode ?? 0, headers: res.headers, body })),
        );
      });
      req.on("error", (error) => resume(Effect.die(error)));
      req.end();
    },
  );

/** Links `link` to `target`, or returns false where the OS refuses (Windows without Developer Mode). */
const tryLink = (target: string, link: string, type: "file" | "dir" | "junction") => {
  try {
    NodeFS.symlinkSync(target, link, type);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EPERM") return false;
    throw error;
  }
};

describe("resolvePreviewFile", () => {
  it("keeps requests inside the output folder", () => {
    const root = NodePath.resolve("/out");
    expect(MosaicPreviewHost.resolvePreviewFile(root, "/assets/app.js")).toBe(
      NodePath.join(root, "assets", "app.js"),
    );
    expect(MosaicPreviewHost.resolvePreviewFile(root, "/../secret")).toBe(
      NodePath.join(root, "secret"),
    );
    // URL parsing folds encoded dot-segments, so these clamp to the root too.
    expect(MosaicPreviewHost.resolvePreviewFile(root, "/%2e%2e/secret")).toBe(
      NodePath.join(root, "secret"),
    );
    expect(MosaicPreviewHost.resolvePreviewFile(root, "/a%5c..%5c..%5csecret")).toBeUndefined();
    expect(MosaicPreviewHost.resolvePreviewFile(root, "/_headers")).toBeUndefined();
    expect(MosaicPreviewHost.resolvePreviewFile(root, "/.env")).toBeUndefined();
  });
});

describe("realPreviewFile", () => {
  it("refuses a symlink that leads out of the output folder", (ctx) => {
    const outside = makeRoot({ "secret.txt": "secret", "dir/index.html": "outside" });
    const root = makeRoot({ "index.html": "inside" });
    const fileLinked = tryLink(
      NodePath.join(outside, "secret.txt"),
      NodePath.join(root, "leak.txt"),
      "file",
    );
    const dirLinked = tryLink(NodePath.join(outside, "dir"), NodePath.join(root, "dir"), "dir");
    if (!fileLinked || !dirLinked) ctx.skip();

    expect(
      MosaicPreviewHost.realPreviewFile(root, NodePath.join(root, "leak.txt")),
    ).toBeUndefined();
    expect(MosaicPreviewHost.realPreviewFile(root, NodePath.join(root, "dir"))).toBeUndefined();
    expect(MosaicPreviewHost.realPreviewFile(root, NodePath.join(root, "index.html"))).toBe(
      NodeFS.realpathSync.native(NodePath.join(root, "index.html")),
    );
  });

  it.skipIf(process.platform !== "win32")(
    "refuses a junction that leads out of the output folder",
    () => {
      const outside = makeRoot({ "index.html": "outside", "secret.txt": "secret" });
      const root = makeRoot({ "index.html": "inside" });
      NodeFS.symlinkSync(outside, NodePath.join(root, "linked"), "junction");

      expect(
        MosaicPreviewHost.realPreviewFile(root, NodePath.join(root, "linked")),
      ).toBeUndefined();
      expect(
        MosaicPreviewHost.realPreviewFile(root, NodePath.join(root, "linked", "secret.txt")),
      ).toBeUndefined();
    },
  );

  it("refuses folders without an index and missing files", () => {
    const root = makeRoot({ "empty/.keep": "", "index.html": "inside" });
    expect(MosaicPreviewHost.realPreviewFile(root, NodePath.join(root, "empty"))).toBeUndefined();
    expect(MosaicPreviewHost.realPreviewFile(root, NodePath.join(root, "nope.js"))).toBeUndefined();
    expect(MosaicPreviewHost.realPreviewFile(root, root)).toBe(
      NodeFS.realpathSync.native(NodePath.join(root, "index.html")),
    );
  });
});

describe("MosaicPreviewHost", () => {
  it.effect("serves each output on its own loopback origin with the build's policy", () =>
    Effect.gen(function* () {
      const host = yield* MosaicPreviewHost.MosaicPreviewHost;
      const withPolicy = makeRoot({
        "index.html": "<h1>one</h1>",
        _headers: "/*\n  Content-Security-Policy: default-src 'none'\n",
      });
      const withoutPolicy = makeRoot({ "index.html": "<h1>two</h1>" });

      const first = yield* host.serve(withPolicy);
      const second = yield* host.serve(withoutPolicy);
      expect(first).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
      expect(second).not.toBe(first);
      expect(yield* host.serve(withPolicy)).toBe(first);

      const page = yield* Effect.promise(() => fetch(`${first}/`));
      expect(page.status).toBe(200);
      expect(yield* Effect.promise(() => page.text())).toBe("<h1>one</h1>");
      expect(page.headers.get("content-security-policy")).toBe(
        `default-src 'none', ${MosaicPreviewHost.HOST_CEILING_CSP}`,
      );
      expect(page.headers.get("cache-control")).toBe("no-store");

      const fallback = yield* Effect.promise(() => fetch(`${second}/index.html`));
      expect(fallback.headers.get("content-security-policy")).toBe(
        `${MosaicPreviewHost.DEFAULT_PREVIEW_CSP}, ${MosaicPreviewHost.HOST_CEILING_CSP}`,
      );

      const hidden = yield* Effect.promise(() => fetch(`${first}/_headers`));
      expect(hidden.status).toBe(404);
      const post = yield* Effect.promise(() => fetch(`${first}/`, { method: "POST" }));
      expect(post.status).toBe(405);

      // A rebuild replaces files in place; the next request sees them.
      NodeFS.writeFileSync(NodePath.join(withPolicy, "index.html"), "<h1>rebuilt</h1>");
      const reloaded = yield* Effect.promise(() => fetch(`${first}/`).then((r) => r.text()));
      expect(reloaded).toBe("<h1>rebuilt</h1>");
    }).pipe(Effect.provide(MosaicPreviewHost.layer)),
  );

  it.effect("serves the assets a client build needs with their content types", () =>
    Effect.gen(function* () {
      const host = yield* MosaicPreviewHost.MosaicPreviewHost;
      const origin = yield* host.serve(
        makeRoot({
          "index.html": "<h1>app</h1>",
          "assets/app.js": "export {};",
          "assets/app.css": "body{}",
          "assets/engine.wasm": "\0asm",
        }),
      );
      const expected: Record<string, string> = {
        "/": "text/html; charset=utf-8",
        "/index.html": "text/html; charset=utf-8",
        "/assets/app.js": "text/javascript; charset=utf-8",
        "/assets/app.css": "text/css; charset=utf-8",
        "/assets/engine.wasm": "application/wasm",
      };
      for (const [path, contentType] of Object.entries(expected)) {
        const response = yield* Effect.promise(() => fetch(`${origin}${path}`));
        expect(response.status, path).toBe(200);
        expect(response.headers.get("content-type"), path).toBe(contentType);
        expect(response.headers.get("x-content-type-options"), path).toBe("nosniff");
      }
      const head = yield* Effect.promise(() =>
        fetch(`${origin}/assets/app.js`, { method: "HEAD" }),
      );
      expect(head.status).toBe(200);
    }).pipe(Effect.provide(MosaicPreviewHost.layer)),
  );

  it.effect("does not serve a file reached through a link out of the output", () =>
    Effect.gen(function* () {
      const host = yield* MosaicPreviewHost.MosaicPreviewHost;
      const outside = makeRoot({ "secret.txt": "secret" });
      const root = makeRoot({ "index.html": "inside" });
      // A junction needs no privileges on Windows; elsewhere a directory symlink is the same escape.
      NodeFS.symlinkSync(
        outside,
        NodePath.join(root, "linked"),
        process.platform === "win32" ? "junction" : "dir",
      );
      const origin = yield* host.serve(root);
      const response = yield* request(origin, "/linked/secret.txt");
      expect(response.status).toBe(404);
      expect(response.body).not.toContain("secret");
    }).pipe(Effect.provide(MosaicPreviewHost.layer)),
  );

  it.effect("answers only requests addressed to its own loopback host", () =>
    Effect.gen(function* () {
      const host = yield* MosaicPreviewHost.MosaicPreviewHost;
      const origin = yield* host.serve(makeRoot({ "index.html": "<h1>app</h1>" }));
      const port = new URL(origin).port;

      expect((yield* request(origin, "/")).status).toBe(200);
      for (const name of [`attacker.example:${port}`, `localhost:${port}`, "127.0.0.1"]) {
        const rebound = yield* request(origin, "/", { host: name });
        expect(rebound.status, name).toBe(421);
        expect(rebound.body).not.toContain("app");
      }
    }).pipe(Effect.provide(MosaicPreviewHost.layer)),
  );

  it.effect("keeps the host ceiling when the build's policy is more permissive", () =>
    Effect.gen(function* () {
      const host = yield* MosaicPreviewHost.MosaicPreviewHost;
      const origin = yield* host.serve(
        makeRoot({
          "index.html": "<h1>app</h1>",
          _headers: [
            "/*",
            "  Content-Security-Policy: default-src *; connect-src *; frame-src *",
            "  Access-Control-Allow-Origin: *",
            "  Cross-Origin-Resource-Policy: cross-origin",
            "",
          ].join("\n"),
        }),
      );
      const response = yield* request(origin, "/");
      // Two headers: the browser enforces both, so the build cannot widen the ceiling.
      expect(response.headers["content-security-policy"]).toBe(
        `default-src *; connect-src *; frame-src *, ${MosaicPreviewHost.HOST_CEILING_CSP}`,
      );
      expect(MosaicPreviewHost.HOST_CEILING_CSP).toContain("connect-src 'self'");
      expect(MosaicPreviewHost.HOST_CEILING_CSP).toContain("frame-src 'self'");
      expect(MosaicPreviewHost.HOST_CEILING_CSP).toContain("form-action 'self'");
      expect(MosaicPreviewHost.HOST_CEILING_CSP).toContain("object-src 'none'");
      expect(MosaicPreviewHost.HOST_CEILING_CSP).not.toContain("allow-popups");
      expect(MosaicPreviewHost.HOST_CEILING_CSP).not.toContain("allow-top-navigation");
      // Only the policy is read from `_headers`.
      expect(response.headers["access-control-allow-origin"]).toBeUndefined();
      expect(response.headers["cross-origin-resource-policy"]).toBe("same-origin");
    }).pipe(Effect.provide(MosaicPreviewHost.layer)),
  );
});

describe("layerPreviewOriginGuard", () => {
  it.effect("refuses T3 requests and socket upgrades sent from a preview origin", () =>
    Effect.gen(function* () {
      const host = yield* MosaicPreviewHost.MosaicPreviewHost;
      const previewOrigin = yield* host.serve(makeRoot({ "index.html": "<h1>app</h1>" }));

      const layerRoutes = Layer.effectDiscard(
        Effect.gen(function* () {
          const router = yield* HttpRouter.HttpRouter;
          yield* router.add("*", "/api/environment", HttpServerResponse.text("session"));
          yield* router.add("GET", "/ws", HttpServerResponse.text("upgraded"));
        }),
      );
      const { handler, dispose } = HttpRouter.toWebHandler(
        Layer.merge(layerRoutes, MosaicPreviewHost.layerPreviewOriginGuard).pipe(
          Layer.provide(Layer.succeed(MosaicPreviewHost.MosaicPreviewHost, host)),
        ),
        { disableLogger: true },
      );
      yield* Effect.addFinalizer(() => Effect.promise(() => dispose()));

      const send = (path: string, init: RequestInit) =>
        Effect.promise(() => handler(new Request(`http://127.0.0.1:3773${path}`, init)));

      const fromPreview = { origin: previewOrigin };
      expect((yield* send("/api/environment", { headers: fromPreview })).status).toBe(403);
      expect(
        (yield* send("/api/environment", { method: "POST", headers: fromPreview, body: "{}" }))
          .status,
      ).toBe(403);
      const upgrade = yield* send("/ws", {
        headers: { ...fromPreview, connection: "Upgrade", upgrade: "websocket" },
      });
      expect(upgrade.status).toBe(403);

      // Normal clients: same-origin, the hosted app, no Origin at all, another loopback port.
      for (const origin of [
        "http://127.0.0.1:3773",
        "https://app.t3.codes",
        "http://127.0.0.1:1",
        undefined,
      ]) {
        const response = yield* send("/api/environment", origin ? { headers: { origin } } : {});
        expect(response.status, origin ?? "no origin").toBe(200);
      }
    }).pipe(Effect.scoped, Effect.provide(MosaicPreviewHost.layer)),
  );
});
