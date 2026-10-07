// src/core/context.ts
var DEV_CONTEXT_VERSION = "galaxy.dev-context/1";
function contextForLens(value) {
  const p = parseDevContext(value);
  if (!p.repository && !p.worktreePath) throw Error("No repository selector in development context");
  return {
    format: "datapass.lens.context",
    version: 1,
    repository: p.repository ?? { path: p.worktreePath },
    worktree: p.worktreePath ? { path: p.worktreePath } : void 0,
    branch: p.branch,
    revision: p.revision,
    file: p.file?.path,
    line: p.file?.line,
    request: p.review && /^\d+$/.test(p.review.id) ? { provider: p.review.provider === "azure" ? "azure-devops" : p.review.provider, number: Number(p.review.id) } : void 0
  };
}
function parseDevContext(value) {
  const obj = (v) => {
    if (!v || typeof v !== "object" || Array.isArray(v)) throw Error("Invalid development context object");
    return v;
  };
  const text = (v, max = 2048) => {
    if (v === void 0) return;
    if (typeof v !== "string" || !v || v.length > max || /[\x00-\x1f]/.test(v)) throw Error("Invalid development context text");
    return v;
  };
  const n = obj(value);
  if (n.version !== DEV_CONTEXT_VERSION || JSON.stringify(n).length > 16384) throw Error("Expected galaxy.dev-context/1, at most 16 KiB");
  const out = { version: DEV_CONTEXT_VERSION };
  for (const key of ["project", "worktreePath", "branch", "revision"]) {
    const v = text(n[key]);
    if (v !== void 0) out[key] = v;
  }
  if (n.repository !== void 0) {
    const r = obj(n.repository), p = text(r.path), remote = text(r.remote);
    if (!p && !remote) throw Error("Empty repository selector");
    if (remote && /^https?:\/\//.test(remote)) {
      const url = new URL(remote);
      if (url.username || url.password || url.search || url.hash) throw Error("Repository remote must not contain credentials");
    }
    out.repository = { ...p ? { path: p } : {}, ...remote ? { remote } : {} };
  }
  if (n.file !== void 0) {
    const f = obj(n.file), p = text(f.path);
    if (!p || /^(?:[a-z]:|\/|\\)/i.test(p) || p.replace(/\\/g, "/").split("/").some((x) => !x || x === "..")) throw Error("File must be relative to the selected checkout");
    out.file = { path: p.replace(/\\/g, "/") };
    for (const key of ["line", "column"]) if (f[key] !== void 0) {
      if (!Number.isSafeInteger(f[key]) || Number(f[key]) < 1 || Number(f[key]) > 1e7) throw Error("Invalid file position");
      out.file[key] = Number(f[key]);
    }
  }
  if (n.review !== void 0) {
    const r = obj(n.review), id = text(r.id, 160);
    if (!id || !["github", "gitlab", "azure"].includes(String(r.provider))) throw Error("Invalid review pointer");
    out.review = { provider: r.provider, id };
  }
  if (n.thread !== void 0) {
    const t = obj(n.thread), provider = text(t.provider, 80), id = text(t.id, 160);
    if (!provider || !id) throw Error("Invalid thread pointer");
    out.thread = { provider, id };
  }
  if (Object.keys(out).length === 1) throw Error("Development context has no selector");
  return out;
}
export {
  DEV_CONTEXT_VERSION,
  contextForLens,
  parseDevContext
};
