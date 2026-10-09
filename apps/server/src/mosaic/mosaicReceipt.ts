import type {
  MosaicArtifactSummary,
  MosaicBuildRun,
  MosaicBuildStatus,
  MosaicVariant,
} from "@t3tools/contracts";

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
