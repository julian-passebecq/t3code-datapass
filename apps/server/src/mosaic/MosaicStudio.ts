// @effect-diagnostics nodeBuiltinImport:off - output hashing streams through node:crypto.
/**
 * MosaicStudio - optional authoring support for DataPass Mosaic checkouts.
 *
 * Recognizes a Mosaic project from its own layout, builds one client with the
 * project's `build:client` script, inspects the output into a build receipt,
 * and hands the output to MosaicPreviewHost. T3 adds no Mosaic dependency and
 * writes nothing into the project itself; the same build runs from the CLI.
 *
 * @module MosaicStudio
 */
import * as NodeCrypto from "node:crypto";

import {
  type MosaicBuildReceipt,
  type MosaicBuildRun,
  type MosaicClientInput,
  type MosaicClientSummary,
  type MosaicCompareInput,
  type MosaicCompareResult,
  MosaicError,
  type MosaicInspectInput,
  type MosaicInspectResult,
  type MosaicPreviewResult,
  type MosaicArtifactSummary,
} from "@t3tools/contracts";
import * as Context from "effect/Context";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Schema from "effect/Schema";

import * as MosaicPreviewHost from "./MosaicPreviewHost.ts";
import { ProcessRunner } from "../processRunner.ts";
import {
  MAX_ARTIFACT_BYTES,
  deriveBuildStatus,
  extractClientTitle,
  logTail,
  parseWorktreeList,
  runFailed,
  summarizeContractDocument,
  unreadableContractDocument,
} from "./mosaicReceipt.ts";

const CLIENT_ID_PATTERN = /^[a-z][a-z0-9-]{0,59}$/;
const BUILD_TIMEOUT = "15 minutes";
const MAX_SOURCE_FILES = 20_000;
const MAX_ARTIFACT_FILES = 50;
const MAX_DIRTY_FILES = 200;
const MAX_CHANGED_FILES = 500;
const decodeJson = Schema.decodeUnknownOption(Schema.fromJsonString(Schema.Unknown));
const isoAt = (ms: number) => DateTime.formatIso(DateTime.makeUnsafe(ms));

/** A string field of a parsed JSON object, or undefined. */
const field = (value: unknown, key: string): unknown =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)[key]
    : undefined;

const IGNORED_SOURCE_SEGMENTS = new Set(["node_modules", "dist", ".generated", "qa"]);

export class MosaicStudio extends Context.Service<
  MosaicStudio,
  {
    readonly inspect: (
      input: MosaicInspectInput,
    ) => Effect.Effect<MosaicInspectResult, MosaicError>;
    readonly inspectClient: (
      input: MosaicClientInput,
    ) => Effect.Effect<MosaicBuildReceipt, MosaicError>;
    readonly build: (input: MosaicClientInput) => Effect.Effect<MosaicBuildReceipt, MosaicError>;
    readonly openPreview: (
      input: MosaicClientInput,
    ) => Effect.Effect<MosaicPreviewResult, MosaicError>;
    readonly compare: (
      input: MosaicCompareInput,
    ) => Effect.Effect<MosaicCompareResult, MosaicError>;
  }
>()("t3/mosaic/MosaicStudio") {}

