import type { MosaicBuildReceipt, MosaicBuildStatus } from "@t3tools/contracts";

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

/** Whether the preview button opens anything, and what it says when it does. */
export function previewAction(receipt: MosaicBuildReceipt): {
  readonly enabled: boolean;
  readonly label: string;
} {
  switch (receipt.status) {
    case "ready":
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
