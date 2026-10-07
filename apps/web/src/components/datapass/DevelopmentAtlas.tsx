import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { HtmlRenderDocument } from "../files/BrowserDocumentFrame";
import { injectHtmlRenderBootstrap } from "@t3tools/shared/htmlRender";
import { useProjects, useThreadShells } from "../../state/entities";
import { Link } from "@tanstack/react-router";
import { buildThreadRouteParams } from "../../threadRoutes";
import { contextEditorLink, sameCheckout } from "../../datapass/editorContext";
import { atlasEditorContext, atlasExternalLink } from "../../datapass/atlasNavigation";

/** Explicit payload adapter. Git and Agent facts are owned by their producers. */
export function DevelopmentAtlas() {
  const projects = useProjects(),
    threads = useThreadShells();
  const input = useRef<HTMLInputElement>(null),
    frameBox = useRef<HTMLDivElement>(null);
  const [atlas, setAtlas] = useState<any>(),
    [url, setUrl] = useState<string>(),
    [selected, setSelected] = useState<any>(),
    [error, setError] = useState<string>();
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  useEffect(() => {
    if (!atlas) return;
    const select = (e: MessageEvent) => {
      if (
        e.source !== frameBox.current?.querySelector("iframe")?.contentWindow ||
        e.data?.type !== "development-atlas.selection/1" ||
        typeof e.data.id !== "string" ||
        e.data.id.length > 80
      )
        return;
      setSelected(
        [
          "repositories",
          "worktrees",
          "branches",
          "revisions",
          "changes",
          "files",
          "reviews",
          "ci",
          "agents",
          "components",
        ]
          .flatMap((k) => atlas[k])
          .find((entity: any) => entity.id === e.data.id),
      );
    };
    window.addEventListener("message", select);
    return () => window.removeEventListener("message", select);
  }, [atlas]);
  async function install(raw: string) {
    if (raw.length > 2 * 1024 * 1024) throw Error("Atlas exceeds 2 MiB");
    const [{ validateDevelopmentAtlas }, { renderDevelopmentHtml }] = await Promise.all([
      import("../../datapass/generated/diagram-core/index.mjs"),
      import("../../datapass/generated/diagram-core/page.mjs"),
    ]);
    const a = validateDevelopmentAtlas(JSON.parse(raw)),
      html = injectHtmlRenderBootstrap(renderDevelopmentHtml(a));
    setAtlas(a);
    setSelected(undefined);
    setError(undefined);
    setUrl(URL.createObjectURL(new Blob([html], { type: "text/html" })));
  }
  async function load(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw Error("Atlas exceeds 2 MiB");
      await install(await file.text());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }
  async function download() {
    if (!atlas) return;
    const { renderDevelopmentHtml } =
      await import("../../datapass/generated/diagram-core/page.mjs");
    const html = renderDevelopmentHtml(atlas);
    if (html.length > 512000) {
      setError("Page exceeds the T3 html_render input limit; use a narrower Lens scope.");
      return;
    }
    const link = document.createElement("a"),
      resource = URL.createObjectURL(
        new Blob(
          [
            JSON.stringify(
              { tool: "html_render", arguments: { html, title: "Development Atlas", height: 900 } },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
      );
    link.href = resource;
    link.download = "development-atlas-html-render.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(resource), 1000);
  }
  const entities = atlas
    ? [
        "repositories",
        "worktrees",
        "branches",
        "revisions",
        "changes",
        "files",
        "reviews",
        "ci",
        "agents",
        "components",
      ].flatMap((k) => atlas[k])
    : [];
  const matchingProjects = projects.filter(
    (p) =>
      sameCheckout(
        p.workspaceRoot,
        selected?.data?.worktreePath ?? selected?.data?.path ?? atlas?.scope?.worktree,
      ) ||
      threads.some(
        (t) =>
          t.projectId === p.id &&
          t.environmentId === p.environmentId &&
          sameCheckout(t.worktreePath, selected?.data?.worktreePath ?? atlas?.scope?.worktree),
      ),
  );
  const matchingThreads = threads.filter(
    (t) =>
      !t.archivedAt &&
      !t.deletedAt &&
      matchingProjects.some((p) => p.id === t.projectId && p.environmentId === t.environmentId) &&
      (selected?.kind === "agent"
        ? t.id === selected.data.sessionId
        : sameCheckout(
            t.worktreePath ??
              projects.find((p) => p.id === t.projectId && p.environmentId === t.environmentId)
                ?.workspaceRoot,
            selected?.data?.worktreePath ?? atlas?.scope?.worktree,
          )),
  );
  function focusView(view: string) {
    frameBox.current
      ?.querySelector("iframe")
      ?.contentWindow?.postMessage({ type: "development-atlas.view/1", view }, "*");
  }
  function openEditor() {
    if (!atlas || !selected) return;
    try {
      const scheme = new URLSearchParams(window.location.search).get("editorScheme") ?? "cursor",
        pointer = atlasEditorContext(atlas, selected);
      window.location.href = contextEditorLink(pointer, scheme);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }
  return (
    <section className="space-y-3 rounded-lg border p-4">
      <h2 className="font-semibold">DataPass Visual Host · Repository Atlas</h2>
      <p className="text-sm text-muted-foreground">
        Import a Lens Atlas snapshot. DiagramCloud renders the same facts and stable IDs. Missing
        Lens or Agent data stays unknown.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => input.current?.click()}>
          Import Atlas JSON
        </Button>
        <Button variant="outline" size="sm" disabled={!atlas} onClick={() => void download()}>
          Download in-thread render request
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!atlas}
          onClick={() => {
            try {
              localStorage.setItem("datapass.development-atlas/1", JSON.stringify(atlas));
            } catch {
              setError("Device storage is unavailable.");
            }
          }}
        >
          Keep snapshot on this device
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            try {
              const raw = localStorage.getItem("datapass.development-atlas/1");
              if (raw) void install(raw).catch((e) => setError(String(e)));
              else setError("No saved device snapshot.");
            } catch {
              setError("Device storage is unavailable.");
            }
          }}
        >
          Restore saved snapshot
        </Button>
      </div>
      <input
        ref={input}
        type="file"
        accept=".json"
        className="hidden"
        aria-label="Development Atlas JSON"
        onChange={(e) => void load(e.target.files?.[0])}
      />
      {error && <p role="alert">{error}</p>}
      {url && (
        <div ref={frameBox} className="h-[800px] overflow-auto">
          <HtmlRenderDocument src={url} title="Development Atlas" className="size-full" />
        </div>
      )}
      {selected && (
        <div className="space-y-2">
          <p className="break-all text-sm">
            Selected: {selected.label} · {selected.basis} · {selected.id}
          </p>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs">
            {JSON.stringify(selected.data, null, 2)}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={openEditor}>
              Open context in Lens
            </Button>
            <Button variant="outline" size="sm" onClick={() => focusView("review-impact")}>
              Show impact
            </Button>
            <Button variant="outline" size="sm" onClick={() => focusView("evolution")}>
              Show evolution
            </Button>
            {(selected.kind === "review" || selected.kind === "ci") &&
              atlasExternalLink(selected.data.url) && (
                <a
                  href={atlasExternalLink(selected.data.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open review / CI
                </a>
              )}
          </div>
          <p className="text-sm">
            {matchingProjects.map((p) => p.title).join(", ") ||
              "No connected T3 project matches this exact checkout."}
          </p>
          {matchingThreads.slice(0, 8).map((t) => (
            <Link
              key={`${t.environmentId}:${t.id}`}
              to="/$environmentId/$threadId"
              params={buildThreadRouteParams({ environmentId: t.environmentId, threadId: t.id })}
            >
              Focus {t.title}
            </Link>
          ))}
          <p className="text-xs">
            {atlas.relations
              .filter((r: any) => r.source === selected.id || r.target === selected.id)
              .map(
                (r: any) =>
                  `${r.basis}: ${r.label} → ${entities.find((e: any) => e.id === (r.source === selected.id ? r.target : r.source))?.label ?? "unknown"}`,
              )
              .join(" · ")}
          </p>
        </div>
      )}
    </section>
  );
}
