import type { MosaicBuildReceipt } from "@t3tools/contracts";
import { describe, expect, it } from "vite-plus/test";

import { previewAction, variantLabel } from "./mosaicPanelLogic";

const receipt = (status: MosaicBuildReceipt["status"], hasOutput: boolean): MosaicBuildReceipt => ({
  format: "t3.mosaic-build-receipt",
  version: 1,
  cwd: "/repo",
  clientId: "demo",
  status,
  git: { head: null, branch: null, dirtyFiles: [], dirtyCount: 0 },
  output: hasOutput
    ? {
        path: "dist-clients/demo",
        fileCount: 1,
        totalBytes: 1,
        sha256: "x",
        builtAt: "2026-10-09T10:00:00.000Z",
        capabilities: [],
      }
    : null,
  newestSourceAt: null,
  lastRun: null,
  artifacts: [],
  inspectedAt: "2026-10-09T10:00:00.000Z",
});

describe("previewAction", () => {
  it("opens ready output and labels stale output", () => {
    expect(previewAction(receipt("ready", true))).toEqual({ enabled: true, label: "Open preview" });
    expect(previewAction(receipt("stale", true))).toEqual({
      enabled: true,
      label: "Open stale preview",
    });
  });

  it("never opens a failed, running or missing build", () => {
    expect(previewAction(receipt("failed", true)).enabled).toBe(false);
    expect(previewAction(receipt("building", true)).enabled).toBe(false);
    expect(previewAction(receipt("not-built", false)).enabled).toBe(false);
  });
});

describe("variantLabel", () => {
  it("names a worktree by its folder and branch", () => {
    expect(variantLabel({ path: "D:/repo/.wt/blue/", branch: "feat/blue" })).toBe(
      "blue · feat/blue",
    );
    expect(variantLabel({ path: "/repo", branch: null })).toBe("repo (detached)");
  });
});
