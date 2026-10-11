import type { MosaicBuildReceipt, MosaicContractState } from "@t3tools/contracts";
import { describe, expect, it } from "vite-plus/test";

import { initialClientId, knownVariantPath, previewAction, variantLabel } from "./mosaicPanelLogic";

const receipt = (
  status: MosaicBuildReceipt["status"],
  hasOutput: boolean,
  contract: MosaicContractState | null = null,
): MosaicBuildReceipt => ({
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
  contract: contract === null ? null : { state: contract, problems: [], descriptor: null },
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

  it("follows the preview.json check: refuses invalid, labels stale and legacy output", () => {
    expect(previewAction(receipt("ready", true, "verified"))).toEqual({
      enabled: true,
      label: "Open preview",
    });
    expect(previewAction(receipt("ready", true, "invalid")).enabled).toBe(false);
    expect(previewAction(receipt("ready", true, "stale")).label).toBe("Open stale preview");
    expect(previewAction(receipt("ready", true, "legacy")).label).toBe("Open unverified preview");
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

describe("initialClientId", () => {
  const clients = [{ id: "animated-coding-lab" }, { id: "foundation-reference" }];

  it("never picks one of several clients on its own", () => {
    expect(initialClientId(clients, null)).toBeNull();
    expect(initialClientId(clients, undefined)).toBeNull();
  });

  it("keeps a remembered choice across reloads and drops one that disappeared", () => {
    expect(initialClientId(clients, "foundation-reference")).toBe("foundation-reference");
    expect(initialClientId(clients, "../outside")).toBeNull();
    expect(initialClientId([{ id: "only" }], "gone")).toBe("only");
  });

  it("selects the only client and nothing when there is none", () => {
    expect(initialClientId([{ id: "only" }], null)).toBe("only");
    expect(initialClientId([], "foundation-reference")).toBeNull();
  });
});

describe("knownVariantPath", () => {
  const variants = [
    { path: "/repo", current: true },
    { path: "/repo-b", current: false },
  ];

  it("keeps a remembered compare target only while it is another variant", () => {
    expect(knownVariantPath(variants, "/repo-b")).toBe("/repo-b");
    expect(knownVariantPath(variants, "/repo")).toBeNull();
    expect(knownVariantPath(variants, "/elsewhere")).toBeNull();
    expect(knownVariantPath(variants, null)).toBeNull();
  });
});
