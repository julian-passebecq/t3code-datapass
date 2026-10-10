import * as Schema from "effect/Schema";

import { NonNegativeInt, TrimmedNonEmptyString } from "./baseSchemas.ts";

/**
 * Optional Mosaic (DataPass MosaicStudio) authoring support. T3 recognizes a
 * Mosaic checkout from its own layout (`clients/<id>/app.ts` plus the
 * `build:client` script), builds one client with the project's script, and
 * serves the build output on its own loopback origin for the preview browser.
 * The client build stays runnable without T3: T3 never writes into the
 * project except through that script.
 */

/** Mosaic's own client id rule (`scripts/client-dev.mjs`); it also keeps ids path-safe. */
export const MosaicClientId = TrimmedNonEmptyString.check(
  Schema.isPattern(/^[a-z][a-z0-9-]{0,59}$/),
);
export type MosaicClientId = typeof MosaicClientId.Type;

export const MosaicClientSummary = Schema.Struct({
  id: MosaicClientId,
  title: Schema.NullOr(Schema.String),
  family: Schema.NullOr(Schema.String),
});
export type MosaicClientSummary = typeof MosaicClientSummary.Type;

/** A Git worktree of the same repository: one buildable variant. */
export const MosaicVariant = Schema.Struct({
  path: TrimmedNonEmptyString,
  branch: Schema.NullOr(Schema.String),
  head: Schema.NullOr(Schema.String),
  current: Schema.Boolean,
});
export type MosaicVariant = typeof MosaicVariant.Type;

export const MosaicInspectInput = Schema.Struct({
  cwd: TrimmedNonEmptyString,
});
export type MosaicInspectInput = typeof MosaicInspectInput.Type;

export const MosaicNotDetectedReason = Schema.Literals([
  "no-package-json",
  "no-build-script",
  "no-clients",
]);
export type MosaicNotDetectedReason = typeof MosaicNotDetectedReason.Type;

export const MosaicInspectResult = Schema.Union([
  Schema.TaggedStruct("NotMosaic", {
    reason: MosaicNotDetectedReason,
  }),
  Schema.TaggedStruct("Mosaic", {
    clients: Schema.Array(MosaicClientSummary),
    variants: Schema.Array(MosaicVariant),
  }),
]);
export type MosaicInspectResult = typeof MosaicInspectResult.Type;

export const MosaicClientInput = Schema.Struct({
  cwd: TrimmedNonEmptyString,
  clientId: MosaicClientId,
});
export type MosaicClientInput = typeof MosaicClientInput.Type;

/**
 * `ready` means the output is newer than every source file and the last T3
 * build of this checkout did not fail after it. A failed build is never
 * `ready`; output older than the sources is `stale` until rebuilt.
 */
export const MosaicBuildStatus = Schema.Literals([
  "not-built",
  "building",
  "failed",
  "stale",
  "ready",
]);
export type MosaicBuildStatus = typeof MosaicBuildStatus.Type;

export const MosaicArtifactFormat = Schema.Literals([
  "datapass.artifact",
  "datapass.concept-spec",
  "unknown",
]);
export type MosaicArtifactFormat = typeof MosaicArtifactFormat.Type;

/** A contract document found in the client's sources, checked against its required fields. */
export const MosaicArtifactSummary = Schema.Struct({
  path: Schema.String,
  format: MosaicArtifactFormat,
  id: Schema.NullOr(Schema.String),
  title: Schema.NullOr(Schema.String),
  provenanceKind: Schema.NullOr(Schema.String),
  provenanceSource: Schema.NullOr(Schema.String),
  problems: Schema.Array(Schema.String),
});
export type MosaicArtifactSummary = typeof MosaicArtifactSummary.Type;

/**
 * `datapass.preview/1`: the descriptor Mosaic writes to `dist-clients/<id>/preview.json`
 * after a successful build. Mirrors the producer's JSON Schema exactly, pinned to
 * the version below; a change of shape upstream is `datapass.preview/2`.
 */
