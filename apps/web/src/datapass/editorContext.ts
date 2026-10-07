import {parseDevContext,type DevContext} from './generated/dev-context.mjs';
export function incomingEditorContext(search:string):{pointer?:DevContext;error?:string;editorScheme?:string|undefined}{
  const params=new URLSearchParams(search),raw=params.get('devContext');if(!raw)return {};
  try{if(raw.length>16384)throw Error('oversized');const pointer=parseDevContext(JSON.parse(raw));
    const scheme=params.get('editorScheme');return {pointer,editorScheme:scheme&&['cursor','vscode','vscode-insiders','antigravity'].includes(scheme)?scheme:undefined};
  }catch{return {error:'Unsupported editor context. Open the project in Lens and copy a fresh context.'};}
}
export function contextEditorLink(pointer:DevContext,scheme:string){if(!['cursor','vscode','vscode-insiders','antigravity'].includes(scheme))throw Error('Unsupported editor host');return `${scheme}://julian-passebecq.tern-vscode/open?context=${encodeURIComponent(JSON.stringify(parseDevContext(pointer)))}`;}
export function sameCheckout(a:string|undefined|null,b:string|undefined|null){if(!a||!b)return false;const normalize=(s:string)=>{const n=s.replace(/\\/g,'/').replace(/\/$/,'');return /^[a-z]:\//i.test(n)?n.toLowerCase():n;};return normalize(a)===normalize(b);}
