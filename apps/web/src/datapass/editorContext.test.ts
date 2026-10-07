import {describe,it,expect} from 'vite-plus/test';
import {incomingEditorContext,contextEditorLink,sameCheckout} from './editorContext';
describe('shared editor navigation pointer',()=>{
  it('round trips the actual host scheme without requiring an editor',()=>{const p={version:'galaxy.dev-context/1' as const,repository:{path:'D:/synthetic/repo'},worktreePath:'D:/synthetic/worktree',revision:'a'.repeat(40)};const input=incomingEditorContext('?'+new URLSearchParams({devContext:JSON.stringify(p),editorScheme:'cursor'}));expect(input.pointer).toEqual(p);expect(contextEditorLink(input.pointer!,'cursor')).toMatch(/^cursor:\/\/julian-passebecq.tern-vscode\/open/);expect(incomingEditorContext('')).toEqual({});});
  it('rejects invalid versions/unsafe host URIs and matches exact Windows checkout paths',()=>{expect(incomingEditorContext('?devContext='+encodeURIComponent(JSON.stringify({version:'bad'}))).error).toBeTruthy();expect(()=>contextEditorLink({version:'galaxy.dev-context/1',repository:{path:'x'}},'javascript')).toThrow();expect(sameCheckout('D:\\repo\\worktree','d:/repo/worktree')).toBe(true);expect(sameCheckout('/repo/a','/repo/ab')).toBe(false);});
});
