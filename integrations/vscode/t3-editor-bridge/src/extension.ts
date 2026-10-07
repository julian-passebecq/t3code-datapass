import * as vscode from 'vscode';
import {stat} from 'node:fs/promises';
import {T3Client,matchingContext,needsAttention,serverOrigin,type Thread} from './client';
import {BridgeState} from './state';
type Row={section:string}|{label:string;command?:string;argument?:unknown;description?:string}|{thread:Thread};
export async function activate(ctx:vscode.ExtensionContext) {
  const start=performance.now(),out=vscode.window.createOutputChannel('T3 Editor Bridge'),state=new BridgeState();
  const changed=new vscode.EventEmitter<Row|undefined>();
  const origin=()=>serverOrigin(vscode.workspace.getConfiguration('t3Editor').get<string>('serverUrl',''));
  const client=async()=>new T3Client(origin(),await ctx.secrets.get('t3Editor:'+origin()));
  const workspace=()=>vscode.workspace.workspaceFolders?.find(f=>f.uri.scheme==='file')?.uri.fsPath??'';
  const current=(folder=workspace())=>state.snapshot?matchingContext(state.snapshot,folder):{project:undefined,threads:[]};
  const refresh=async()=>{await state.refresh(async()=>{const t=performance.now(),s=await(await client()).snapshot();out.appendLine(`Snapshot ${Math.round(performance.now()-t)} ms; projects=${s.projects.length}, threads=${s.threads.length}`);return s;});changed.fire(undefined);};
  const pair=async(credential:string)=>{const token=await new T3Client(origin()).pair(credential.trim());await ctx.secrets.store('t3Editor:'+origin(),token);await refresh();};
  const commands=(id:string,fn:(arg?:unknown)=>unknown)=>ctx.subscriptions.push(vscode.commands.registerCommand(id,async(arg?:unknown)=>{try{return await fn(arg);}catch{void vscode.window.showInformationMessage('T3: context unavailable. Configure the environment and pair the bridge.');}}));
  const open=async(route:string)=>vscode.env.openExternal(vscode.Uri.parse(origin()+route));
  const pickThread=async(arg?:unknown)=>{if(arg&&typeof arg==='object'&&'id'in arg&&state.snapshot)return state.snapshot.threads.find(t=>t.id===(arg as {id:unknown}).id);
    const list=current().threads;if(!list.length)return;const pick=await vscode.window.showQuickPick(list.map(t=>({label:t.title,description:t.status,thread:t})),{title:'T3 thread for this checkout'});return pick?.thread;};
  const openThread=async(arg?:unknown)=>{const t=await pickThread(arg);if(t&&state.snapshot)return open('/'+encodeURIComponent(state.snapshot.environmentId)+'/'+encodeURIComponent(t.id));return vscode.window.showInformationMessage('T3: no linked thread for this checkout.');};
  const optional=async(id:string,payload?:unknown)=>{const ids=await vscode.commands.getCommands(true);if(ids.includes(id))return vscode.commands.executeCommand(id,payload);return vscode.window.showInformationMessage('T3: companion extension is unavailable.');};
  commands('t3.refresh',refresh);
  commands('t3.connect',async()=>{const credential=await vscode.window.showInputBox({title:'Pair T3 Editor Bridge',prompt:'Paste the pairing credential from your T3 environment. It is exchanged for read access and is not saved.',password:true,ignoreFocusOut:true});if(credential)await pair(credential);});
  commands('t3.disconnect',async()=>{await ctx.secrets.delete('t3Editor:'+origin());state.invalidate();state.error='Pair the editor bridge to reconnect.';changed.fire(undefined);});
  commands('t3.openCockpit',()=>open('/datapass'));
  commands('t3.openThread',openThread);
  commands('t3.openCurrentProject',async(arg?:unknown)=>{if(!state.snapshot)await refresh();const payload=arg&&typeof arg==='object'?arg as {repoPath?:unknown;worktreePath?:unknown}:{};
    const folder=typeof payload.worktreePath==='string'?payload.worktreePath:typeof payload.repoPath==='string'?payload.repoPath:workspace();const c=current(folder);
    if(!c.project)return vscode.window.showInformationMessage('T3: this checkout is not a connected project. Open Cockpit to register it.');return open('/datapass?'+new URLSearchParams({editorProject:c.project.id,editorEnvironment:state.snapshot!.environmentId}));});
  commands('t3.newThread',async()=>{const c=current();if(!c.project||!state.snapshot)return;return open('/datapass?'+new URLSearchParams({editorProject:c.project.id,editorEnvironment:state.snapshot.environmentId,editorAction:'new-thread',editorWorktree:workspace(),editorBranch:c.threads[0]?.branch??''}));});
  commands('t3.openWorktree',async(arg?:unknown)=>{const t=await pickThread(arg),folder=t?.worktreePath??current().project?.workspaceRoot;if(!folder||!(await stat(folder)).isDirectory())return;return vscode.commands.executeCommand('vscode.openFolder',vscode.Uri.file(folder),{forceNewWindow:true});});
  commands('t3.openReview',async(arg?:unknown)=>{const t=await pickThread(arg),review=t?.linkedPullRequest??t?.branchPullRequest;if(!review)return vscode.window.showInformationMessage('T3: no linked PR / MR.');const url=new URL(review.url);if(url.protocol!=='https:'||url.username||url.password)throw Error('Unsupported review URL');return vscode.env.openExternal(vscode.Uri.parse(url.href));});
  commands('t3.sendSelection',async()=>{const editor=vscode.window.activeTextEditor;if(!editor||editor.document.uri.scheme!=='file')return;
    const text=editor.document.getText(editor.selection.isEmpty?undefined:editor.selection);if(!text||text.length>16384)return vscode.window.showInformationMessage('T3: select at most 16 KiB of text.');
    const thread=await pickThread();if(!thread)return;await vscode.env.clipboard.writeText(`File: ${vscode.workspace.asRelativePath(editor.document.uri)}\n\n${text}`);await openThread(thread);void vscode.window.showInformationMessage('Selection copied. Paste into the T3 composer and submit explicitly.');});
  commands('t3.openGitIntelligence',async()=>{const c=current(),t=c.threads[0],folder=t?.worktreePath??c.project?.workspaceRoot;if(!folder)return optional('tern.openGitIntelligence');return optional('tern.revealWorktree',{repoPath:c.project?.workspaceRoot,worktreePath:folder});});
  commands('t3.openAgent',async(arg?:unknown)=>{const t=await pickThread(arg);if(!t)return optional('agent.openAnalyzer');const session=await(await client()).providerSession(t.id);if(!session)return vscode.window.showInformationMessage('T3: no observed Claude/Codex provider session ID.');return optional('agent.openSession',{...session,repoPath:current().project?.workspaceRoot,worktreePath:t.worktreePath});});
  const provider:vscode.TreeDataProvider<Row>={onDidChangeTreeData:changed.event,
    getTreeItem(row){if('section'in row)return new vscode.TreeItem(row.section,vscode.TreeItemCollapsibleState.Expanded);
      if('thread'in row){const item=new vscode.TreeItem(row.thread.title);item.description=`${row.thread.providerInstanceId??'UNKNOWN'} · ${row.thread.modelSelection?.model??'UNKNOWN'} · ${row.thread.status}`;item.tooltip=row.thread.worktreePath??'Project checkout';item.command={command:'t3.openThread',title:'Open thread',arguments:[row.thread]};return item;}
      const item=new vscode.TreeItem(row.label);item.tooltip=row.label;item.description=row.description;if(row.command)item.command={command:row.command,title:row.label,arguments:[row.argument]};return item;},
    getChildren(row){if(!row)return ['CURRENT PROJECT','ACTIVE THREADS','ATTENTION','REVIEW','ACTIONS'].map(section=>({section}));if(!('section'in row))return [];
      const snapshot=state.snapshot,c=current(),threads=c.threads;
      if(row.section==='ACTIONS')return [{label:'Open T3 Cockpit',command:'t3.openCockpit'},{label:'Open current project',command:'t3.openCurrentProject'},{label:'Open current thread',command:'t3.openThread'},
        {label:'Start new thread in T3',command:'t3.newThread'},{label:'Send file / selection (copy and paste)',command:'t3.sendSelection'},{label:'Open Git Intelligence',command:'t3.openGitIntelligence'},{label:'Open Agent observation',command:'t3.openAgent'},
        {label:'Pair editor bridge',command:'t3.connect'},{label:'Refresh',command:'t3.refresh'}];
      if(!snapshot)return [{label:state.busy?'Connecting to T3…':state.error,command:'t3.refresh'}];
      if(row.section==='CURRENT PROJECT')return [{label:`Environment: ${snapshot.label}`},...(c.project?[{label:c.project.title},{label:workspace()},{label:`Branch: ${threads[0]?.branch??'UNKNOWN'}`},{label:`Linked threads: ${threads.length}`}]:[{label:'This checkout is not registered in T3'}]),{label:`Observed: ${snapshot.observedAt}`}];
      if(row.section==='ACTIVE THREADS')return threads.length?threads.map(thread=>({thread})):[{label:'No linked threads for this checkout'}];
      if(row.section==='ATTENTION'){const attention=threads.filter(needsAttention);return attention.length?attention.map(t=>({label:`${t.title}: ${t.pendingRuntimeRequest?.kind??(t.hasActionableProposedPlan?'plan awaiting response':t.status)}`,command:'t3.openThread',argument:t})):[{label:'No pending input or reported failures'}];}
      return [...threads.filter(t=>t.linkedPullRequest||t.branchPullRequest).map(t=>({label:`PR / MR #${(t.linkedPullRequest??t.branchPullRequest)!.number} · ${t.branch??'UNKNOWN'}`,command:'t3.openReview',argument:t})),{label:'CI / checks: use T3 review; not exposed by shell snapshot',command:'t3.openCockpit'}];
    }};
  const view=vscode.window.createTreeView('t3.context',{treeDataProvider:provider});
  const timer=setInterval(()=>{if(view.visible&&!state.busy)void refresh();},10000);
  ctx.subscriptions.push(out,changed,view,{dispose:()=>{clearInterval(timer);state.invalidate();}},view.onDidChangeVisibility(e=>{if(e.visible)void refresh();}),vscode.workspace.onDidChangeWorkspaceFolders(()=>changed.fire(undefined)),vscode.workspace.onDidChangeConfiguration(e=>{if(e.affectsConfiguration('t3Editor')){state.invalidate();void refresh();}}));
  const activationMs=Math.round(performance.now()-start);out.appendLine(`Activated ${activationMs} ms; reads start when visible.`);
  return {state,refresh,pair,activationMs};
}
