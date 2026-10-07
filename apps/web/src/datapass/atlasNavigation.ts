import { parseDevContext, type DevContext } from "./generated/dev-context.mjs";
/** Host pointers only. Git facts, joins and impact algorithms remain in Lens Core. */
export function atlasEditorContext(atlas: any, entity: any): DevContext {
  const branchWorktrees =
    entity.kind === "branch"
      ? atlas.worktrees.filter(
          (w: any) =>
            w.data.repositoryId === entity.data.repositoryId && w.data.branch === entity.label,
        )
      : [];
  if (branchWorktrees.length > 1) throw Error("Choose a worktree for this branch first.");
  const worktree =
    entity.kind === "worktree"
      ? entity.data.path
      : (entity.data.worktreePath ?? branchWorktrees[0]?.data.path ?? atlas.scope.worktree);
  if (!worktree) throw Error("This snapshot has no editor checkout.");
  return parseDevContext({
    version: "galaxy.dev-context/1",
    repository: { path: atlas.scope.repo ?? worktree },
    worktreePath: worktree,
    revision: entity.data.sha || atlas.scope.revision,
    branch: entity.kind === "branch" ? entity.label : entity.data.branch,
    file: entity.kind === "file" ? { path: entity.data.path } : undefined,
    thread:
      entity.kind === "agent"
        ? { provider: entity.data.provider, id: entity.data.sessionId }
        : undefined,
  });
}
export function atlasExternalLink(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 2048) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password) return url.href;
  } catch {}
  return;
}
