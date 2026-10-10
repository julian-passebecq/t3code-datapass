import type {
  MosaicBuildReceipt,
  MosaicCompareResult,
  MosaicInspectResult,
  MosaicPreviewContract,
  ScopedThreadRef,
} from "@t3tools/contracts";
import {
  isAtomCommandInterrupted,
  squashAtomCommandFailure,
  type AtomCommandResult,
} from "@t3tools/client-runtime/state/runtime";
import { Hammer, MonitorPlay, RefreshCw, Shapes } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { openUrlInPreview } from "~/browser/openFileInPreview";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Spinner } from "~/components/ui/spinner";
import { useConnectedEnvironmentIds } from "~/state/environments";
import { mosaicEnvironment } from "~/state/mosaic";
import { previewEnvironment } from "~/state/preview";
import { useAtomCommand } from "~/state/use-atom-command";

import {
  MOSAIC_CONTRACT_PRESENTATION,
  MOSAIC_STATUS_PRESENTATION,
  formatBytes,
  previewAction,
  shortHash,
  shortSha,
  variantLabel,
} from "./mosaicPanelLogic";

const QUIET = { reportFailure: false, reportDefect: false } as const;

function failureMessage(result: AtomCommandResult<unknown, unknown>): string | null {
  if (result._tag !== "Failure" || isAtomCommandInterrupted(result)) return null;
  const error = squashAtomCommandFailure(result);
  return error instanceof Error ||
    (typeof error === "object" && error !== null && "message" in error)
    ? String((error as { message: unknown }).message)
    : "Something went wrong.";
}

interface MosaicPanelProps {
  readonly threadRef: ScopedThreadRef;
  /** The thread's checkout: its worktree when it has one, else the project root. */
  readonly cwd: string;
}

/**
 * Builds and previews the clients of a Mosaic checkout. Agents edit the code
 * through the thread as usual; this panel only runs the project's own build
 * script, shows what the output was built from, and opens it in the preview
 * browser on an origin of its own.
 */
// The panel unmounts when another right-panel tab is shown; keep the choice per checkout.
const lastClientByCwd = new Map<string, string>();

