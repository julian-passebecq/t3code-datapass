import {
  type MosaicArtifactSummary,
  type MosaicBuildRun,
  type MosaicBuildStatus,
  type MosaicPreviewContract,
  type MosaicPreviewDescriptor,
  type MosaicPreviewSummary,
  type MosaicVariant,
  decodeMosaicPreviewDescriptor,
} from "@t3tools/contracts";
import * as Cause from "effect/Cause";
import * as Exit from "effect/Exit";

/** Mosaic's contract documents bound a compact JSON artifact to 1 MB. */
export const MAX_ARTIFACT_BYTES = 1024 * 1024;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const stringOrNull = (value: unknown) => (typeof value === "string" ? value : null);

const PROVENANCE_KINDS = new Set(["synthetic", "provided", "computed"]);

/**
 * Checks a parsed JSON document against the required top-level fields of the
 * Mosaic contract it claims (`datapass.artifact` v1, `datapass.concept-spec`
 * v1). Mosaic owns the full schema and renders the document; T3 only reports
 * what it found and its provenance. Documents of other formats return
 * `undefined` so ordinary JSON files are not listed.
 */
export function summarizeContractDocument(
  path: string,
  document: unknown,
): MosaicArtifactSummary | undefined {
  if (!isRecord(document)) return undefined;
  const format =
    document.format === "datapass.artifact"
      ? "datapass.artifact"
      : document.format === "datapass.concept-spec"
        ? "datapass.concept-spec"
        : undefined;
  if (format === undefined) return undefined;

  const problems: string[] = [];
  if (document.version !== 1) problems.push("version is not 1");
  for (const field of ["id", "title"] as const) {
    if (typeof document[field] !== "string" || document[field] === "") {
      problems.push(`missing ${field}`);
    }
  }
  const provenance = isRecord(document.provenance) ? document.provenance : undefined;
  if (provenance === undefined) {
    problems.push("missing provenance");
  } else if (format === "datapass.artifact") {
    if (typeof provenance.kind !== "string" || !PROVENANCE_KINDS.has(provenance.kind)) {
      problems.push("provenance.kind is not synthetic, provided or computed");
    }
    if (typeof provenance.source !== "string") problems.push("missing provenance.source");
  }
  const required =
    format === "datapass.artifact"
      ? (["payload", "representations"] as const)
      : (["layers", "domains", "nodes", "flows"] as const);
  for (const field of required) {
    if (document[field] === undefined) problems.push(`missing ${field}`);
  }

  return {
    path,
    format,
    id: stringOrNull(document.id),
    title: stringOrNull(document.title),
    provenanceKind: stringOrNull(provenance?.kind),
    provenanceSource: stringOrNull(provenance?.source),
    problems,
  };
}

/** A contract file too large or not JSON is still listed, so it is not silently dropped. */
export function unreadableContractDocument(path: string, problem: string): MosaicArtifactSummary {
  return {
    path,
    format: "unknown",
    id: null,
    title: null,
    provenanceKind: null,
    provenanceSource: null,
    problems: [problem],
  };
}

/**
 * The build status shown to the user. A failed T3 build stays failed until the
 * output changes after it (a later build from the CLI or an agent), so a failure
 * is never shown as ready. Otherwise output older than any source is stale.
 * Only file times are compared, never file times against the server clock.
 */
export function deriveBuildStatus(input: {
  readonly building: boolean;
  readonly outputBuiltAtMs: number | null;
  readonly newestSourceAtMs: number | null;
  readonly lastFailure: { readonly outputBuiltAtMs: number | null } | null;
}): MosaicBuildStatus {
  if (input.building) return "building";
  if (input.lastFailure !== null) {
    const rebuiltSince =
      input.outputBuiltAtMs !== null &&
      (input.lastFailure.outputBuiltAtMs === null ||
        input.outputBuiltAtMs > input.lastFailure.outputBuiltAtMs);
    if (!rebuiltSince) return "failed";
  }
  if (input.outputBuiltAtMs === null) return "not-built";
  if (input.newestSourceAtMs !== null && input.newestSourceAtMs > input.outputBuiltAtMs) {
    return "stale";
  }
  return "ready";
}

const MAX_CONTRACT_PROBLEMS = 20;

/** One regular file of a build output, hashed from its bytes on disk. */
export interface OutputFile {
  readonly path: string;
  readonly bytes: number;
  readonly sha256: string;
}

/**
 * Checks a build output against its `datapass.preview/1` descriptor.
 * `descriptorText` is `preview.json` (null when absent); `files` are the other
 * regular files on disk. Returns null when there is nothing to check yet.
 * Only a `verified` result may be served as matching the descriptor, and the
 * returned `files` (path to sha256) are what the preview host binds to.
 */
