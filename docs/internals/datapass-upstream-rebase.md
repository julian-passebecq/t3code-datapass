# Maintaining the DataPass fork

The Lens seam deliberately stays outside T3 orchestration and generic UI: its Node
adapter lives in `integrations/lens-core`; the browser parser is generated from Lens's
canonical context source; navigation is localized to the existing custom DataPass
cockpit. A future server service must consume Lens DTOs rather than transplanting
Git calculations into T3.

Qualification fetched upstream main at
`365aa87982a4d81cc8e0c085e8d1a40ca7daecdc`. This trial modifies only the existing
custom `DataPassCockpit.tsx` among tracked baseline files. It adds custom context
helpers, generated parser, integration packages and architectural documentation.

The inherited fork already touches generic upstream files:
`CommandPalette.tsx`, `settings/IntegrationsSettings.tsx`, `sidebar/SidebarChrome.tsx`,
`sidebar/mainAppLocation.ts`, and `routeTree.gen.ts`, plus root `.gitignore` and README.
Those are the likely update conflict points. Regenerate the route tree with upstream
tooling; manually preserve the custom cockpit entry instead of overwriting generic
navigation. Review changes to NewThread handling and Button variants when rebasing.

Expected full-fork update cost is MEDIUM; this trial's added seam is LOW. This is a
diff-based feasibility assessment, not a successful rebase. No branches or MRs were
merged and no history was rewritten during qualification.
