// @effect-diagnostics nodeBuiltinImport:off globalFetchInEffect:off - requests the real loopback server.
import * as NodeFS from "node:fs";
import * as NodeOS from "node:os";
import * as NodePath from "node:path";

import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
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
      expect(page.headers.get("content-security-policy")).toBe("default-src 'none'");
      expect(page.headers.get("cache-control")).toBe("no-store");

      const fallback = yield* Effect.promise(() => fetch(`${second}/index.html`));
      expect(fallback.headers.get("content-security-policy")).toBe(
        MosaicPreviewHost.DEFAULT_PREVIEW_CSP,
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
});