const make = Effect.gen(function* () {
  const fileSystem = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const processRunner = yield* ProcessRunner;
  const previewHost = yield* MosaicPreviewHost.MosaicPreviewHost;

  /** The last T3 build per checkout and client, with the output time it left behind. */
  const lastRuns = new Map<
    string,
    { readonly run: MosaicBuildRun; readonly outputBuiltAtMs: number | null }
  >();
  const building = new Set<string>();
  const runKey = (cwd: string, clientId: string) => `${path.resolve(cwd)}\0${clientId}`;

  const ioFailed = (input: { readonly cwd: string; readonly clientId?: string }) =>
    Effect.mapError(
      (cause: unknown) =>
        new MosaicError({
          failure: "io-failed",
          cwd: input.cwd,
          ...(input.clientId === undefined ? {} : { clientId: input.clientId }),
          cause,
        }),
    );

  const exists = (target: string) =>
    fileSystem.exists(target).pipe(Effect.orElseSucceed(() => false));

  const readText = (target: string) => fileSystem.readFileString(target).pipe(Effect.option);

  const git = (cwd: string, args: ReadonlyArray<string>) =>
    processRunner
      .run({ command: "git", args, cwd, timeout: "20 seconds", maxOutputBytes: 1024 * 1024 })
      .pipe(
        Effect.map((result) => (result.code === 0 ? result.stdout : null)),
        Effect.orElseSucceed(() => null),
      );

  /** Detects the Mosaic layout: a `build:client` script and at least one `clients/<id>/app.ts`. */
  const detect = Effect.fn("MosaicStudio.detect")(function* (cwd: string) {
    const packageJson = yield* readText(path.join(cwd, "package.json"));
    if (Option.isNone(packageJson))
      return { _tag: "NotMosaic", reason: "no-package-json" } as const;
    const parsedPackage = decodeJson(packageJson.value);
    if (Option.isNone(parsedPackage)) {
      return { _tag: "NotMosaic", reason: "no-package-json" } as const;
    }
    if (typeof field(field(parsedPackage.value, "scripts"), "build:client") !== "string") {
      return { _tag: "NotMosaic", reason: "no-build-script" } as const;
    }
    const clientsDir = path.join(cwd, "clients");
    const entries = yield* fileSystem
      .readDirectory(clientsDir)
      .pipe(Effect.orElseSucceed((): string[] => []));
    const clients: MosaicClientSummary[] = [];
    for (const id of entries.toSorted()) {
      if (!CLIENT_ID_PATTERN.test(id)) continue;
      const appSource = yield* readText(path.join(clientsDir, id, "app.ts"));
      if (Option.isNone(appSource)) continue;
      const profile = yield* readText(path.join(clientsDir, id, "client.config.json"));
      const familyValue = Option.isSome(profile)
        ? Option.match(decodeJson(profile.value), {
            onNone: () => undefined,
            onSome: (parsed) => field(parsed, "family"),
          })
        : undefined;
      const family = typeof familyValue === "string" ? familyValue : null;
      clients.push({ id, title: extractClientTitle(appSource.value), family });
    }
    if (clients.length === 0) return { _tag: "NotMosaic", reason: "no-clients" } as const;
    return { _tag: "Mosaic", clients } as const;
  });

  const requireClient = Effect.fn("MosaicStudio.requireClient")(function* (
    input: MosaicClientInput,
  ) {
    const detected = yield* detect(input.cwd);
    if (detected._tag === "NotMosaic") {
      return yield* new MosaicError({ failure: "not-mosaic", cwd: input.cwd });
    }
    if (!detected.clients.some((client) => client.id === input.clientId)) {
      return yield* new MosaicError({
        failure: "client-not-found",
        cwd: input.cwd,
        clientId: input.clientId,
      });
    }
  });

  /** Lists files under `root` (relative, `/`-separated), skipping build and dependency folders. */
  const listFiles = (root: string, limit: number) =>
    fileSystem.readDirectory(root, { recursive: true }).pipe(
      Effect.map((entries) =>
        entries
          .map((entry) => entry.split(path.sep).join("/"))
          .filter((entry) => !entry.split("/").some((part) => IGNORED_SOURCE_SEGMENTS.has(part)))
          .toSorted()
          .slice(0, limit),
      ),
      Effect.orElseSucceed((): string[] => []),
    );

  const statFile = (target: string) =>
    fileSystem.stat(target).pipe(
      Effect.map((info) =>
        info.type === "File"
          ? {
              size: Number(info.size),
              mtimeMs: Option.match(info.mtime, {
                onNone: () => 0,
                onSome: (date) => date.getTime(),
              }),
            }
          : null,
      ),
      Effect.orElseSucceed(() => null),
    );

  const newestMtime = Effect.fn("MosaicStudio.newestMtime")(function* (
    roots: ReadonlyArray<string>,
  ) {
    let newest: number | null = null;
    for (const root of roots) {
      for (const file of yield* listFiles(root, MAX_SOURCE_FILES)) {
        const info = yield* statFile(path.join(root, file));
        if (info !== null && (newest === null || info.mtimeMs > newest)) newest = info.mtimeMs;
      }
    }
    return newest;
  });

  /** Hashes every output file into one digest over `path\0sha256` lines, in path order. */
  const inspectOutput = Effect.fn("MosaicStudio.inspectOutput")(function* (outputDir: string) {
    if (!(yield* exists(path.join(outputDir, "index.html")))) return null;
    const files = yield* listFiles(outputDir, MAX_SOURCE_FILES);
    const digest = NodeCrypto.createHash("sha256");
    let fileCount = 0;
    let totalBytes = 0;
    let builtAtMs = 0;
    for (const file of files) {
      const absolute = path.join(outputDir, file);
      const info = yield* statFile(absolute);
      if (info === null) continue;
      const bytes = yield* fileSystem.readFile(absolute).pipe(Effect.option);
      if (Option.isNone(bytes)) continue;
      digest.update(
        `${file}\0${NodeCrypto.createHash("sha256").update(bytes.value).digest("hex")}\n`,
      );
      fileCount += 1;
      totalBytes += info.size;
      builtAtMs = Math.max(builtAtMs, info.mtimeMs);
    }
    const studioBuild = (yield* readText(path.join(outputDir, "studio-build.json"))).pipe(
      Option.flatMap(decodeJson),
      Option.map((parsed) => field(parsed, "capabilities")),
    );
    const capabilities =
      Option.isSome(studioBuild) && Array.isArray(studioBuild.value)
        ? studioBuild.value.filter((item): item is string => typeof item === "string")
        : [];
    return {
      fileCount,
      totalBytes,
      sha256: digest.digest("hex"),
      builtAtMs,
      capabilities,
    };
  });

  /** Mosaic contract documents shipped with the client, checked but rendered only by Mosaic. */
  const inspectArtifacts = Effect.fn("MosaicStudio.inspectArtifacts")(function* (
    clientDir: string,
  ) {
    const summaries: MosaicArtifactSummary[] = [];
    const files = (yield* listFiles(clientDir, MAX_SOURCE_FILES)).filter((file) =>
      file.endsWith(".json"),
    );
    for (const file of files) {
      if (summaries.length >= MAX_ARTIFACT_FILES) break;
      const absolute = path.join(clientDir, file);
      const info = yield* statFile(absolute);
      if (info === null) continue;
      const claimsContract =
        file.endsWith(".concept.json") || file.split("/").includes("artifacts");
      if (info.size > MAX_ARTIFACT_BYTES) {
        if (claimsContract) summaries.push(unreadableContractDocument(file, "larger than 1 MB"));
        continue;
      }
      const text = yield* readText(absolute);
      if (Option.isNone(text)) continue;
      const parsed = decodeJson(text.value);
      if (Option.isNone(parsed)) {
        if (claimsContract) summaries.push(unreadableContractDocument(file, "not valid JSON"));
        continue;
      }
      const summary = summarizeContractDocument(file, parsed.value);
      if (summary !== undefined) summaries.push(summary);
    }
    return summaries;
  });

  const receiptFor = Effect.fn("MosaicStudio.receiptFor")(function* (input: MosaicClientInput) {
    const cwd = path.resolve(input.cwd);
    const clientDir = path.join(cwd, "clients", input.clientId);
    const outputRelative = `dist-clients/${input.clientId}`;
    const [head, branch, status, output, newestSourceAtMs, artifacts] = yield* Effect.all(
      [
        git(cwd, ["rev-parse", "HEAD"]),
        git(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]),
        git(cwd, ["status", "--porcelain=v1", "--untracked-files=normal"]),
        inspectOutput(path.join(cwd, outputRelative)),
        newestMtime([clientDir, path.join(cwd, "src")]),
        inspectArtifacts(clientDir),
      ],
      { concurrency: "unbounded" },
    );
    const dirtyFiles = (status ?? "")
      .split(/\r?\n/)
      .filter((line) => line.length > 3)
      .map((line) => line.slice(3));
    const last = lastRuns.get(runKey(cwd, input.clientId));
    const lastRun = last?.run ?? null;
    const receipt: MosaicBuildReceipt = {
      format: "t3.mosaic-build-receipt",
      version: 1,
      cwd,
      clientId: input.clientId,
      status: deriveBuildStatus({
        building: building.has(runKey(cwd, input.clientId)),
        outputBuiltAtMs: output?.builtAtMs ?? null,
        newestSourceAtMs,
        lastFailure:
          last !== undefined && runFailed(last.run)
            ? { outputBuiltAtMs: last.outputBuiltAtMs }
            : null,
      }),
      git: {
        head: head?.trim() || null,
        branch: branch?.trim() === "HEAD" ? null : branch?.trim() || null,
        dirtyFiles: dirtyFiles.slice(0, MAX_DIRTY_FILES),
        dirtyCount: dirtyFiles.length,
      },
      output:
        output === null
          ? null
          : {
              path: outputRelative,
              fileCount: output.fileCount,
              totalBytes: output.totalBytes,
              sha256: output.sha256,
              builtAt: isoAt(output.builtAtMs),
              capabilities: output.capabilities,
            },
      newestSourceAt: newestSourceAtMs === null ? null : isoAt(newestSourceAtMs),
      lastRun,
      artifacts,
      inspectedAt: DateTime.formatIso(yield* DateTime.now),
    };
    return receipt;
  });

  const inspect: MosaicStudio["Service"]["inspect"] = Effect.fn("MosaicStudio.inspect")(
    function* (input) {
      const cwd = path.resolve(input.cwd);
      const detected = yield* detect(cwd);
      if (detected._tag === "NotMosaic") return detected;
      const porcelain = yield* git(cwd, ["worktree", "list", "--porcelain"]);
      const normalize = (value: string) => path.resolve(value).toLowerCase();
      const variants =
        porcelain === null
          ? [{ path: cwd, head: null, branch: null, current: true }]
          : parseWorktreeList(porcelain, (variant) => normalize(variant) === normalize(cwd));
      return { _tag: "Mosaic", clients: detected.clients, variants };
    },
  );

  const inspectClient: MosaicStudio["Service"]["inspectClient"] = Effect.fn(
    "MosaicStudio.inspectClient",
  )(function* (input) {
    yield* requireClient(input);
    return yield* receiptFor(input).pipe(ioFailed(input));
  });

  const build: MosaicStudio["Service"]["build"] = Effect.fn("MosaicStudio.build")(
    function* (input) {
      yield* requireClient(input);
      const cwd = path.resolve(input.cwd);
      const key = runKey(cwd, input.clientId);
      if (building.has(key)) {
        return yield* new MosaicError({
          failure: "build-in-progress",
          cwd,
          clientId: input.clientId,
        });
      }
      building.add(key);
      const args = ["run", "build:client", "--", input.clientId];
      const startedAt = DateTime.formatIso(yield* DateTime.now);
      const headAtStart = (yield* git(cwd, ["rev-parse", "HEAD"]))?.trim() || null;
      const result = yield* processRunner
        .run({
          command: "npm",
          args,
          cwd,
          timeout: BUILD_TIMEOUT,
          timeoutBehavior: "timedOutResult",
          outputMode: "truncate",
          maxOutputBytes: 512 * 1024,
        })
        .pipe(
          Effect.map((output) => ({
            exitCode: output.code === null ? null : Number(output.code),
            timedOut: output.timedOut,
            log: `${output.stdout}${output.stderr === "" ? "" : `\n${output.stderr}`}`,
          })),
          Effect.catch((error) =>
            Effect.succeed({ exitCode: null, timedOut: false, log: error.message }),
          ),
          Effect.ensuring(Effect.sync(() => building.delete(key))),
        );
      const finishedAt = DateTime.formatIso(yield* DateTime.now);
      const outputAfter = yield* inspectOutput(path.join(cwd, "dist-clients", input.clientId));
      lastRuns.set(key, {
        run: {
          command: `npm ${args.join(" ")}`,
          exitCode: result.exitCode,
          timedOut: result.timedOut,
          startedAt,
          finishedAt,
          headAtStart,
          logTail: logTail(result.log),
        },
        outputBuiltAtMs: outputAfter?.builtAtMs ?? null,
      });
      return yield* receiptFor(input).pipe(ioFailed(input));
    },
  );

  const openPreview: MosaicStudio["Service"]["openPreview"] = Effect.fn("MosaicStudio.openPreview")(
    function* (input) {
      const receipt = yield* inspectClient(input);
      if (receipt.status === "failed") {
        return yield* new MosaicError({
          failure: "build-failed",
          cwd: input.cwd,
          clientId: input.clientId,
        });
      }
      if (receipt.output === null) {
        return yield* new MosaicError({
          failure: "not-built",
          cwd: input.cwd,
          clientId: input.clientId,
        });
      }
      const origin = yield* previewHost.serve(path.join(receipt.cwd, receipt.output.path)).pipe(
        Effect.mapError(
          (cause) =>
            new MosaicError({
              failure: "preview-start-failed",
              cwd: input.cwd,
              clientId: input.clientId,
              cause,
            }),
        ),
      );
      return { url: `${origin}/`, receipt };
    },
  );

  const compare: MosaicStudio["Service"]["compare"] = Effect.fn("MosaicStudio.compare")(
    function* (input) {
      const [base, other] = yield* Effect.all(
        [
          inspectClient({ cwd: input.baseCwd, clientId: input.clientId }),
          inspectClient({ cwd: input.otherCwd, clientId: input.clientId }),
        ],
        { concurrency: 2 },
      );
      const [baseCommon, otherCommon] = yield* Effect.all([
        git(base.cwd, ["rev-parse", "--git-common-dir"]),
        git(other.cwd, ["rev-parse", "--git-common-dir"]),
      ]);
      const commonDir = (cwd: string, value: string | null) =>
        value === null ? null : path.resolve(cwd, value.trim()).toLowerCase();
      if (
        commonDir(base.cwd, baseCommon) === null ||
        commonDir(base.cwd, baseCommon) !== commonDir(other.cwd, otherCommon)
      ) {
        return yield* new MosaicError({
          failure: "variants-unrelated",
          cwd: input.otherCwd,
          clientId: input.clientId,
        });
      }
      let changedFiles: string[] = [];
      if (base.git.head !== null && other.git.head !== null && base.git.head !== other.git.head) {
        const diff = yield* git(base.cwd, ["diff", "--name-only", base.git.head, other.git.head]);
        changedFiles = (diff ?? "").split(/\r?\n/).filter((line) => line !== "");
      }
      return {
        base,
        other,
        changedFiles: changedFiles.slice(0, MAX_CHANGED_FILES),
        changedFilesTruncated: changedFiles.length > MAX_CHANGED_FILES,
        sameOutput:
          base.output !== null &&
          other.output !== null &&
          base.output.sha256 === other.output.sha256,
      };
    },
  );

  return MosaicStudio.of({ inspect, inspectClient, build, openPreview, compare });
});

export const layer = Layer.effect(MosaicStudio, make);
