# T3 Editor Bridge — experimental transport spike

Recommendation: KEEP. This is optional research and is not a required third VSIX.
Tomorrow's trial installs only Agent and Lens; T3 runs standalone. Preserve the
transport/reconnect tests and exact checkout matching. Further production UI work
belongs in T3 and its shared Lens adapter.

Build independently here: `npm install`, `npm run check`, `npm test`,
`npm run package`. No root workspace configuration change is needed.

Set `t3Editor.serverUrl` to the origin printed by your T3 start command.
Run **T3: Pair Editor Bridge** and paste a T3 pairing credential. The bridge
exchanges it via T3's existing `/oauth/token` contract for read-only bearer
access, stored per origin in VS Code SecretStorage. It never reads auth files.
Forget it with **T3: Forget Editor Credential**; revoke it in T3 Connections.

The native T3 view reads the existing environment descriptor, `/api/projects`,
and `/api/orchestration/shell` with protocol 2. It matches exact checkout paths
and clears stale context on disconnect. Refresh retries after server startup or
restart. Remote origins require HTTPS. Reads are bounded to 4 MiB / 5 seconds.

Open project, thread, worktree and PR/MR using standard editor/browser actions.
Respond to input or permissions in T3. CI detail stays in T3 because shell
snapshots do not expose checks. Provider instance IDs remain source labels;
native Claude/Codex session IDs are resolved on demand for Agent navigation.
Missing Lens and Agent are safe. VSmux is optional; no private APIs are used.

Trial handoff limitations: **Start New Thread** opens the matched project in
T3; create the thread there. **Send Selection** explicitly copies at most
16 KiB and opens a selected T3 thread; paste and submit in T3. No content is
sent automatically, and there is no duplicate chat client or provider runtime.

The shared Lens engine seam is at `integrations/lens-core/adapter.mjs`.
The full T3 Super Lens presentation is future work.
