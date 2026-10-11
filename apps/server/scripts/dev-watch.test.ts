import { describe, expect, it } from "vite-plus/test";

import { isContentChange, isWatchedPath } from "./dev-watch.ts";

const started = 1_000;

describe("isContentChange", () => {
  it("ignores events that leave mtime and size untouched, like last-access updates", () => {
    expect(isContentChange({ mtimeMs: 500, size: 10 }, { mtimeMs: 500, size: 10 }, started)).toBe(
      false,
    );
  });

  it("reports edits, new files and deletions", () => {
    expect(isContentChange({ mtimeMs: 500, size: 10 }, { mtimeMs: 1_200, size: 10 }, started)).toBe(
      true,
    );
    expect(isContentChange({ mtimeMs: 500, size: 10 }, { mtimeMs: 500, size: 11 }, started)).toBe(
      true,
    );
    expect(isContentChange(undefined, { mtimeMs: 1_200, size: 1 }, started)).toBe(true);
    expect(isContentChange({ mtimeMs: 500, size: 10 }, undefined, started)).toBe(true);
  });

  it("ignores unseen files last written before the watcher started", () => {
    expect(isContentChange(undefined, { mtimeMs: 500, size: 1 }, started)).toBe(false);
    expect(isContentChange(undefined, undefined, started)).toBe(false);
  });
});

describe("isWatchedPath", () => {
  it("skips dependency and build output folders", () => {
    expect(isWatchedPath(String.raw`contracts\src\index.ts`)).toBe(true);
    expect(isWatchedPath(String.raw`contracts\node_modules\effect\index.js`)).toBe(false);
    expect(isWatchedPath("shared/dist/index.mjs")).toBe(false);
  });
});
