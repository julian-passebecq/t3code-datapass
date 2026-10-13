// @effect-diagnostics nodeBuiltinImport:off globalDate:off globalConsole:off globalTimers:off - Standalone dev launcher wrapping the server entry; it has no Effect runtime.
// `node --watch` for the server's `dev` script, minus the Windows restart loop.
//
// libuv's Windows watcher subscribes to last-access changes, so with NTFS
// last-access updates enabled every module the server reads fires a change
// event and `node --watch` restarts forever. On win32 this script runs the
// entry without `--watch` and restarts it only when a watched file's mtime or
// size actually changed. Elsewhere it hands straight to `node --watch`.
//
// Usage: node scripts/dev-watch.ts src/bin.ts [args...]
import * as NodeChildProcess from "node:child_process";
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";

export interface FileStamp {
  readonly mtimeMs: number;
  readonly size: number;
}

const IGNORED_SEGMENTS = new Set(["node_modules", "dist", ".turbo", ".t3"]);

/** Whether a path relative to a watch root can affect the running server. */
export function isWatchedPath(relativePath: string): boolean {
  return !relativePath.split(/[\\/]/).some((segment) => IGNORED_SEGMENTS.has(segment));
}

/**
 * Whether an fs event reflects a content change. `previous` is the last stamp
 * seen for the file (undefined if never seen), `next` its current stamp
 * (undefined if it no longer exists). Files first seen after the watcher
 * started count as changed only when written after that start.
 */
export function isContentChange(
  previous: FileStamp | undefined,
  next: FileStamp | undefined,
  watchStartedAtMs: number,
): boolean {
  if (next === undefined) return previous !== undefined;
  if (previous === undefined) return next.mtimeMs >= watchStartedAtMs;
  return previous.mtimeMs !== next.mtimeMs || previous.size !== next.size;
}

function readStamp(path: string): FileStamp | undefined {
  try {
    const stats = NodeFS.statSync(path);
    return stats.isFile() ? { mtimeMs: stats.mtimeMs, size: stats.size } : undefined;
  } catch {
    return undefined;
  }
}

function snapshot(root: string, stamps: Map<string, FileStamp>): void {
  for (const entry of NodeFS.readdirSync(root, { withFileTypes: true })) {
    if (IGNORED_SEGMENTS.has(entry.name)) continue;
    const path = NodePath.join(root, entry.name);
    if (entry.isDirectory()) snapshot(path, stamps);
    else if (entry.isFile()) {
      const stamp = readStamp(path);
      if (stamp) stamps.set(path, stamp);
    }
  }
}

function runWindowsWatcher(entryArgs: ReadonlyArray<string>): void {
  // The server runs workspace packages from source, so watch those too.
  const roots = [NodePath.resolve("src"), NodePath.resolve("../../packages")];
  const watchStartedAtMs = Date.now();
  const stamps = new Map<string, FileStamp>();
  for (const root of roots) snapshot(root, stamps);

  let child: NodeChildProcess.ChildProcess | undefined;
  // The process being stopped for a restart; the next one starts when it exits.
  let stopping: NodeChildProcess.ChildProcess | undefined;
  let restartTimer: NodeJS.Timeout | undefined;
  let pendingChange: string | undefined;

  const start = () => {
    const current = NodeChildProcess.spawn(process.execPath, entryArgs, { stdio: "inherit" });
    child = current;
    current.on("exit", (code, signal) => {
      if (child !== current) return;
      child = undefined;
      console.log(
        `[dev-watch] Process exited (${signal ?? `code ${code}`}). Waiting for file changes before restarting...`,
      );
    });
  };

  const restart = () => {
    console.log(`[dev-watch] Restarting: ${pendingChange} changed`);
    pendingChange = undefined;
    // A restart is already waiting for the old process to exit; the start it queued
    // picks up this change too, so a second start here would run two servers.
    if (stopping) return;
    const previous = child;
    child = undefined;
    if (previous && previous.exitCode === null && previous.signalCode === null) {
      stopping = previous;
      previous.once("exit", () => {
        stopping = undefined;
        start();
      });
      previous.kill();
    } else {
      start();
    }
  };

  for (const root of roots) {
    NodeFS.watch(root, { recursive: true }, (_event, filename) => {
      if (!filename || !isWatchedPath(filename)) return;
      const path = NodePath.join(root, filename);
      const next = readStamp(path);
      const changed = isContentChange(stamps.get(path), next, watchStartedAtMs);
      if (next) stamps.set(path, next);
      else stamps.delete(path);
      if (!changed) return;
      pendingChange = path.split(NodePath.sep).slice(-3).join("/");
      clearTimeout(restartTimer);
      restartTimer = setTimeout(restart, 100);
    });
  }

  const stop = () => {
    child?.kill();
    stopping?.kill();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  start();
}

if (import.meta.main) {
  const entryArgs = process.argv.slice(2);
  // oxlint-disable-next-line t3code/no-global-process-runtime -- Standalone dev launcher has no Effect runtime.
  if (process.platform === "win32") {
    runWindowsWatcher(entryArgs);
  } else {
    const child = NodeChildProcess.spawn(process.execPath, ["--watch", ...entryArgs], {
      stdio: "inherit",
    });
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
      process.on(signal, () => child.kill(signal));
    }
    child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
  }
}
