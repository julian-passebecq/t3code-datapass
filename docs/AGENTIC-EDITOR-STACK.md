# Agentic editor stack

T3 owns the standalone runtime and cockpit. Lens Core owns Git intelligence; Lens
VSIX and the staged T3 Super Lens adapter consume that same engine. Agent VSIX
independently observes Claude/Codex artifacts and exports evidence. Cursor,
Antigravity and VSmux are optional workstation conveniences.

The only required editor packages are Agent and Lens. The preserved
`integrations/vscode/t3-editor-bridge` is an experimental transport spike. Its read
token exchange, exact checkout matching and reconnect handling are useful research;
it is not a third product or a dependency of Lens-to-T3 navigation.

`galaxy.dev-context/1` crosses product boundaries without becoming a database. Each
consumer verifies its own object. Agent sessions correlate only through explicit
OBSERVED/DERIVED annotations. Timestamps cannot establish authorship. Lens opens the
standalone `/datapass` URL and copies bounded context for explicit submission. T3
returns a host scheme supplied by the editor; no editor is required to use T3.

Super Lens's next view is Change Review, using the shared adapter's real ChangeSet,
Impact and Evolution output. NOW, CHANGES, REVIEW and EVOLUTION are projections over
existing Git and runtime facts. No new canonical change database is proposed.

The Development Atlas remains future work. Lens supplies observed Git facts and
derived change/impact relations; Agent supplies explicit session evidence; declared
component membership remains DECLARED and inference must remain labelled INFERRED.
DiagramCloud owns graph semantics, ViewSpec and evidence links. MosaicStudio owns
2D/isometric/3D rendering and interaction. No new renderer or production 3D is part
of this trial. A validated `development-atlas/0.1` payload is the next bounded step.

The current web/desktop custom cockpit accepts the context URL and offers an explicit
return to Lens. Mobile remains independently usable, but editor URL handling has not
been added to its separate navigation. No provider adapter, orchestration command,
MCP surface or wire schema changes are required by this navigation-only seam.
