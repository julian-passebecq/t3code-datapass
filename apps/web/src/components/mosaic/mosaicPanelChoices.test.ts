import { describe, expect, it } from "vite-plus/test";

import {
  MOSAIC_PANEL_CHOICES_STORAGE_KEY,
  createMosaicPanelChoices,
  parseMosaicPanelChoices,
} from "./mosaicPanelChoices";
import { initialClientId } from "./mosaicPanelLogic";

const memoryStorage = (initial: Record<string, string> = {}) => {
  const items = new Map(Object.entries(initial));
  return {
    items,
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => {
      items.set(key, value);
    },
  };
};

describe("Mosaic panel choices", () => {
  it("restores the client and compare target after a page reload", () => {
    const storage = memoryStorage();
    const before = createMosaicPanelChoices(storage);
    before.setClient("/repo/a", "foundation-reference");
    before.setVariant("/repo/a", "/repo/b");

    // A reload builds a fresh store over the same browser storage.
    const after = createMosaicPanelChoices(storage);
    expect(after.get("/repo/a")).toEqual({
      clientId: "foundation-reference",
      variantPath: "/repo/b",
    });
    expect(after.get("/repo/other")).toEqual({});
  });

  it("keeps choices per checkout and forgets a cleared client", () => {
    const storage = memoryStorage();
    const store = createMosaicPanelChoices(storage);
    store.setClient("/repo/a", "one");
    store.setClient("/repo/b", "two");
    store.setVariant("/repo/a", "/repo/b");
    store.setClient("/repo/a", null);

    const after = createMosaicPanelChoices(storage);
    expect(after.get("/repo/a")).toEqual({ variantPath: "/repo/b" });
    expect(after.get("/repo/b")).toEqual({ clientId: "two" });
    store.setVariant("/repo/a", null);
    expect(JSON.parse(storage.items.get(MOSAIC_PANEL_CHOICES_STORAGE_KEY)!)).toEqual({
      "/repo/b": { clientId: "two" },
    });
  });

  it("a restored client that left the checkout is not selected", () => {
    const storage = memoryStorage();
    createMosaicPanelChoices(storage).setClient("/repo/a", "removed");
    const remembered = createMosaicPanelChoices(storage).get("/repo/a").clientId;
    expect(initialClientId([{ id: "one" }, { id: "two" }], remembered)).toBeNull();
    expect(initialClientId([{ id: "one" }, { id: "removed" }], remembered)).toBe("removed");
  });

  it("trims the least recently chosen checkouts", () => {
    const storage = memoryStorage();
    const store = createMosaicPanelChoices(storage, 2);
    store.setClient("/repo/a", "a");
    store.setClient("/repo/b", "b");
    store.setClient("/repo/a", "a2");
    store.setClient("/repo/c", "c");

    const after = createMosaicPanelChoices(storage, 2);
    expect(after.get("/repo/b")).toEqual({});
    expect(after.get("/repo/a")).toEqual({ clientId: "a2" });
    expect(after.get("/repo/c")).toEqual({ clientId: "c" });
  });

  it("works in memory when storage is missing or throws", () => {
    const none = createMosaicPanelChoices(null);
    none.setClient("/repo/a", "one");
    expect(none.get("/repo/a")).toEqual({ clientId: "one" });

    const broken = createMosaicPanelChoices({
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("quota");
      },
    });
    broken.setClient("/repo/a", "one");
    expect(broken.get("/repo/a")).toEqual({ clientId: "one" });
  });

  it("ignores malformed stored values", () => {
    expect(parseMosaicPanelChoices(null).size).toBe(0);
    expect(parseMosaicPanelChoices("{not json").size).toBe(0);
    expect(parseMosaicPanelChoices("[1,2]").size).toBe(0);
    const parsed = parseMosaicPanelChoices(
      JSON.stringify({
        "/ok": { clientId: "one", variantPath: 3 },
        "/empty": { clientId: "" },
        "/null": null,
        "": { clientId: "x" },
      }),
    );
    expect([...parsed]).toEqual([["/ok", { clientId: "one" }]]);

    const storage = memoryStorage({ [MOSAIC_PANEL_CHOICES_STORAGE_KEY]: "garbage" });
    expect(createMosaicPanelChoices(storage).get("/ok")).toEqual({});
  });
});