export function deriveContract(input: {
  readonly clientId: string;
  readonly buildStatus: MosaicBuildStatus;
  readonly hasOutput: boolean;
  readonly descriptorText: string | null;
  readonly files: ReadonlyArray<OutputFile>;
  /** More regular files than the descriptor may list, or symbolic links, were found. */
  readonly layoutProblems: ReadonlyArray<string>;
}): {
  readonly contract: MosaicPreviewContract;
  readonly files: ReadonlyMap<string, string>;
} | null {
  const bounded = (problems: ReadonlyArray<string>) => problems.slice(0, MAX_CONTRACT_PROBLEMS);
  const result = (
    state: MosaicPreviewContract["state"],
    problems: ReadonlyArray<string>,
    descriptor: MosaicPreviewDescriptor | null = null,
  ) => ({
    contract: {
      state,
      problems: bounded(problems),
      descriptor: descriptor === null ? null : summarizeDescriptor(descriptor),
    },
    files: new Map(descriptor?.files.map((file) => [file.path, file.sha256]) ?? []),
  });

  if (input.descriptorText === null) {
    if (input.buildStatus === "failed") return result("failed", ["the last build failed"]);
    return input.hasOutput
      ? result("legacy", ["no preview.json: legacy adapter, unverified"])
      : null;
  }
  const decoded = decodeMosaicPreviewDescriptor(input.descriptorText);
  if (Exit.isFailure(decoded)) {
    const error = Cause.squash(decoded.cause);
    const reason = (error instanceof Error ? error.message : String(error)).slice(0, 600);
    return result(input.buildStatus === "failed" ? "failed" : "invalid", [
      `preview.json is not a valid datapass.preview/1 document: ${reason}`,
    ]);
  }
  const descriptor = decoded.value;
  if (descriptor.app.id !== input.clientId) {
    return result("invalid", [`preview.json describes '${descriptor.app.id}'`], descriptor);
  }
  if (input.buildStatus === "failed")
    return result("failed", ["the last build failed"], descriptor);

  const problems = [...input.layoutProblems];
  const onDisk = new Map(input.files.map((file) => [file.path, file]));
  for (const listed of descriptor.files) {
    const actual = onDisk.get(listed.path);
    if (actual === undefined) problems.push(`missing file: ${listed.path}`);
    else if (actual.bytes !== listed.bytes || actual.sha256 !== listed.sha256) {
      problems.push(`content differs: ${listed.path}`);
    }
  }
  const listedPaths = new Set(descriptor.files.map((file) => file.path));
  for (const file of input.files) {
    if (!listedPaths.has(file.path)) problems.push(`unlisted file: ${file.path}`);
  }
  if (input.buildStatus === "stale") problems.push("sources changed after this build");
  return result(problems.length === 0 ? "verified" : "stale", problems, descriptor);
}

const summarizeDescriptor = (descriptor: MosaicPreviewDescriptor): MosaicPreviewSummary => ({
  app: descriptor.app,
  entry: descriptor.entry,
  sdkVersion: descriptor.sdkVersion,
  sourceCommit: descriptor.sourceCommit,
  publication: descriptor.publication,
  capabilities: descriptor.capabilities,
  open: descriptor.open,
  fileCount: descriptor.files.length,
  artifacts: descriptor.artifacts,
});

/** Whether a finished run failed. */
export const runFailed = (run: MosaicBuildRun) => run.timedOut || run.exitCode !== 0;

/** Reads the client title from `defineApp({manifest: {title: '...'}})` without running it. */
export function extractClientTitle(appSource: string): string | null {
  // Representations declared above the manifest carry titles of their own.
  const manifestAt = appSource.search(/\bmanifest\s*:/);
  const match = /\btitle\s*:\s*(['"`])((?:(?!\1).){1,120})\1/.exec(
    manifestAt === -1 ? appSource : appSource.slice(manifestAt),
  );
  return match?.[2] ?? null;
}

/** Parses `git worktree list --porcelain`; `currentPath` marks the variant being viewed. */
export function parseWorktreeList(
  porcelain: string,
  isCurrent: (path: string) => boolean,
): MosaicVariant[] {
  const variants: MosaicVariant[] = [];
  for (const block of porcelain.split(/\r?\n\r?\n/)) {
    let path: string | null = null;
    let head: string | null = null;
    let branch: string | null = null;
    let bare = false;
    for (const line of block.split(/\r?\n/)) {
      if (line.startsWith("worktree ")) path = line.slice("worktree ".length).trim();
      else if (line.startsWith("HEAD ")) head = line.slice("HEAD ".length).trim();
      else if (line.startsWith("branch ")) {
        branch = line
          .slice("branch ".length)
          .trim()
          .replace(/^refs\/heads\//, "");
      } else if (line === "bare") bare = true;
    }
    if (path === null || path === "" || bare) continue;
    variants.push({ path, head, branch, current: isCurrent(path) });
  }
  return variants;
}

/**
 * The Content-Security-Policy a Mosaic client build declares for `/*` in its
 * Netlify-style `_headers` file, which `vite preview` also applies.
 */
export function contentSecurityPolicyFromHeaders(headersFile: string): string | null {
  let inRootBlock = false;
  for (const rawLine of headersFile.split(/\r?\n/)) {
    if (rawLine.trim() === "" || rawLine.trimStart().startsWith("#")) continue;
    if (!/^\s/.test(rawLine)) {
      inRootBlock = rawLine.trim() === "/*";
      continue;
    }
    if (!inRootBlock) continue;
    const separator = rawLine.indexOf(":");
    if (separator === -1) continue;
    if (rawLine.slice(0, separator).trim().toLowerCase() === "content-security-policy") {
      return rawLine.slice(separator + 1).trim() || null;
    }
  }
  return null;
}

/** Keeps the end of a build log, where the failure usually is. */
export function logTail(text: string, maxChars = 6000): string {
  return text.length <= maxChars ? text : `…${text.slice(text.length - maxChars)}`;
}
