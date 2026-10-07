/** Runtime seam: inject the installed @datapass/lens-core package, never a T3 Git implementation. */
export function createSuperLensAdapter(core) {
  if(!core)throw Error('Lens Core is unavailable');
  if(core.LENS_CONTRACT!=='datapass.lens/1')throw Error('Unsupported Lens Core contract');
  const service=new core.ProjectService();
  return {
    async inspectProject(name,roots) {
      if(!Array.isArray(roots)||roots.length>20)throw Error('Choose at most 20 repository roots');
      const snapshot=await service.refresh(name,roots,0,40);
      await service.loadChangeSets(snapshot);
      return core.lensEnvelope({snapshot,atlas:core.buildDevelopmentAtlas?.(snapshot,{project:name,worktree:roots[0]}),minimap:core.minimapProjection(snapshot),impact:core.impactSamples(snapshot,{}),evolution:core.timeline(snapshot)});
    },
    dispose:()=>service.dispose(),
  };
}
