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
      case "io-failed":
        return "Could not read the Mosaic project.";
      case "preview-start-failed":
        return "Could not start the preview server.";
      case "variants-unrelated":
        return "These two folders are not worktrees of the same repository.";
    }
  }
}
