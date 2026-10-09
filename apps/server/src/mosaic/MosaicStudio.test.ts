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
// FAIL marker, otherwise writes a minimal client output.
const BUILD_SCRIPT = `
import fs from "node:fs";
const id = process.argv[2];
if (fs.existsSync(\`clients/\${id}/FAIL\`)) { console.error("tsc: type error in app.ts"); process.exit(1); }
fs.mkdirSync(\`dist-clients/\${id}\`, { recursive: true });
fs.writeFileSync(\`dist-clients/\${id}/index.html\`, "<h1>" + id + "</h1>");
fs.writeFileSync(\`dist-clients/\${id}/studio-build.json\`, JSON.stringify({ format: "datapass.client-build", version: 1, client: id, capabilities: ["charts"] }));
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
          fileCount: 2,
          capabilities: ["charts"],
        });
        expect(built.lastRun).toMatchObject({ exitCode: 0, headAtStart: head });

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
        expect(stale.git.dirtyFiles).toEqual(["clients/demo/app.ts"]);

        // A failing rebuild leaves the old output on disk, but it is never ready.
        write(root, "clients/demo/FAIL", "");
        const failed = yield* studio.build({ cwd: root, clientId: "demo" });
        expect(failed.status).toBe("failed");
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
