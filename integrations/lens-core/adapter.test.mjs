import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSuperLensAdapter} from './adapter.mjs';
test('missing Lens engine and incompatible versions are explicit failures',()=>{
  assert.throws(()=>createSuperLensAdapter(),/unavailable/);
  assert.throws(()=>createSuperLensAdapter({LENS_CONTRACT:'datapass.lens/2'}),/Unsupported/);
});
test('adapter bounds roots and preserves canonical engine projections',async()=>{
  const snapshot={repositories:[{id:'repo'}]},impact=[{evidence:'derived'}],evolution=[{commit:'abc'}];
  let disposed=false;
  const core={LENS_CONTRACT:'datapass.lens/1',ProjectService:class {
    async refresh(name,roots,depth,limit){assert.equal(depth,0);assert.equal(limit,40);return snapshot;}
    async loadChangeSets(s){assert.equal(s,snapshot);s.changeSets=[{id:'change'}];}
    dispose(){disposed=true;}
  },minimapProjection:s=>({repositories:s.repositories}),impactSamples:()=>impact,timeline:()=>evolution,
  lensEnvelope:data=>({schema:'datapass.lens/1',data})};
  const adapter=createSuperLensAdapter(core);
  await assert.rejects(adapter.inspectProject('x',Array(21).fill('x')),/at most 20/);
  const result=await adapter.inspectProject('x',['repo']);
  assert.equal(result.data.snapshot,snapshot);assert.equal(result.data.impact,impact);assert.equal(result.data.evolution,evolution);
  adapter.dispose();assert.equal(disposed,true);
});
