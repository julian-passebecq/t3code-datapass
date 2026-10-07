import { create } from "zustand";
import type { KnowledgeBundle } from "./bundle";

// Deliberately memory-only. A cockpit import never uploads transcripts to a T3 server
// or persists them in browser storage; leaving the page preserves them until reload.
export const useKnowledgeStore = create<{
  bundles: KnowledgeBundle[];
  add: (bundles: KnowledgeBundle[]) => void;
  clear: () => void;
}>((set) => ({
  bundles: [],
  add: (incoming) =>
    set((state) => {
      if (state.bundles.length + incoming.length > 16)
        throw new Error("Clear imports before adding more than 16 bundles.");
      if (
        [...state.bundles, ...incoming].reduce((sum, bundle) => sum + bundle.sessions.length, 0) >
        2000
      )
        throw new Error("Clear imports or select smaller exports before exceeding 2,000 sources.");
      return { bundles: [...state.bundles, ...incoming] };
    }),
  clear: () => set({ bundles: [] }),
}));