export const MOSAIC_PREVIEW_SPEC = {
  producerCommit: "6f45dd06e95ee66d693fc08fb4369c2a6379e84c",
  schemaPath: "spec/preview/v1/preview.schema.json",
  schemaSha256: "ede4a49842b47c76bada4d94c74bfb48adf0d2c887bfc43d000314f03bf194b2",
  fileName: "preview.json",
  maxFiles: 2000,
} as const;

// eslint-disable-next-line no-control-regex -- the producer's schema forbids control characters.
const NO_CONTROL_CHARACTERS = /^[^\u0000-\u001f]*$/;

/** Relative POSIX path inside the app folder: no leading slash, backslash, drive, empty, `.` or `..` segment. */
export const MosaicPreviewPath = Schema.String.check(
  Schema.isBetweenLength(1, 260),
  Schema.isPattern(/^(?!.*(?:^|\/)\.{1,2}(?:\/|$))[A-Za-z0-9._~@+-]+(?:\/[A-Za-z0-9._~@+-]+)*$/),
);

export const MosaicPreviewSha256 = Schema.String.check(Schema.isPattern(/^[0-9a-f]{64}$/));

export const MosaicPreviewProvenance = Schema.Literals(["synthetic", "provided", "computed"]);

export const MosaicPreviewApp = Schema.Struct({
  id: Schema.String.check(Schema.isPattern(/^[a-z][a-z0-9-]{0,59}$/)),
  title: Schema.String.check(
    Schema.isBetweenLength(1, 160),
    Schema.isPattern(NO_CONTROL_CHARACTERS),
  ),
  variant: Schema.Literals(["client", "workbench", "standalone"]),
});

export const MosaicPreviewPublication = Schema.Struct({
  mode: Schema.Literals(["preview", "public"]),
  noindex: Schema.Boolean,
});

export const MosaicPreviewOpen = Schema.Struct({
  file: Schema.Boolean,
  httpLoopback: Schema.Boolean,
});

export const MosaicPreviewArtifact = Schema.Struct({
  id: Schema.String.check(Schema.isPattern(/^[a-z][a-zA-Z0-9_-]{0,79}$/)),
  path: MosaicPreviewPath,
  sha256: MosaicPreviewSha256,
  provenance: MosaicPreviewProvenance,
});
export type MosaicPreviewArtifact = typeof MosaicPreviewArtifact.Type;

const MosaicPreviewSdkVersion = Schema.String.check(
  Schema.isMaxLength(64),
  Schema.isPattern(/^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$/),
);
/** Null when the build came from uncommitted changes or outside Git. */
const MosaicPreviewSourceCommit = Schema.NullOr(
  Schema.String.check(Schema.isPattern(/^[0-9a-f]{40}([0-9a-f]{24})?$/)),
);
const MosaicPreviewCapabilities = Schema.Array(
  Schema.String.check(Schema.isPattern(/^[a-z][a-z0-9-]{0,39}$/)),
).check(Schema.isMaxLength(32), Schema.isUnique());

/** The schema's cross-reference rules, which JSON Schema alone cannot express. */
const previewCrossReferences = Schema.makeFilter<{
  readonly entry: string;
  readonly files: ReadonlyArray<{ readonly path: string; readonly sha256: string }>;
  readonly artifacts: ReadonlyArray<{
    readonly id: string;
    readonly path: string;
    readonly sha256: string;
  }>;
}>((descriptor) => {
  const issues: Array<{ readonly path: ReadonlyArray<PropertyKey>; readonly issue: string }> = [];
  const files = new Map<string, string>();
  descriptor.files.forEach((file, index) => {
    if (files.has(file.path))
      issues.push({ path: ["files", index, "path"], issue: "duplicate path" });
    files.set(file.path, file.sha256);
  });
  if (!files.has(descriptor.entry)) issues.push({ path: ["entry"], issue: "not listed in files" });
  const ids = new Set<string>();
  descriptor.artifacts.forEach((artifact, index) => {
    if (ids.has(artifact.id)) {
      issues.push({ path: ["artifacts", index, "id"], issue: "duplicate artifact id" });
    }
    ids.add(artifact.id);
    const listed = files.get(artifact.path);
    if (listed === undefined) {
      issues.push({ path: ["artifacts", index, "path"], issue: "not listed in files" });
    } else if (listed !== artifact.sha256) {
      issues.push({ path: ["artifacts", index, "sha256"], issue: "differs from the files entry" });
    }
  });
  return issues;
});

