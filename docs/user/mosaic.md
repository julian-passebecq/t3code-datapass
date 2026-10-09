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
  its own local address, separate from T3 Code, so a preview cannot reach your session. It uses
  the client's own `_headers` security policy, or a same-origin-only policy when there is none.
  Reload the browser tab after a rebuild.
- The build card shows the commit, uncommitted files, a hash of the output and the last build's
  result. **Stale** means sources changed after the build. A failed build cannot be previewed until
  a build succeeds, even if older output is still on disk.
- Artifact and concept files shipped with the client are listed with their provenance, and any
  missing required fields are flagged. The client itself renders them.

To compare two versions, create a second worktree of the repository, then pick it under
**Compare with**. T3 Code lists the files that differ between the two commits, tells you whether
the builds are identical, and opens each preview in its own browser tab. Choosing and merging the
version you prefer stays an ordinary Git step.

Nothing here replaces the normal route: with T3 Code stopped, the same output still builds with
`npm run build:client -- <id>` and runs with `npm run client:dev -- <id>`.

Mosaic support is on web and desktop. On a remote desktop connection, previews need the server
browser runtime, since the preview address only listens on the host's loopback.
