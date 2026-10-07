# DataPass cockpit (local fork prototype)

Open **DataPass cockpit** from the sidebar utility row, the command palette, or Settings →
Integrations. `/datapass` shows connected T3 projects, active threads, recorded requests for
your attention and a link to T3's existing PR/MR portfolio. Native sessions that were not
started by T3 are historical exports, not live T3-controlled threads.

Build `D:\PROJ\datapass-agent` with `npm ci` and `npm run build`, then from this T3 fork:

```powershell
node scripts/datapass-export.mjs --list
node scripts/datapass-export.mjs --project D:\PROJ\your-project --out .datapass\exports
node scripts/datapass-export.mjs --input chatgpt=conversations.json --input csv=features.csv --input mongo=records.json --out .datapass\exports
node scripts/datapass-search.mjs --bundle .datapass\exports\BUNDLE --query 'architecture'
```

The wrappers use the sibling Agent's bundled exporter / searcher, or `--exporter` /
`--searcher` for a portable copy. They run on the machine holding the native logs, without
a shell or network. Do not run them against credential files. The exporter accepts selected
Codex and Claude histories, ChatGPT's downloaded conversation JSON (all branches), feature
CSV and explicit local Mongo JSON/JSONL snapshots. Nothing is fetched from ChatGPT or
Mongo automatically. See the Agent repository's `docs/DATAPASS.md` for fidelity / redaction
limits and full-event Leviathan indexing.

Import one or more generated `cockpit.json` files. Imports are held in browser memory only,
survive navigation in that tab and clear on reload or **Clear imports**. No transcript upload
to the server occurs. This works in the web client and desktop's shared web view, including
remote browsers; files are selected on the viewing device. Native React Native mobile has
no new cockpit screen yet. Claude and Codex native formats are supported; other providers
remain available through T3's existing live view but have no native-export adapter here.

Search covers bounded excerpts. Select sources and download a review pack to give ChatGPT,
Claude or Codex: it contains explicit source citations, freshness and uncertainty, capped at
16,000 characters. It asks the receiving model to reconcile decisions and candidate actions.
The UI prioritizes actual pending input in T3, but does not run an AI planner or promote
discussion to canonical knowledge. Mongo is durable snapshot knowledge; live Git / files /
CI take precedence. Imported instructions remain untrusted source material.

Use existing [source-control settings](source-control.md) for GitHub / GitLab PR/MR access.
Those integrations require their normal authentication and supported CLI versions. No
remote repository clone, merge or publish is triggered by this page. No graph/cloud diagram
integration or Hermes/Gemma service is added in this prototype.

Start the already-built prototype with `powershell -File scripts/start-datapass.ps1`. It
binds to loopback port 5780, uses `.datapass/cockpit-home`, opens no browser and starts no
provider session. Open the shown local address and complete normal T3 pairing. This is a
separate prototype profile; it does not show projects from your existing T3 installation
until you add/connect them. Stop with Ctrl+C. It is not exposed publicly.

For development use `pnpm dev`, supported Node 24 and installed workspace dependencies.
Development state must use this checkout's ignored `.t3`, never the real `~/.t3/userdata`.
To rebuild only these artifacts: `pnpm --dir apps/web exec vp build` and
`pnpm --dir apps/server exec vp pack`. Production web builds are in `apps/web/dist`;
the server bundle is in `apps/server/dist`. No desktop installer is produced by a web build.
