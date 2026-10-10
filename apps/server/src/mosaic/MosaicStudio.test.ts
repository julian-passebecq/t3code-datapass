// @effect-diagnostics nodeBuiltinImport:off globalFetchInEffect:off globalDate:off globalDateInEffect:off - drives a real git repo, build process and preview server.
import * as NodeChildProcess from "node:child_process";
import * as NodeFS from "node:fs";
import * as NodeOS from "node:os";
import * as NodePath from "node:path";

import * as NodeServices from "@effect/platform-node/NodeServices";
import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { afterEach, describe, expect } from "vite-plus/test";

import * as ProcessRunner from "../processRunner.ts";
import * as MosaicPreviewHost from "./MosaicPreviewHost.ts";
import * as MosaicStudio from "./MosaicStudio.ts";

const layerTest = MosaicStudio.layer.pipe(
  Layer.provide(MosaicPreviewHost.layer),
  Layer.provide(ProcessRunner.layer),
  Layer.provideMerge(NodeServices.layer),
);

// Stands in for Mosaic's build-client script: fails when the client holds a
// FAIL marker, otherwise writes a minimal client output and, unless the client
// holds a LEGACY marker, its datapass.preview/1 descriptor.
const BUILD_SCRIPT = `
import crypto from "node:crypto";
import fs from "node:fs";
const id = process.argv[2];
if (fs.existsSync(\`clients/\${id}/FAIL\`)) { console.error("tsc: type error in app.ts"); process.exit(1); }
const out = \`dist-clients/\${id}\`;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(\`\${out}/artifacts\`, { recursive: true });
const contents = {
  "artifacts/result.json": JSON.stringify({ format: "datapass.artifact", version: 1, id: "result" }),
  "index.html": "<h1>" + id + "</h1>",
  "studio-build.json": JSON.stringify({ format: "datapass.client-build", version: 1, client: id, capabilities: ["charts"] }),
};
const files = [];
for (const [path, text] of Object.entries(contents)) {
  fs.writeFileSync(\`\${out}/\${path}\`, text);
  files.push({ path, bytes: Buffer.byteLength(text), sha256: crypto.createHash("sha256").update(text).digest("hex") });
}
if (!fs.existsSync(\`clients/\${id}/LEGACY\`)) {
  fs.writeFileSync(\`\${out}/preview.json\`, JSON.stringify({
    format: "datapass.preview", version: 1,
    app: { id, title: "Demo lab", variant: "client" },
    entry: "index.html", sdkVersion: "0.8.1", sourceCommit: null,
    publication: { mode: "preview", noindex: true },
    capabilities: ["charts"], files,
    artifacts: [{ id: "result", path: "artifacts/result.json", sha256: files[0].sha256, provenance: "synthetic" }],
    open: { file: false, httpLoopback: true },
    csp: "default-src 'self'",
  }, null, 2));
}
`;

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) NodeFS.rmSync(dir, { recursive: true, force: true });
});

const git = (cwd: string, ...args: string[]) =>
  NodeChildProcess.execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

const write = (root: string, file: string, contents: string) => {
  NodeFS.mkdirSync(NodePath.dirname(NodePath.join(root, file)), { recursive: true });
  NodeFS.writeFileSync(NodePath.join(root, file), contents);
};

const ageTree = (root: string, seconds: number) => {
  const when = new Date(Date.now() - seconds * 1000);
  for (const entry of NodeFS.readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (entry.isFile()) NodeFS.utimesSync(NodePath.join(entry.parentPath, entry.name), when, when);
  }
};

const makeMosaicRepo = () => {
  const root = NodeFS.mkdtempSync(NodePath.join(NodeOS.tmpdir(), "t3-mosaic-studio-"));
  dirs.push(root);
  write(
    root,
    "package.json",
    JSON.stringify({
      name: "mosaic-fixture",
      private: true,
      scripts: { "build:client": "node build.mjs" },
    }),
  );
  write(root, "build.mjs", BUILD_SCRIPT);
  write(root, ".gitignore", "dist-clients/\n");
  write(
    root,
    "clients/demo/app.ts",
    "export default defineApp({manifest:{id:'demo',title:'Demo lab'}});",
  );
  write(root, "clients/demo/client.config.json", JSON.stringify({ family: "spatial" }));
  write(
    root,
    "clients/demo/public/artifacts/result.json",
    JSON.stringify({
      format: "datapass.artifact",
      version: 1,
      id: "result",
      title: "Result",
      provenance: { kind: "synthetic", source: "fixture" },
      payload: {},
      representations: [],
    }),
  );
  write(root, "clients/demo/public/artifacts/broken.json", "{ not json");
  write(root, "clients/Not_A_Client/app.ts", "");
  write(root, "src/framework.ts", "export {};");
  git(root, "init", "-q", "-b", "main");
  git(root, "-c", "user.email=t@t", "-c", "user.name=t", "add", ".");
  git(root, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "init");
  ageTree(NodePath.join(root, "clients"), 60);
  ageTree(NodePath.join(root, "src"), 60);
  return root;
};

