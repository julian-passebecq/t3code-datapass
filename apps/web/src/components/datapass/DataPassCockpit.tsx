import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { useProjects, useThreadShells } from "../../state/entities";
import { useEnvironments } from "../../state/environments";
import { buildThreadRouteParams } from "../../threadRoutes";
import { readPullRequestListPreferences } from "../pullRequest/pullRequestListPreferences";
import {
  buildReviewPack,
  mergeKnowledgeBundles,
  parseKnowledgeBundle,
  searchKnowledge,
} from "../../datapass/bundle";
import { useKnowledgeStore } from "../../datapass/store";
import {useNewThreadHandler} from '../../hooks/useHandleNewThread';
import {scopeProjectRef} from '@t3tools/client-runtime/environment';
import {incomingEditorContext,contextEditorLink,sameCheckout} from '../../datapass/editorContext';

function savePack(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "datapass-review-pack.json";
  anchor.click();
  // The browser may consume the URL after the click returns.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DataPassCockpit() {
  const editorContext=new URLSearchParams(window.location.search);
  const incoming=incomingEditorContext(window.location.search),pointer=incoming.pointer;
  const selectedPath=pointer?.worktreePath??pointer?.repository?.path;
  const editorProject=editorContext.get('editorProject'),editorEnvironment=editorContext.get('editorEnvironment');
  const createThread=useNewThreadHandler();
  const allProjects = useProjects(),
    allThreads = useThreadShells();
  const { environments, isReady } = useEnvironments();
  const connected = new Set(
    environments
      .filter((environment) => environment.connection.phase === "connected")
      .map((environment) => environment.environmentId),
  );
  const projects = allProjects.filter((project) => connected.has(project.environmentId)&&(!editorProject||project.id===editorProject)&&(!editorEnvironment||project.environmentId===editorEnvironment)&&(!selectedPath||sameCheckout(project.workspaceRoot,selectedPath)||allThreads.some(t=>t.projectId===project.id&&t.environmentId===project.environmentId&&sameCheckout(t.worktreePath,selectedPath))));
  const threads = allThreads.filter((thread) => connected.has(thread.environmentId)&&(!editorProject||thread.projectId===editorProject)&&(!editorEnvironment||thread.environmentId===editorEnvironment)&&(!selectedPath||sameCheckout(thread.worktreePath??allProjects.find(p=>p.id===thread.projectId&&p.environmentId===thread.environmentId)?.workspaceRoot,selectedPath)));
  const bundles = useKnowledgeStore((state) => state.bundles);
  const add = useKnowledgeStore((state) => state.add),
    clear = useKnowledgeStore((state) => state.clear);
  const [query, setQuery] = useState(""),
    [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false),
    [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const sessions = useMemo(() => mergeKnowledgeBundles(bundles), [bundles]);
  const matching = useMemo(() => searchKnowledge(sessions, query), [sessions, query]);
  const attention = threads.filter(
    (thread) =>
      !thread.archivedAt &&
      !thread.deletedAt &&
      (thread.hasPendingApprovals ||
        thread.hasPendingUserInput ||
        thread.hasActionableProposedPlan),
  );
  const active = threads.filter(
    (thread) =>
      !thread.archivedAt &&
      !thread.deletedAt &&
      thread.runtime &&
      ["preparing", "starting", "running", "waiting", "queued"].includes(thread.runtime.status),
  );
  const pageCount = Math.max(1, Math.ceil(matching.length / 24));
  const visible = matching.slice(
    Math.min(page, pageCount - 1) * 24,
    (Math.min(page, pageCount - 1) + 1) * 24,
  );
  const packSources = selected.size
    ? sessions.filter((session) => selected.has(session.file))
    : matching.slice(0, 20);

  async function importFiles(files: FileList | null) {
    if (!files?.length) return;
    setImporting(true);
    setError(null);
    try {
      if (
        files.length > 16 ||
        Array.from(files).reduce((sum, file) => sum + file.size, 0) > 32 * 1024 * 1024
      )
        throw new Error("Choose at most 16 cockpit.json files, totaling at most 32 MiB.");
      const incoming = await Promise.all(
        Array.from(files).map(async (file) => parseKnowledgeBundle(JSON.parse(await file.text()))),
      );
      add(incoming);
      setPage(0);
    } catch (cause) {
      setError(
        cause instanceof Error && !cause.message.includes("JSON")
          ? cause.message
          : "Import failed. Choose cockpit.json files produced by the DataPass exporter.",
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-auto">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <SidebarTrigger />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold">DataPass cockpit</h1>
          <p className="text-sm text-muted-foreground">
            Live work and cited knowledge, in one place.
          </p>
        </div>
        <Button
          variant="outline"
          render={<Link to="/pull-requests" search={readPullRequestListPreferences()} />}
        >
          PRs / MRs
        </Button>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
        <section aria-label="Connected work" className="grid gap-3 sm:grid-cols-3">
          {[
            ["Connected projects", projects.length],
            ["Active T3 threads", active.length],
            ["Need your review", attention.length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">{label}</div>
              <div className="text-2xl font-semibold">{isReady ? value : "Loading…"}</div>
            </div>
          ))}
        </section>
        {allProjects.length > projects.length ? (
          <p className="text-xs text-muted-foreground">
            Projects from disconnected environments are excluded from live counts. Reconnect them in
            Settings → Connections.
          </p>
        ) : null}
        <section className="rounded-lg border p-4">
          <h2 className="font-semibold">What to review next</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Recorded T3 requests for your input come first. Imported conversations need
            reconciliation before their suggestions become a plan.
          </p>
          {attention.length ? (
            <ul className="space-y-2">
              {attention.slice(0, 12).map((thread) => (
                <li key={`${thread.environmentId}:${thread.id}`}>
                  <Link
                    className="underline"
                    to="/$environmentId/$threadId"
                    params={buildThreadRouteParams({
                      environmentId: thread.environmentId,
                      threadId: thread.id,
                    })}
                  >
                    {thread.title}
                  </Link>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {thread.hasPendingApprovals
                      ? "Approval requested"
                      : thread.hasPendingUserInput
                        ? "Input requested"
                        : "Proposed plan"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">
              No pending input in the connected T3 thread state. This does not cover external Claude
              or Codex sessions.
            </p>
          )}
          {sessions.some((session) => session.malformed || session.changedDuringExport) ? (
            <p className="mt-3 text-sm">
              Some exports are incomplete or changed while being read. Re-export them after the
              sessions settle.
            </p>
          ) : null}
        </section>
        <section className="rounded-lg border p-4">
          <h2 className="font-semibold">Project map</h2>
          {incoming.error?<p role="alert">{incoming.error}</p>:null}
          {pointer?<div className="mb-3 min-w-0 rounded border p-3"><strong>Editor change context</strong><p className="break-all text-sm">{selectedPath??pointer.repository?.remote} · {pointer.branch??'Branch unknown'} · {pointer.revision??'Revision unknown'}</p><p className="text-xs text-muted-foreground">Navigation pointer only. Resolve current Git facts in Lens. Paste copied context into a T3 thread for explicit submission.</p><Button variant="outline" onClick={()=>void navigator.clipboard.writeText(JSON.stringify(pointer,null,2))}>Copy change context</Button>{incoming.editorScheme?<Button variant="outline" onClick={()=>{window.location.href=contextEditorLink(pointer,incoming.editorScheme!);}}>Open in Lens</Button>:<p className="text-xs">Open in your editor using Lens: Open Development Context.</p>}{selectedPath&&!projects.length?<p>No connected T3 project matches this checkout.</p>:null}</div>:null}
          <p className="mb-3 text-sm text-muted-foreground">
            These projects come from connected T3 environments. Existing source-control screens
            manage their repositories and remote reviews.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {projects.slice(0, 40).map((project) => (
              <div
                key={`${project.environmentId}:${project.id}`}
                className="min-w-0 rounded border p-3"
              >
                <strong>{project.title}</strong>
                <p className="break-all text-xs text-muted-foreground">{project.workspaceRoot}</p>
                {editorContext.get('editorAction')==='new-thread' ? <Button variant="outline" onClick={()=>void createThread(scopeProjectRef(project.environmentId,project.id),{worktreePath:editorContext.get('editorWorktree')||null,branch:editorContext.get('editorBranch')||null})}>Create new thread in this checkout</Button> : null}
                <p className="text-sm">
                  {
                    threads.filter(
                      (thread) =>
                        thread.environmentId === project.environmentId &&
                        thread.projectId === project.id &&
                        !thread.deletedAt &&
                        !thread.archivedAt,
                    ).length
                  }{" "}
                  open threads
                </p>
              </div>
            ))}
          </div>
          {!projects.length ? (
            <p className="text-sm">
              Connect a T3 environment or add a project to see current work here.
            </p>
          ) : null}
        </section>
        <section className="flex flex-col gap-3 rounded-lg border p-4">
          <h2 className="font-semibold">Shared knowledge</h2>
          <p className="text-sm text-muted-foreground">
            Import cockpit.json from selected Codex / Claude conversations, ChatGPT exports, feature
            CSVs or Mongo JSON snapshots. Files stay in this browser tab's memory until reload. They
            are not uploaded.
          </p>
          <label className="text-sm">
            Import knowledge bundles
            <Input
              nativeInput
              type="file"
              accept=".json,application/json"
              multiple
              disabled={importing}
              onChange={(event) => {
                void importFiles(event.currentTarget.files);
                event.currentTarget.value = "";
              }}
            />
          </label>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {["codex", "claude", "chatgpt", "csv", "mongo"].map((provider) => (
              <span key={provider} className="rounded border px-2 py-1 text-xs">
                {provider}:{" "}
                {sessions.filter((session) => session.provider === provider).length
                  ? "imported snapshot"
                  : "not imported"}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Mongo imports are durable snapshots. Conversation history is recorded discussion. Git /
            files / CI remain the authority for current implementation. This prototype has no live
            Mongo connection or automatic next-task agent.
          </p>
          <label className="text-sm">
            Search project, provider or exported excerpts
            <Input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                setPage(0);
              }}
              placeholder="Galaxy architecture, export, provider…"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              disabled={!packSources.length}
              onClick={() => savePack(buildReviewPack(packSources))}
            >
              Download review pack
            </Button>
            <Button
              variant="outline"
              disabled={!sessions.length}
              onClick={() => {
                clear();
                setSelected(new Set());
                setPage(0);
              }}
            >
              Clear imports
            </Button>
            <span className="text-xs text-muted-foreground">
              {selected.size
                ? `${selected.size} selected, including hidden search results`
                : "First 20 matches"}{" "}
              · pack ≤ 16,000 characters · {matching.length} matches
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Search covers bounded excerpts, not all events. Use leviathan.jsonl for full-event
            lexical search. Review a pack before sharing it with ChatGPT or an agent.
          </p>
          {visible.map((session) => (
            <article key={session.file} className="rounded border p-3">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(session.file)}
                  onChange={(event) => {
                    const next = new Set(selected);
                    if (event.currentTarget.checked) next.add(session.file);
                    else next.delete(session.file);
                    setSelected(next);
                  }}
                />
                <strong className="min-w-0 break-words text-sm">{session.title}</strong>
              </label>
              <p className="mt-1 break-all text-xs text-muted-foreground">
                {session.provider} · {session.project ?? "Imported knowledge input"} · source
                modified {new Date(session.sourceModifiedAt).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.records} recorded events · {session.malformed} malformed ·{" "}
                {session.excerpts.length} excerpts ·{" "}
                {session.changedDuringExport ? "Changed during export" : "Stable while exported"}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Read cited excerpts</summary>
                {session.excerpts.map((item) => (
                  <div key={item.id} className="mt-3">
                    <p className="text-xs text-muted-foreground">
                      {item.role} · {item.id}
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm">{item.text}</p>
                  </div>
                ))}
                <p className="mt-2 break-all text-xs text-muted-foreground">
                  Full source: {session.file} · SHA256 {session.contentHash}
                </p>
              </details>
            </article>
          ))}
          {matching.length > 24 ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm">
                Page {Math.min(page, pageCount - 1) + 1} / {pageCount}
              </span>
              <Button
                variant="outline"
                disabled={page >= pageCount - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
          <details>
            <summary className="cursor-pointer text-sm">
              Export commands and source limitations
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-muted p-3 text-xs">
              {
                "node scripts/datapass-export.mjs --list\nnode scripts/datapass-export.mjs --project D:\\PROJ\\your-project --out .datapass/exports\nnode scripts/datapass-export.mjs --input chatgpt=conversations.json --input csv=features.csv --input mongo=records.json --out .datapass/exports"
              }
            </pre>
            <p className="mt-2 text-xs text-muted-foreground">
              Run these on the machine holding the native logs. The wrapper uses the sibling
              DataPass Agent build, or --exporter to specify its bundled CLI. ChatGPT / Mongo inputs
              are explicit local files. No automatic account-history download, canonical writes or
              GitHub publishing.
            </p>
            {[...new Set(bundles.flatMap((bundle) => bundle.warnings))]
              .slice(0, 12)
              .map((warning) => (
                <p key={warning} className="mt-2 text-xs text-muted-foreground">
                  {warning}
                </p>
              ))}
          </details>
        </section>
      </main>
    </SidebarInset>
  );
}
