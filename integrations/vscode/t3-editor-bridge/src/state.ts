import type {Snapshot} from './client';
/** Epoch guards prevent a restarted/reconfigured environment repainting newer context. */
export class BridgeState {
  snapshot?:Snapshot;error='Set t3Editor.serverUrl, then pair the editor bridge.';busy=false;
  private epoch=0;
  invalidate(){this.epoch++;this.snapshot=undefined;this.busy=false;}
  async refresh(read:()=>Promise<Snapshot>){const epoch=++this.epoch;this.busy=true;
    try {const next=await read();if(epoch===this.epoch){this.snapshot=next;this.error='';}}
    catch {if(epoch===this.epoch){this.snapshot=undefined;this.error='T3 unavailable or credential expired. Refresh or pair the bridge.';}}
    finally{if(epoch===this.epoch)this.busy=false;}}
}