export default function MosaicPanel({ threadRef, cwd }: MosaicPanelProps) {
  const environmentId = threadRef.environmentId;
  const inspect = useAtomCommand(mosaicEnvironment.inspect, QUIET);
  const inspectClient = useAtomCommand(mosaicEnvironment.inspectClient, QUIET);
  const build = useAtomCommand(mosaicEnvironment.build, QUIET);
  const openMosaicPreview = useAtomCommand(mosaicEnvironment.openPreview, QUIET);
  const compare = useAtomCommand(mosaicEnvironment.compare, QUIET);
  const openPreview = useAtomCommand(previewEnvironment.open, QUIET);

  const [project, setProject] = useState<MosaicInspectResult | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<MosaicBuildReceipt | null>(null);
  const [comparison, setComparison] = useState<MosaicCompareResult | null>(null);
  const [otherCwd, setOtherCwd] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // The latest selection, so slower responses for an earlier one are dropped.
  const selectedRef = useRef<string | null>(lastClientByCwd.get(cwd) ?? null);

  const selectClient = useCallback(
    async (id: string) => {
      selectedRef.current = id;
      lastClientByCwd.set(cwd, id);
      setClientId(id);
      setReceipt(null);
      setComparison(null);
      setActionError(null);
      const result = await inspectClient({ environmentId, input: { cwd, clientId: id } });
      if (selectedRef.current !== id) return;
      if (result._tag === "Success") setReceipt(result.value);
      else setActionError(failureMessage(result));
    },
    [cwd, environmentId, inspectClient],
  );

  const applyProject = useCallback(
    async (result: Awaited<ReturnType<typeof inspect>>) => {
      if (result._tag !== "Success") {
        setProjectError(failureMessage(result));
        return;
      }
      setProjectError(null);
      const value = result.value;
      setProject(value);
      if (value._tag !== "Mosaic") return;
      const keep = selectedRef.current;
      const nextId =
        keep !== null && value.clients.some((client) => client.id === keep)
          ? keep
          : (value.clients[0]?.id ?? null);
      if (nextId !== null) await selectClient(nextId);
    },
    [selectClient],
  );

  // State is only set once the inspect response arrives, never synchronously in the effect.
  const loadProject = useCallback(
    () => inspect({ environmentId, input: { cwd } }).then(applyProject),
    [cwd, environmentId, inspect, applyProject],
  );

  // Waits for the environment and reloads when it reconnects, e.g. after a server restart.
  const connected = useConnectedEnvironmentIds().includes(environmentId);
  useEffect(() => {
    if (connected) void loadProject();
  }, [connected, loadProject]);

  const refresh = () => void loadProject();

  const run = useCallback(
    async <A,>(
      label: string,
      action: () => Promise<AtomCommandResult<A, unknown>>,
      onSuccess: (value: A) => void | Promise<void>,
    ) => {
      setBusy(label);
      setActionError(null);
      try {
        const result = await action();
        if (result._tag === "Success") await onSuccess(result.value);
        else setActionError(failureMessage(result));
      } finally {
        setBusy(null);
      }
    },
    [],
  );

  const buildIn = (targetCwd: string) =>
    clientId === null
      ? undefined
      : run(
          `build:${targetCwd}`,
          () => build({ environmentId, input: { cwd: targetCwd, clientId } }),
          (value) => {
            if (targetCwd === cwd) setReceipt(value);
            setComparison(null);
          },
        );

  const previewIn = (targetCwd: string) =>
    clientId === null
      ? undefined
      : run(
          `preview:${targetCwd}`,
          () => openMosaicPreview({ environmentId, input: { cwd: targetCwd, clientId } }),
          async (value) => {
            if (targetCwd === cwd) setReceipt(value.receipt);
            const opened = await openUrlInPreview({ threadRef, url: value.url, openPreview });
            const message = failureMessage(opened);
            if (message !== null) setActionError(message);
          },
        );

  const runCompare = () =>
    clientId === null || otherCwd === null
      ? undefined
      : run(
          "compare",
          () => compare({ environmentId, input: { clientId, baseCwd: cwd, otherCwd } }),
          (value) => {
            setComparison(value);
            setReceipt(value.base);
          },
        );

  if (!connected) {
    return (
      <PanelFrame onRefresh={refresh}>
        <div className="flex items-center gap-2 p-4 text-muted-foreground text-sm">
          <Spinner /> Waiting for the environment to connect…
        </div>
      </PanelFrame>
    );
  }

  if (project === null) {
    return (
      <PanelFrame onRefresh={refresh}>
        {projectError === null ? (
          <div className="flex items-center gap-2 p-4 text-muted-foreground text-sm">
            <Spinner /> Looking for Mosaic clients…
          </div>
        ) : (
          <p className="p-4 text-destructive-foreground text-sm" role="alert">
            {projectError}
          </p>
        )}
      </PanelFrame>
    );
  }

  if (project._tag === "NotMosaic") {
    return (
      <PanelFrame onRefresh={refresh}>
        <div className="space-y-2 p-4 text-sm">
          <p className="font-medium">This checkout is not a Mosaic project.</p>
          <p className="text-muted-foreground">
            {project.reason === "no-package-json"
              ? "There is no package.json here."
              : project.reason === "no-build-script"
                ? "package.json has no build:client script."
                : "No clients/<id>/app.ts was found."}{" "}
            Mosaic support is optional; nothing else in T3 Code needs it.
          </p>
        </div>
      </PanelFrame>
    );
  }

  const otherVariants = project.variants.filter((variant) => !variant.current);
  const action = receipt === null ? null : previewAction(receipt);

  return (
    <PanelFrame onRefresh={refresh}>
      <div className="space-y-4 p-3 text-sm">
        <section aria-label="Clients" className="space-y-1">
          <h3 className="font-medium text-muted-foreground text-xs uppercase">Clients</h3>
          <div className="flex flex-wrap gap-1">
            {project.clients.map((client) => (
              <Button
                key={client.id}
                size="compact"
                variant={client.id === clientId ? "secondary" : "ghost"}
                aria-pressed={client.id === clientId}
                onClick={() => void selectClient(client.id)}
              >
                {client.title ?? client.id}
                {client.family !== null && (
                  <span className="text-muted-foreground">{client.family}</span>
                )}
              </Button>
            ))}
          </div>
        </section>

        {actionError !== null && (
          <p className="text-destructive-foreground" role="alert">
            {actionError}
          </p>
        )}

        {receipt === null ? (
          clientId !== null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner /> Reading build…
            </div>
          )
        ) : (
          <ReceiptView receipt={receipt} building={busy === `build:${cwd}`}>
            <div className="flex flex-wrap gap-2">
              <Button
                size="compact"
                variant="outline"
                disabled={busy !== null || receipt.status === "building"}
                onClick={() => void buildIn(cwd)}
              >
                {busy === `build:${cwd}` ? <Spinner /> : <Hammer />}
                {receipt.output === null ? "Build" : "Rebuild"}
              </Button>
              <Button
                size="compact"
                variant={receipt.status === "ready" ? "default" : "outline"}
                disabled={busy !== null || !action?.enabled}
                onClick={() => void previewIn(cwd)}
              >
                {busy === `preview:${cwd}` ? <Spinner /> : <MonitorPlay />}
                {action?.label}
              </Button>
            </div>
          </ReceiptView>
        )}

        <section aria-label="Compare variants" className="space-y-2 border-t pt-3">
          <h3 className="font-medium text-muted-foreground text-xs uppercase">Compare with</h3>
          {otherVariants.length === 0 ? (
            <p className="text-muted-foreground">
              No other worktree of this repository. Create one from the branch menu to build a
              variant side by side.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1">
                {otherVariants.map((variant) => (
                  <Button
                    key={variant.path}
                    size="compact"
                    variant={variant.path === otherCwd ? "secondary" : "ghost"}
                    aria-pressed={variant.path === otherCwd}
                    onClick={() => {
                      setOtherCwd(variant.path);
                      setComparison(null);
                    }}
                  >
                    {variantLabel(variant)}
                  </Button>
                ))}
              </div>
              <Button
                size="compact"
                variant="outline"
                disabled={busy !== null || otherCwd === null || clientId === null}
                onClick={() => void runCompare()}
              >
                {busy === "compare" ? <Spinner /> : null}
                Compare
              </Button>
            </>
          )}
          {comparison !== null && otherCwd !== null && (
            <div className="space-y-2">
              <p>
                {comparison.changedFiles.length === 0
                  ? "Same committed source."
                  : `${comparison.changedFiles.length}${comparison.changedFilesTruncated ? "+" : ""} files differ between ${shortSha(comparison.base.git.head)} and ${shortSha(comparison.other.git.head)}.`}{" "}
                {comparison.base.output !== null && comparison.other.output !== null
                  ? comparison.sameOutput
                    ? "Both builds are byte-identical."
                    : "The builds differ."
                  : null}
              </p>
              {comparison.changedFiles.length > 0 && (
                <ul className="max-h-32 overflow-auto font-mono text-xs">
                  {comparison.changedFiles.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              )}
              <ReceiptView
                receipt={comparison.other}
                title="Other variant"
                building={busy === `build:${otherCwd}`}
              >
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="compact"
                    variant="outline"
                    disabled={busy !== null}
                    onClick={() => void buildIn(otherCwd)}
                  >
                    {busy === `build:${otherCwd}` ? <Spinner /> : <Hammer />}
                    Build other
                  </Button>
                  <Button
                    size="compact"
                    variant="outline"
                    disabled={busy !== null || !previewAction(comparison.other).enabled}
                    onClick={() => void previewIn(otherCwd)}
                  >
                    {busy === `preview:${otherCwd}` ? <Spinner /> : <MonitorPlay />}
                    {previewAction(comparison.other).label}
                  </Button>
                </div>
              </ReceiptView>
              <p className="text-muted-foreground text-xs">
                Each preview opens in its own browser tab. Merging the variant you prefer stays a
                normal Git and pull request step.
              </p>
            </div>
          )}
        </section>
      </div>
    </PanelFrame>
  );
}

