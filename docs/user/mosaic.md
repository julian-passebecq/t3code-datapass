# Mosaic builds and previews

If a project is a DataPass Mosaic checkout, T3 Code can build its clients and show the result
beside the thread, so you can ask an agent for a change, rebuild, and look at it without leaving
the app. It is optional: other projects never see it, and the project needs nothing from T3 Code.

Open it from the command palette with **Open Mosaic builds and previews**. T3 Code treats a
folder as a Mosaic project when its `package.json` has a `build:client` script and it has at
least one `clients/<id>/app.ts`. The panel works on the thread's checkout, so a thread in a
worktree builds that worktree.

- **Build** runs `npm run build:client -- <id>` in the checkout, exactly as you would from a
  terminal. It needs the same permission as opening a terminal.
- **Open preview** serves `dist-clients/<id>` and opens it in the browser panel. Each output gets
  its own local address, separate from T3 Code. T3 Code refuses requests sent from a preview
  page, and a preview cannot open connections, frames, form posts or popups to any other address,
  so it cannot reach your session. The client's own `_headers` security policy applies on top and
  can only tighten this; when there is none, a same-origin-only policy is used. Only files inside
  the output folder are served; a symlink pointing outside it is not followed. Reload the browser tab
  after a rebuild.
- The build card shows the commit, uncommitted files, a hash of the output and the last build's
  result. **Stale** means sources changed after the build. A failed build cannot be previewed until
  a build succeeds, even if older output is still on disk.
- **Contract** checks the `preview.json` that Mosaic writes after a build against the files on
  disk. **Verified** means every file matches it, and the preview then refuses any file that
  changes afterwards until you reopen it. **Stale** means sources or output bytes changed after
  the build; it still opens, labelled stale. **Invalid** (a malformed or edited `preview.json`) and
  **Failed** cannot be previewed. **Legacy adapter** is an older client with no `preview.json`: it
  opens, unverified. The card also shows the SDK version, the commit the build came from (or
  "uncommitted"), the publication mode, the entry page and each declared artifact with its
  provenance and hash.
- Artifact and concept files shipped with the client are listed with their provenance, and any
  missing required fields are flagged. The client's own viewer renders them in the preview.

To compare two versions, create a second worktree of the repository, then pick it under
**Compare with**. T3 Code lists the files that differ between the two commits, tells you whether
the builds are identical, and opens each preview in its own browser tab. Choosing and merging the
version you prefer stays an ordinary Git step.

Nothing here replaces the normal route: with T3 Code stopped, the same output still builds with
`npm run build:client -- <id>` and runs with `npm run client:dev -- <id>`.

Mosaic support is on web and desktop. On a remote desktop connection, previews need the server
browser runtime, since the preview address only listens on the host's loopback.
