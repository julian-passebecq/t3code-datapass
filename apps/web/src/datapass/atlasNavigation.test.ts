import { describe, it, expect } from "vite-plus/test";
import { atlasEditorContext, atlasExternalLink } from "./atlasNavigation";
describe("Atlas host navigation", () => {
  it("uses the explicitly selected worktree and file", () => {
    const context = atlasEditorContext(
      { scope: { worktree: "D:/one" }, worktrees: [] },
      { kind: "file", data: { worktreePath: "D:/two", path: "src/a.ts" } },
    );
    expect(context.worktreePath).toBe("D:/two");
    expect(context.file?.path).toBe("src/a.ts");
  });
  it("does not guess between duplicate branch checkouts", () => {
    expect(() =>
      atlasEditorContext(
        {
          scope: { worktree: "D:/one" },
          worktrees: [
            { data: { repositoryId: "r", branch: "feat", path: "D:/one" } },
            { data: { repositoryId: "r", branch: "feat", path: "D:/two" } },
          ],
        },
        { kind: "branch", label: "feat", data: { repositoryId: "r" } },
      ),
    ).toThrow("Choose a worktree");
  });
  it("refuses credential and script links", () => {
    expect(atlasExternalLink("https://user:password@example.com/")).toBeUndefined();
    expect(atlasExternalLink("javascript:alert(1)")).toBeUndefined();
    expect(atlasExternalLink("https://example.com/review/1")).toBe("https://example.com/review/1");
  });
});