export const MosaicPreviewDescriptor = Schema.Struct({
  $schema: Schema.optionalKey(Schema.String.check(Schema.isMaxLength(300))),
  format: Schema.Literal("datapass.preview"),
  version: Schema.Literal(1),
  app: MosaicPreviewApp,
  entry: MosaicPreviewPath,
  sdkVersion: MosaicPreviewSdkVersion,
  sourceCommit: MosaicPreviewSourceCommit,
  publication: MosaicPreviewPublication,
  capabilities: MosaicPreviewCapabilities,
  files: Schema.Array(
    Schema.Struct({
      path: MosaicPreviewPath,
      bytes: Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 1073741824 })),
      sha256: MosaicPreviewSha256,
    }),
  ).check(Schema.isBetweenLength(1, MOSAIC_PREVIEW_SPEC.maxFiles)),
  artifacts: Schema.Array(MosaicPreviewArtifact).check(Schema.isMaxLength(200)),
  open: MosaicPreviewOpen,
  csp: Schema.String.check(
    Schema.isBetweenLength(1, 4096),
    Schema.isPattern(NO_CONTROL_CHARACTERS),
  ),
}).check(previewCrossReferences);
export type MosaicPreviewDescriptor = typeof MosaicPreviewDescriptor.Type;

/** Decodes `preview.json` text. Unknown fields are rejected, as the producer's schema requires. */
export const decodeMosaicPreviewDescriptor = Schema.decodeUnknownExit(
  Schema.fromJsonString(MosaicPreviewDescriptor),
  { onExcessProperty: "error", errors: "all" },
);

/**
 * How far the output can be trusted: `verified` (a valid descriptor whose every
 * file matches the bytes on disk), `stale` (sources or output changed after the
 * build), `invalid` (descriptor malformed or forged), `failed` (the last build
 * failed) or `legacy` (no descriptor: an older client, shown unverified).
 */
export const MosaicContractState = Schema.Literals([
  "verified",
  "stale",
  "invalid",
  "failed",
  "legacy",
]);
export type MosaicContractState = typeof MosaicContractState.Type;

/** The descriptor fields worth showing; the file list stays on the server. */
export const MosaicPreviewSummary = Schema.Struct({
  app: MosaicPreviewApp,
  entry: MosaicPreviewPath,
  sdkVersion: MosaicPreviewSdkVersion,
  sourceCommit: MosaicPreviewSourceCommit,
  publication: MosaicPreviewPublication,
  capabilities: MosaicPreviewCapabilities,
  open: MosaicPreviewOpen,
  fileCount: NonNegativeInt,
  artifacts: Schema.Array(MosaicPreviewArtifact),
});
export type MosaicPreviewSummary = typeof MosaicPreviewSummary.Type;

export const MosaicPreviewContract = Schema.Struct({
  state: MosaicContractState,
  /** Why the state is not `verified`, bounded. */
  problems: Schema.Array(Schema.String),
  descriptor: Schema.NullOr(MosaicPreviewSummary),
});
export type MosaicPreviewContract = typeof MosaicPreviewContract.Type;