describe("MosaicStudio", () => {
  it.effect("ignores projects without the Mosaic layout", () =>
    Effect.gen(function* () {
      const studio = yield* MosaicStudio.MosaicStudio;
      const root = NodeFS.mkdtempSync(NodePath.join(NodeOS.tmpdir(), "t3-mosaic-plain-"));
      dirs.push(root);
      expect(yield* studio.inspect({ cwd: root })).toEqual({
        _tag: "NotMosaic",
        reason: "no-package-json",
      });
      write(root, "package.json", JSON.stringify({ scripts: { build: "vite build" } }));
      expect(yield* studio.inspect({ cwd: root })).toEqual({
        _tag: "NotMosaic",
        reason: "no-build-script",
      });
      const error = yield* studio.build({ cwd: root, clientId: "demo" }).pipe(Effect.flip);
      expect(error.failure).toBe("not-mosaic");
    }).pipe(Effect.provide(layerTest)),
  );

  it.effect(
    "builds a client into a receipt, labels stale output and never previews a failed build",
    () =>
      Effect.gen(function* () {
        const studio = yield* MosaicStudio.MosaicStudio;
        const root = makeMosaicRepo();
        const head = git(root, "rev-parse", "HEAD");

        const inspected = yield* studio.inspect({ cwd: root });
        expect(inspected).toMatchObject({
          _tag: "Mosaic",
          clients: [{ id: "demo", title: "Demo lab", family: "spatial" }],
        });
        expect(inspected._tag === "Mosaic" && inspected.variants).toEqual([
          expect.objectContaining({ head, branch: "main", current: true }),
        ]);

        const before = yield* studio.inspectClient({ cwd: root, clientId: "demo" });
        expect(before.status).toBe("not-built");
        expect(
          (yield* studio.openPreview({ cwd: root, clientId: "demo" }).pipe(Effect.flip)).failure,
        ).toBe("not-built");
        expect(before.artifacts).toEqual([
          expect.objectContaining({
            path: "public/artifacts/broken.json",
            problems: ["not valid JSON"],
          }),
          expect.objectContaining({
            path: "public/artifacts/result.json",
            provenanceKind: "synthetic",
            problems: [],
          }),
        ]);

        const built = yield* studio.build({ cwd: root, clientId: "demo" });
        expect(built.status).toBe("ready");
        expect(built.git).toEqual({ head, branch: "main", dirtyFiles: [], dirtyCount: 0 });
        expect(built.output).toMatchObject({
          path: "dist-clients/demo",
          fileCount: 3,
          capabilities: ["charts"],
        });
        expect(built.lastRun).toMatchObject({ exitCode: 0, headAtStart: head });
        expect(before.contract).toBeNull();
        expect(built.contract).toMatchObject({
          state: "verified",
          problems: [],
          descriptor: {
            entry: "index.html",
            sdkVersion: "0.8.1",
            sourceCommit: null,
            fileCount: 3,
            artifacts: [{ id: "result", provenance: "synthetic" }],
          },
        });

        const preview = yield* studio.openPreview({ cwd: root, clientId: "demo" });
        const page = yield* Effect.promise(() => fetch(preview.url).then((r) => r.text()));
        expect(page).toBe("<h1>demo</h1>");

        // An edit after the build leaves the output stale until rebuilt.
        write(
          root,
          "clients/demo/app.ts",
          "export default defineApp({manifest:{id:'demo',title:'Demo 2'}});",
        );
        const later = new Date(Date.now() + 5000);
        NodeFS.utimesSync(NodePath.join(root, "clients/demo/app.ts"), later, later);
        const stale = yield* studio.inspectClient({ cwd: root, clientId: "demo" });
        expect(stale.status).toBe("stale");
        expect(stale.contract?.state).toBe("stale");
        expect(stale.contract?.problems).toEqual(["sources changed after this build"]);
        expect(stale.git.dirtyFiles).toEqual(["clients/demo/app.ts"]);

        // A failing rebuild leaves the old output on disk, but it is never ready.
        write(root, "clients/demo/FAIL", "");
        const failed = yield* studio.build({ cwd: root, clientId: "demo" });
        expect(failed.status).toBe("failed");
        expect(failed.contract?.state).toBe("failed");
        expect(failed.lastRun?.exitCode).not.toBe(0);
        expect(failed.lastRun?.logTail).toContain("type error");
        const refused = yield* studio
          .openPreview({ cwd: root, clientId: "demo" })
          .pipe(Effect.flip);
        expect(refused.failure).toBe("build-failed");
      }).pipe(Effect.provide(layerTest)),
    60_000,
  );

  it.effect(
    "binds previews to the preview.json descriptor and labels legacy output",
    () =>
      Effect.gen(function* () {
        const studio = yield* MosaicStudio.MosaicStudio;
        const root = makeMosaicRepo();
        const input = { cwd: root, clientId: "demo" };
        const output = NodePath.join(root, "dist-clients/demo");

        expect((yield* studio.build(input)).contract?.state).toBe("verified");
        const preview = yield* studio.openPreview(input);
        const fetchPage = () =>
          Effect.promise(() =>
            fetch(preview.url).then(async (r) => ({ status: r.status, text: await r.text() })),
          );
        expect(yield* fetchPage()).toEqual({ status: 200, text: "<h1>demo</h1>" });

        // One changed output byte: the verified preview refuses it, the receipt turns stale.
        write(output, "index.html", "<h1>demO</h1>");
        expect((yield* fetchPage()).status).toBe(409);
        const tampered = yield* studio.inspectClient(input);
        expect(tampered.status).toBe("ready");
        expect(tampered.contract).toMatchObject({
          state: "stale",
          problems: ["content differs: index.html"],
        });
        // Stale output still opens, unbound, behind the stale label.
        yield* studio.openPreview(input);
        expect(yield* fetchPage()).toEqual({ status: 200, text: "<h1>demO</h1>" });

        // A forged descriptor (unknown field) is invalid and never previewed.
        const descriptor = JSON.parse(
          NodeFS.readFileSync(NodePath.join(output, "preview.json"), "utf8"),
        );
        write(output, "preview.json", JSON.stringify({ ...descriptor, deploy: "public" }));
        expect((yield* studio.inspectClient(input)).contract?.state).toBe("invalid");
        expect((yield* studio.openPreview(input).pipe(Effect.flip)).failure).toBe(
          "contract-invalid",
        );

        // An older client without preview.json is detected by its layout and opens unverified.
        write(root, "clients/demo/LEGACY", "");
        const legacy = yield* studio.build(input);
        expect(legacy.contract).toEqual({
          state: "legacy",
          problems: ["no preview.json: legacy adapter, unverified"],
          descriptor: null,
        });
        yield* studio.openPreview(input);
        expect((yield* fetchPage()).status).toBe(200);
      }).pipe(Effect.provide(layerTest)),
    60_000,
  );

  it.effect(
    "compares two worktree variants by head, changed files and output hash",
    () =>
      Effect.gen(function* () {
        const studio = yield* MosaicStudio.MosaicStudio;
        const root = makeMosaicRepo();
        const variant = NodePath.join(root, "..", `${NodePath.basename(root)}-variant`);
        dirs.push(variant);
        git(root, "worktree", "add", "-q", "-b", "variant", variant);
        write(
          variant,
          "clients/demo/app.ts",
          "export default defineApp({manifest:{id:'demo',title:'Variant'}});",
        );
        git(variant, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-am", "variant");

        const inspected = yield* studio.inspect({ cwd: variant });
        expect(inspected._tag === "Mosaic" && inspected.variants.map((v) => v.current)).toEqual([
          false,
          true,
        ]);

        yield* studio.build({ cwd: root, clientId: "demo" });
        yield* studio.build({ cwd: variant, clientId: "demo" });
        const result = yield* studio.compare({
          clientId: "demo",
          baseCwd: root,
          otherCwd: variant,
        });
        expect(result.changedFiles).toEqual(["clients/demo/app.ts"]);
        expect(result.base.git.head).not.toBe(result.other.git.head);
        expect(result.sameOutput).toBe(true);

        const unrelated = makeMosaicRepo();
        const error = yield* studio
          .compare({ clientId: "demo", baseCwd: root, otherCwd: unrelated })
          .pipe(Effect.flip);
        expect(error.failure).toBe("variants-unrelated");
      }).pipe(Effect.provide(layerTest)),
    60_000,
  );
});
