import type {
  MosaicBuildReceipt,
  MosaicBuildStatus,
  MosaicContractState,
} from "@t3tools/contracts";

export const MOSAIC_STATUS_PRESENTATION: Record<
  MosaicBuildStatus,
  { readonly label: string; readonly tone: "success" | "warning" | "error" | "info" | "outline" }
> = {
  ready: { label: "Ready", tone: "success" },
  stale: { label: "Stale: sources changed since this build", tone: "warning" },
  failed: { label: "Build failed", tone: "error" },
  building: { label: "Building…", tone: "info" },
  "not-built": { label: "Not built", tone: "outline" },
};

/** How far the output matches its `datapass.preview/1` descriptor. */
export const MOSAIC_CONTRACT_PRESENTATION: Record<
  MosaicContractState,
  {
    readonly label: string;
    readonly description: string;
    readonly tone: "success" | "warning" | "error" | "info" | "outline";
  }
> = {
  verified: {
    label: "Verified",
    description: "Every output file matches preview.json",
    tone: "success",
  },
  legacy: {
    label: "Legacy adapter",
    description: "No preview.json: an older client, shown unverified",
    tone: "outline",
  },
  stale: {
    label: "Stale",
    description: "Sources or output changed after the build",
    tone: "warning",
  },
  invalid: {
    label: "Invalid",
    description: "preview.json is malformed or does not describe this client",
    tone: "error",
  },
  failed: { label: "Failed", description: "The last build failed", tone: "error" },
};

/** Whether the preview button opens anything, and what it says when it does. */
export function previewAction(receipt: MosaicBuildReceipt): {
  readonly enabled: boolean;
  readonly label: string;
} {
  const contract = receipt.contract?.state;
  if (contract === "invalid" || contract === "failed") {
    return { enabled: false, label: "Open preview" };
  }
  switch (receipt.status) {
    case "ready":
      if (contract === "stale") return { enabled: true, label: "Open stale preview" };
      if (contract === "legacy") return { enabled: true, label: "Open unverified preview" };
      return { enabled: true, label: "Open preview" };
    case "stale":
      return { enabled: receipt.output !== null, label: "Open stale preview" };
    case "building":
      return { enabled: false, label: "Open preview" };
    case "failed":
    case "not-built":
      return { enabled: false, label: "Open preview" };
  }
}

export const shortSha = (sha: string | null) => (sha === null ? "no commit" : sha.slice(0, 10));

/** A content hash shortened for display; the full value goes in a title. */
export const shortHash = (sha256: string) => sha256.slice(0, 12);

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** The last path segment of a worktree, which is how users tell variants apart. */
export function variantLabel(variant: { readonly path: string; readonly branch: string | null }) {
  const name =
    variant.path
      .replace(/[\\/]+$/, "")
      .split(/[\\/]/)
      .pop() ?? variant.path;
  return variant.branch === null ? `${name} (detached)` : `${name} · ${variant.branch}`;
}
