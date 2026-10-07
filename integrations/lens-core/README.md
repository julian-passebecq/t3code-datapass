# Shared Lens seam

Status: CONTRACT READY. The Node adapter has been exercised with the independently
packaged Lens Core against real local repositories. A T3-native Change Review screen
is staged: this adapter is not wired to a server endpoint or advertised as a live UI.

Inject `@datapass/lens-core` into `createSuperLensAdapter(core)`, call
`inspectProject(name, roots)`, and dispose it. The result contains the canonical
snapshot, Minimap, Impact and Evolution projections under `datapass.lens/1`.
Git calculations belong to Lens Core. No copied algorithms belong here.

The next integration is one authenticated, read-only server service using the current
T3 project's exact checkout, with cancellation and revision freshness checked before
presenting Change Review. The UI should reuse the existing cockpit and provider actions.
Keep heavy Git work on the environment server; web, desktop and mobile can consume the
same DTO without an editor. Do not add a production editor extension to make this work.

`node --test integrations/lens-core/adapter.test.mjs` checks absent engine, incompatible
contract, bounds and projection preservation. Lens's real fixture tests own stale
revision resolution; the trial qualification additionally injects the real package.
