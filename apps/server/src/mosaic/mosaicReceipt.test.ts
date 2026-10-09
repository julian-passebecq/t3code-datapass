import { describe, expect, it } from "vite-plus/test";

import {
  contentSecurityPolicyFromHeaders,
  deriveBuildStatus,
  extractClientTitle,
  parseWorktreeList,
  summarizeContractDocument,
} from "./mosaicReceipt.ts";

describe("deriveBuildStatus", () => {
  const built = Date.parse("2026-10-09T10:00:00.000Z");

  it("never reports a failed build as ready while its old output is still on disk", () => {
    expect(
      deriveBuildStatus({
        building: false,
        outputBuiltAtMs: built,
        newestSourceAtMs: built - 1000,
        lastFailure: { outputBuiltAtMs: built },
      }),
    ).toBe("failed");
  });

  it("lets a later build outside T3 replace an earlier failure", () => {
    expect(
      deriveBuildStatus({
        building: false,
        outputBuiltAtMs: built + 1,
        newestSourceAtMs: built - 1000,
        lastFailure: { outputBuiltAtMs: built },
      }),
    ).toBe("ready");
    expect(
      deriveBuildStatus({
        building: false,
        outputBuiltAtMs: built,
        newestSourceAtMs: null,
        lastFailure: { outputBuiltAtMs: null },
      }),
    ).toBe("ready");
  });

  it("labels output older than its sources as stale", () => {
    expect(
      deriveBuildStatus({
        building: false,
        outputBuiltAtMs: built,
        newestSourceAtMs: built + 1,
        lastFailure: null,
      }),
    ).toBe("stale");
  });

  it("reports missing output and running builds", () => {
    const base = { outputBuiltAtMs: null, newestSourceAtMs: built, lastFailure: null };
    expect(deriveBuildStatus({ ...base, building: false })).toBe("not-built");
    expect(deriveBuildStatus({ ...base, building: true })).toBe("building");
    expect(
      deriveBuildStatus({ ...base, building: false, lastFailure: { outputBuiltAtMs: null } }),
    ).toBe("failed");
  });
});

describe("summarizeContractDocument", () => {
  it("reads id, title and provenance of a valid artifact", () => {
    expect(
      summarizeContractDocument("public/artifacts/aep.json", {
        format: "datapass.artifact",
        version: 1,
        id: "aep",
        title: "Annual energy",
        provenance: { kind: "computed", source: "py/aep.py" },
        payload: { kind: "table" },
        representations: [],
      }),
    ).toEqual({
      path: "public/artifacts/aep.json",
      format: "datapass.artifact",
      id: "aep",
      title: "Annual energy",
      provenanceKind: "computed",
      provenanceSource: "py/aep.py",
      problems: [],
    });
  });

  it("lists every missing required field of a malformed document", () => {
    const summary = summarizeContractDocument("specs/x.concept.json", {
      format: "datapass.concept-spec",
      version: 2,
      id: "x",
    });
    expect(summary?.problems).toEqual([
      "version is not 1",
      "missing title",
      "missing provenance",
      "missing layers",
      "missing domains",
      "missing nodes",
      "missing flows",
    ]);
  });

  it("ignores JSON that claims no Mosaic contract", () => {
    expect(summarizeContractDocument("tsconfig.json", { compilerOptions: {} })).toBeUndefined();
    expect(summarizeContractDocument("list.json", [1, 2])).toBeUndefined();
  });
});

describe("contentSecurityPolicyFromHeaders", () => {
  it("returns the policy declared for every path", () => {
    expect(
      contentSecurityPolicyFromHeaders(
        "/assets/*\n  Cache-Control: max-age=31536000\n/*\n  X-Frame-Options: DENY\n  Content-Security-Policy: default-src 'self'\n",
      ),
    ).toBe("default-src 'self'");
  });

  it("returns null when the file declares none", () => {
    expect(contentSecurityPolicyFromHeaders("/*\n  X-Frame-Options: DENY\n")).toBeNull();
  });
});

describe("parseWorktreeList", () => {
  it("lists non-bare worktrees with branch and head", () => {
    const porcelain = [
      "worktree /repo",
      "HEAD aaa",
      "branch refs/heads/main",
      "",
      "worktree /repo/.wt/variant",
      "HEAD bbb",
      "detached",
      "",
      "worktree /bare",
      "bare",
      "",
    ].join("\n");
    expect(parseWorktreeList(porcelain, (path) => path === "/repo/.wt/variant")).toEqual([
      { path: "/repo", head: "aaa", branch: "main", current: false },
      { path: "/repo/.wt/variant", head: "bbb", branch: null, current: true },
    ]);
  });
});

describe("extractClientTitle", () => {
  it("reads the manifest title without running the module", () => {
    expect(
      extractClientTitle("export default defineApp({manifest:{id:'demo', title: 'Demo lab'}})"),
    ).toBe("Demo lab");
    expect(extractClientTitle("export default defineApp({})")).toBeNull();
  });
});