export const MosaicBuildRun = Schema.Struct({
  command: Schema.String,
  exitCode: Schema.NullOr(Schema.Number),
  timedOut: Schema.Boolean,
  startedAt: Schema.String,
  finishedAt: Schema.String,
  headAtStart: Schema.NullOr(Schema.String),
  logTail: Schema.String,
});
export type MosaicBuildRun = typeof MosaicBuildRun.Type;

/** Links a build output to the exact checkout state it was inspected at. */
export const MosaicBuildReceipt = Schema.Struct({
  format: Schema.Literal("t3.mosaic-build-receipt"),
  version: Schema.Literal(1),
  cwd: TrimmedNonEmptyString,
  clientId: MosaicClientId,
  status: MosaicBuildStatus,
  git: Schema.Struct({
    head: Schema.NullOr(Schema.String),
    branch: Schema.NullOr(Schema.String),
    dirtyFiles: Schema.Array(Schema.String),
    dirtyCount: NonNegativeInt,
  }),
  output: Schema.NullOr(
    Schema.Struct({
      path: Schema.String,
      fileCount: NonNegativeInt,
      totalBytes: NonNegativeInt,
      sha256: Schema.String,
      builtAt: Schema.String,
      capabilities: Schema.Array(Schema.String),
    }),
  ),
  newestSourceAt: Schema.NullOr(Schema.String),
  lastRun: Schema.NullOr(MosaicBuildRun),
  artifacts: Schema.Array(MosaicArtifactSummary),
  /** The datapass.preview/1 check of the output; null when nothing was built yet. */
  contract: Schema.NullOr(MosaicPreviewContract),
  inspectedAt: Schema.String,
});
export type MosaicBuildReceipt = typeof MosaicBuildReceipt.Type;

export const MosaicPreviewResult = Schema.Struct({
  url: TrimmedNonEmptyString,
  receipt: MosaicBuildReceipt,
});
export type MosaicPreviewResult = typeof MosaicPreviewResult.Type;

export const MosaicCompareInput = Schema.Struct({
  clientId: MosaicClientId,
  baseCwd: TrimmedNonEmptyString,
  otherCwd: TrimmedNonEmptyString,
});
export type MosaicCompareInput = typeof MosaicCompareInput.Type;

export const MosaicCompareResult = Schema.Struct({
  base: MosaicBuildReceipt,
  other: MosaicBuildReceipt,
  /** Files changed between the two committed heads; dirty files are on each receipt. */
  changedFiles: Schema.Array(Schema.String),
  changedFilesTruncated: Schema.Boolean,
  sameOutput: Schema.Boolean,
});
export type MosaicCompareResult = typeof MosaicCompareResult.Type;

export const MosaicFailure = Schema.Literals([
  "not-mosaic",
  "client-not-found",
  "not-built",
  "build-failed",
  "build-in-progress",
  "contract-invalid",
  "io-failed",
  "preview-start-failed",
  "variants-unrelated",
]);
export type MosaicFailure = typeof MosaicFailure.Type;

export class MosaicError extends Schema.TaggedError<MosaicError>()("MosaicError", {
  failure: MosaicFailure,
  cwd: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String),
  cause: Schema.optional(Schema.Defect()),
}) {
  override get message(): string {
    switch (this.failure) {
      case "not-mosaic":
        return "This folder is not a Mosaic project.";
      case "client-not-found":
        return `Mosaic client '${this.clientId ?? ""}' was not found.`;
      case "not-built":
        return "Build this client before previewing it.";
      case "build-failed":
        return "The last build failed. Fix it and build again before previewing.";
      case "build-in-progress":
        return "A build of this client is already running.";
      case "contract-invalid":
        return "The build's preview.json is invalid. Rebuild before previewing.";
      case "io-failed":
        return "Could not read the Mosaic project.";
      case "preview-start-failed":
        return "Could not start the preview server.";
      case "variants-unrelated":
        return "These two folders are not worktrees of the same repository.";
    }
  }
}
