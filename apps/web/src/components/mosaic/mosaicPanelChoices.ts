/**
 * The client and compare target the user picked in the Mosaic panel, per checkout.
 *
 * Kept in memory for tab switches and reconnects, and written through to browser storage so a
 * full page reload restores the same explicit choice. The panel still checks a restored choice
 * against the checkout (`initialClientId`, `knownVariantPath`), so one that no longer exists is
 * dropped rather than built. Storage that is missing, full or blocked only loses the reload case.
 */

export const MOSAIC_PANEL_CHOICES_STORAGE_KEY = "t3code:mosaic-panel-choices:v1";

/** Checkouts remembered at most; the least recently chosen are forgotten first. */
export const MOSAIC_PANEL_CHOICES_LIMIT = 50;

export interface MosaicPanelChoice {
  readonly clientId?: string;
  readonly variantPath?: string;
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export interface MosaicPanelChoices {
  readonly get: (cwd: string) => MosaicPanelChoice;
  readonly setClient: (cwd: string, clientId: string | null) => void;
  readonly setVariant: (cwd: string, variantPath: string | null) => void;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

/** Reads the stored choices, ignoring anything malformed instead of failing the panel. */
export function parseMosaicPanelChoices(raw: string | null): Map<string, MosaicPanelChoice> {
  const choices = new Map<string, MosaicPanelChoice>();
  if (raw === null) return choices;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return choices;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return choices;
  for (const [cwd, value] of Object.entries(parsed)) {
    if (cwd.length === 0 || typeof value !== "object" || value === null) continue;
    const { clientId, variantPath } = value as Record<string, unknown>;
    const choice: { clientId?: string; variantPath?: string } = {};
    if (isNonEmptyString(clientId)) choice.clientId = clientId;
    if (isNonEmptyString(variantPath)) choice.variantPath = variantPath;
    if (choice.clientId !== undefined || choice.variantPath !== undefined) choices.set(cwd, choice);
  }
  return choices;
}

function browserStorage(): StorageLike | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function createMosaicPanelChoices(
  storage: StorageLike | null = browserStorage(),
  limit = MOSAIC_PANEL_CHOICES_LIMIT,
): MosaicPanelChoices {
  let loaded: Map<string, MosaicPanelChoice> | null = null;

  const load = (): Map<string, MosaicPanelChoice> => {
    if (loaded !== null) return loaded;
    let raw: string | null = null;
    try {
      raw = storage?.getItem(MOSAIC_PANEL_CHOICES_STORAGE_KEY) ?? null;
    } catch {
      raw = null;
    }
    loaded = parseMosaicPanelChoices(raw);
    return loaded;
  };

  const persist = (choices: Map<string, MosaicPanelChoice>) => {
    if (storage === null) return;
    try {
      storage.setItem(
        MOSAIC_PANEL_CHOICES_STORAGE_KEY,
        JSON.stringify(Object.fromEntries(choices)),
      );
    } catch {
      // Storage full or blocked: the choice still holds until the page reloads.
    }
  };

  const update = (cwd: string, patch: MosaicPanelChoice, clear: keyof MosaicPanelChoice | null) => {
    const choices = load();
    const next: { clientId?: string; variantPath?: string } = { ...choices.get(cwd), ...patch };
    if (clear !== null) delete next[clear];
    // Re-inserting moves the checkout to the end, so the oldest choices are trimmed first.
    choices.delete(cwd);
    if (next.clientId !== undefined || next.variantPath !== undefined) choices.set(cwd, next);
    while (choices.size > limit) {
      const oldest = choices.keys().next().value;
      if (oldest === undefined) break;
      choices.delete(oldest);
    }
    persist(choices);
  };

  return {
    get: (cwd) => load().get(cwd) ?? {},
    setClient: (cwd, clientId) =>
      clientId === null ? update(cwd, {}, "clientId") : update(cwd, { clientId }, null),
    setVariant: (cwd, variantPath) =>
      variantPath === null ? update(cwd, {}, "variantPath") : update(cwd, { variantPath }, null),
  };
}
