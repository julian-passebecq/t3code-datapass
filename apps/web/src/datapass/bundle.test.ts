import { describe, expect, it } from "vite-plus/test";
import {
  buildReviewPack,
  mergeKnowledgeBundles,
  parseKnowledgeBundle,
  searchKnowledge,
} from "./bundle";
const fixture = (text = "Implement export", date = "2026-01-01T00:00:00Z") => ({
  schema: "datapass.cockpit/1",
  exportedAt: date,
  policy: { authority: "historical-observations", redacted: true, autoPublish: false },
  warnings: [],
  sessions: [
    {
      provider: "codex",
      id: "test",
      title: "test",
      project: "demo",
      file: "codex-01234567890123456789.jsonl",
      sourceModifiedAt: date,
      records: 20,
      malformed: 0,
      omitted: 8,
      changedDuringExport: false,
      contentHash: "a".repeat(64),
      excerpts: [{ id: "record:1", role: "user", text }],
    },
  ],
});
describe("DataPass knowledge import and review", () => {
  it("rejects wrong schema, unsafe paths, malformed counts and unbounded snippets", () => {
    expect(() => parseKnowledgeBundle({ ...fixture(), schema: "other" })).toThrow();
    const unsafe = fixture();
    unsafe.sessions[0]!.file = "../auth.json";
    expect(() => parseKnowledgeBundle(unsafe)).toThrow();
    const invalid = fixture();
    invalid.sessions[0]!.records = -1;
    expect(() => parseKnowledgeBundle(invalid)).toThrow();
    expect(() => parseKnowledgeBundle(fixture("x".repeat(1601)))).toThrow();
  });
  it("redacts imported Mongo credentials and searches only the bounded imported excerpts", () => {
    const bundle = parseKnowledgeBundle(
      fixture("Export mongodb+srv://reader:dummy@db.invalid/test"),
    );
    expect(JSON.stringify(bundle)).not.toContain("dummy");
    expect(searchKnowledge(bundle.sessions, "export codex")).toHaveLength(1);
    expect(searchKnowledge(bundle.sessions, "not-recorded")).toHaveLength(0);
  });
  it("deduplicates repeated exports and uses newest snapshot irrespective of import order", () => {
    const old = parseKnowledgeBundle(fixture("old")),
      recent = parseKnowledgeBundle(fixture("new", "2026-02-01T00:00:00Z"));
    expect(mergeKnowledgeBundles([recent, old])[0]!.excerpts[0]!.text).toBe("new");
  });
  it("produces deterministic bounded valid JSON with source citations and explicit omitted counts", () => {
    const sessions = parseKnowledgeBundle(fixture("x".repeat(1500))).sessions;
    const pack = buildReviewPack(
      Array.from({ length: 30 }, () => sessions[0]!),
      4000,
    );
    expect(pack.length).toBeLessThanOrEqual(4000);
    expect(JSON.parse(pack).omittedSources).toBeGreaterThan(0);
    expect(pack).toContain("contentHash");
    expect(pack).toBe(
      buildReviewPack(
        Array.from({ length: 30 }, () => sessions[0]!),
        4000,
      ),
    );
    expect(() => buildReviewPack(sessions, 1)).toThrow();
  });
  it("retains multiple providers when each conversation has more text than the total pack budget", () => {
    const first = parseKnowledgeBundle(fixture("x".repeat(1600))).sessions[0]!;
    first.excerpts = Array.from({ length: 12 }, (_, i) => ({
      id: `row:${i}`,
      role: "assistant",
      text: "x".repeat(1600),
    }));
    const second = {
      ...first,
      id: "claude-test",
      provider: "claude" as const,
      file: "claude-01234567890123456789.jsonl",
    };
    const pack = buildReviewPack([first, second], 4000);
    expect(pack.length).toBeLessThanOrEqual(4000);
    expect(JSON.parse(pack).sources).toHaveLength(2);
    expect(JSON.parse(pack).sources[0].excerpts.length).toBeGreaterThan(0);
  });
});