function PanelFrame(props: { readonly onRefresh: () => void; readonly children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Shapes className="size-4 shrink-0" />
        <span className="font-medium text-sm">Mosaic</span>
        <Button
          className="ml-auto"
          size="icon-xs"
          variant="ghost"
          aria-label="Refresh Mosaic project"
          onClick={() => props.onRefresh()}
        >
          <RefreshCw />
        </Button>
      </div>
      <ScrollArea className="min-h-0 flex-1">{props.children}</ScrollArea>
    </div>
  );
}

/**
 * What the build's `preview.json` says and whether the output still matches it.
 * Artifacts are listed, never rendered: the client's own viewer shows them in the preview.
 */
function ContractView(props: { readonly contract: MosaicPreviewContract }) {
  const { contract } = props;
  const state = MOSAIC_CONTRACT_PRESENTATION[contract.state];
  const descriptor = contract.descriptor;
  return (
    <section aria-label="Preview contract" className="space-y-1">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">Contract</span>
        <Badge
          variant={state.tone}
          tabIndex={0}
          aria-label={`Contract: ${state.label}. ${state.description}`}
        >
          {state.label}
        </Badge>
        <span className="text-muted-foreground">{state.description}</span>
      </div>
      {contract.problems.length > 0 && (
        <ul aria-label="Contract problems" className="space-y-0.5 text-muted-foreground text-xs">
          {contract.problems.map((problem) => (
            <li key={problem} className="break-words">
              {problem}
            </li>
          ))}
        </ul>
      )}
      {descriptor !== null && (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 text-xs">
          <dt className="text-muted-foreground">SDK</dt>
          <dd className="font-mono">{descriptor.sdkVersion}</dd>
          <dt className="text-muted-foreground">Built from</dt>
          <dd className="truncate font-mono">
            {descriptor.sourceCommit === null ? "uncommitted" : shortSha(descriptor.sourceCommit)}
          </dd>
          <dt className="text-muted-foreground">Publication</dt>
          <dd>
            {descriptor.publication.mode}
            {descriptor.publication.noindex ? " · noindex" : ""}
          </dd>
          <dt className="text-muted-foreground">Entry</dt>
          <dd className="truncate font-mono">{descriptor.entry}</dd>
        </dl>
      )}
      {descriptor !== null && descriptor.artifacts.length > 0 && (
        <details>
          <summary className="cursor-pointer text-muted-foreground text-xs">
            Artifacts ({descriptor.artifacts.length})
          </summary>
          <ul aria-label="Artifacts" className="mt-1 space-y-0.5 text-xs">
            {descriptor.artifacts.map((artifact) => (
              <li
                key={artifact.id}
                tabIndex={0}
                aria-label={`Artifact ${artifact.id}, ${artifact.provenance}, ${artifact.path}, sha256 ${shortHash(artifact.sha256)}`}
                className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-mono">{artifact.id}</span> · {artifact.provenance} ·{" "}
                <span className="font-mono">{shortHash(artifact.sha256)}</span>
                <span className="block truncate font-mono text-muted-foreground">
                  {artifact.path}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-muted-foreground text-xs">
            Open the preview to view artifacts in the client's own viewer.
          </p>
        </details>
      )}
    </section>
  );
}

function ReceiptView(props: {
  readonly receipt: MosaicBuildReceipt;
  readonly title?: string;
  /** A build this panel started is running; the receipt predates it. */
  readonly building?: boolean;
  readonly children?: ReactNode;
}) {
  const { receipt } = props;
  const status = MOSAIC_STATUS_PRESENTATION[props.building ? "building" : receipt.status];
  return (
    <section aria-label={props.title ?? "Build"} className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {props.title !== undefined && <span className="font-medium">{props.title}</span>}
        <Badge variant={status.tone} aria-live="polite">
          {status.label}
        </Badge>
      </div>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 text-xs">
        <dt className="text-muted-foreground">Checkout</dt>
        <dd className="truncate font-mono">{receipt.cwd}</dd>
        <dt className="text-muted-foreground">Source</dt>
        <dd className="truncate font-mono">
          {shortSha(receipt.git.head)}
          {receipt.git.branch === null ? "" : ` · ${receipt.git.branch}`}
          {receipt.git.dirtyCount === 0 ? "" : ` · ${receipt.git.dirtyCount} uncommitted`}
        </dd>
        {receipt.output !== null && (
          <>
            <dt className="text-muted-foreground">Output</dt>
            <dd className="truncate font-mono">
              {shortHash(receipt.output.sha256)} · {receipt.output.fileCount} files ·{" "}
              {formatBytes(receipt.output.totalBytes)}
            </dd>
            <dt className="text-muted-foreground">Built</dt>
            <dd>{new Date(receipt.output.builtAt).toLocaleString()}</dd>
          </>
        )}
        {receipt.lastRun !== null && (
          <>
            <dt className="text-muted-foreground">Last build</dt>
            <dd className="truncate font-mono">
              {receipt.lastRun.timedOut
                ? "timed out"
                : receipt.lastRun.exitCode === 0
                  ? "succeeded"
                  : `exit ${receipt.lastRun.exitCode ?? "?"}`}{" "}
              at {shortSha(receipt.lastRun.headAtStart)} · {receipt.lastRun.command}
            </dd>
          </>
        )}
      </dl>
      {receipt.contract !== null && <ContractView contract={receipt.contract} />}
      {props.children}
      {receipt.lastRun !== null && receipt.lastRun.logTail !== "" && (
        <details open={receipt.status === "failed"}>
          <summary className="cursor-pointer text-muted-foreground text-xs">Build log</summary>
          <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-2 text-xs">
            {receipt.lastRun.logTail}
          </pre>
        </details>
      )}
      {receipt.artifacts.length > 0 && (
        <details>
          <summary className="cursor-pointer text-muted-foreground text-xs">
            Contract documents ({receipt.artifacts.length})
          </summary>
          <ul className="mt-1 space-y-1 text-xs">
            {receipt.artifacts.map((artifact) => (
              <li key={artifact.path}>
                <span className="font-mono">{artifact.path}</span>
                {" · "}
                {artifact.format}
                {artifact.title !== null && ` · ${artifact.title}`}
                {artifact.provenanceKind !== null &&
                  ` · ${artifact.provenanceKind}${artifact.provenanceSource === null ? "" : ` from ${artifact.provenanceSource}`}`}
                {artifact.problems.length > 0 && (
                  <span className="block text-destructive-foreground">
                    {artifact.problems.join("; ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
