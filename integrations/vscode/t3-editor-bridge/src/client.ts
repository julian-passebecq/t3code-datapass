import path from 'node:path';
export interface Project {id:string;title:string;workspaceRoot:string;}
export interface Review {url:string;number:number;}
export interface Thread {id:string;projectId:string;title:string;providerInstanceId?:string;modelSelection?:{model?:string};status:string;branch?:string|null;worktreePath?:string|null;pendingRuntimeRequest?:{kind:string}|null;hasActionableProposedPlan?:boolean;lastError?:string|null;linkedPullRequest?:Review|null;branchPullRequest?:Review|null;archivedAt?:string|null;deletedAt?:string|null;}
export interface Snapshot {environmentId:string;label:string;projects:Project[];threads:Thread[];observedAt:string;}
export function serverOrigin(value:string){const url=new URL(value);if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('Set the T3 origin without credentials, path or query.');if(url.protocol==='http:'&&!['127.0.0.1','localhost','[::1]'].includes(url.hostname))throw Error('Remote T3 environments require HTTPS.');return url.origin;}
const object=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const text=(v:unknown)=>typeof v==='string'?v:undefined;
function rows(v:unknown):Record<string,unknown>[]{if(!Array.isArray(v)||v.length>5000)throw Error('Unsupported or oversized T3 snapshot');return v.map(object);}
export function decodeSnapshot(descriptor:unknown,projects:unknown,shell:unknown):Snapshot {
  const d=object(descriptor),p=object(projects),s=object(shell);
  if(!text(d.environmentId)||d.orchestrationProtocolVersion!==2||![1,2].includes(Number(s.schemaVersion)))throw Error('Unsupported T3 orchestration contract; protocol 2 / snapshot 1 or 2 required.');
  const projectRows=rows(p.projects);for(const p of projectRows)if(!text(p.id)||!text(p.title)||!text(p.workspaceRoot))throw Error('Invalid T3 project snapshot');
  const threadRows=rows(s.threads);for(const t of threadRows)if(!text(t.id)||!text(t.projectId)||!text(t.title)||!text(t.status))throw Error('Invalid T3 thread snapshot');
  return {environmentId:String(d.environmentId),label:text(d.label)??'T3',projects:projectRows as unknown as Project[],threads:(threadRows as unknown as Thread[]).filter(t=>!t.archivedAt&&!t.deletedAt),observedAt:new Date().toISOString()};
}
export function matchingContext(snapshot:Snapshot,workspace:string){const normalized=(s:string)=>process.platform==='win32'?path.resolve(s).toLowerCase():path.resolve(s);
  const target=normalized(workspace),exact=snapshot.threads.filter(t=>t.worktreePath&&normalized(t.worktreePath)===target);
  const project=snapshot.projects.find(p=>normalized(p.workspaceRoot)===target)??snapshot.projects.find(p=>exact.some(t=>t.projectId===p.id));
  return {project,threads:project?snapshot.threads.filter(t=>t.projectId===project.id&&normalized(t.worktreePath??project.workspaceRoot)===target):[]};}
export function needsAttention(t:Thread){return !!t.pendingRuntimeRequest||!!t.hasActionableProposedPlan||!!t.lastError||['failed','stopped','error'].includes(t.status);}
export class T3Client {
  constructor(public origin:string,private token?:string,private fetcher:typeof fetch=fetch) {this.origin=serverOrigin(origin);}
  async json(route:string,init:RequestInit={}) {
    const response=await this.fetcher(this.origin+route,{...init,redirect:'error',signal:AbortSignal.timeout(5000),headers:{'x-t3-orchestration-protocol':'2',...(this.token?{Authorization:`Bearer ${this.token}`} :{}),...init.headers}});
    if(!response.ok){await response.body?.cancel();throw Error(response.status===401||response.status===403?'Pair the bridge with T3 (read scope required).':`T3 request failed (${response.status})`);}
    if(Number(response.headers.get('content-length'))>4*1024*1024){await response.body?.cancel();throw Error('T3 response exceeds 4 MiB');}
    const reader=response.body?.getReader();if(!reader)throw Error('Empty T3 response');let length=0;const chunks:Uint8Array[]=[];
    try {for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>4*1024*1024)throw Error('T3 response exceeds 4 MiB');chunks.push(value);}}finally{await reader.cancel();}
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  }
  async snapshot(){const [d,p,s]=await Promise.all([this.json('/.well-known/t3/environment'),this.json('/api/projects'),this.json('/api/orchestration/shell')]);return decodeSnapshot(d,p,s);}
  async pair(credential:string){const body=new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:token-exchange',subject_token:credential,subject_token_type:'urn:t3:params:oauth:token-type:environment-bootstrap',requested_token_type:'urn:ietf:params:oauth:token-type:access_token',scope:'orchestration:read',client_label:'T3 Editor Bridge'});
    const result=object(await this.json('/oauth/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()}));
    if(result.token_type!=='Bearer'||!text(result.access_token))throw Error('T3 did not issue an editor bearer credential');return String(result.access_token);}
  async providerSession(threadId:string){const projection=object(object(await this.json('/api/orchestration/threads/'+encodeURIComponent(threadId)+'/bounded')).projection),providers=rows(projection.providerThreads);
    const thread=object(projection.thread),active=providers.find(p=>p.id===thread.activeProviderThreadId);
    if(active&&(active.driver==='codex'||active.driver==='claude')&&text(active.providerSessionId))return {provider:active.driver,sessionId:String(active.providerSessionId)};return undefined;}
}
