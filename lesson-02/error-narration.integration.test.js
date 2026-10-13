'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const path=require('node:path');
const project=path.resolve(__dirname,'..');
function programs(options,length){return length?programs(options,length-1).flatMap(a=>options.map(x=>[...a,x])):[[]]}
async function playback(root,narration,key){
 const a={src:'',currentTime:0,paused:true,onended:null,onerror:null,play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true}};
 const timers=new Map();let n=0;const context={document:{getElementById:()=>a},window:{},ErrorVoiceAssets:{[key]:{src:'assets/errors/'+key+'.mp3',durationMs:7200}},setTimeout(fn,ms){timers.set(++n,{fn,ms});return n},clearTimeout(id){timers.delete(id)}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'sound.js'),'utf8')+';globalThis.sound=PartySound;',context);const sound=context.sound,clip={key,text:narration.clips[key]};
 let settled=false;const p=sound.explanation(clip).then(()=>settled=true);await Promise.resolve();assert.equal(settled,false);assert.equal(a.paused,false);assert.equal([...timers.values()][0].ms,9200);a.onended();await p;assert.equal(timers.size,0);
 for(const finish of [()=>sound.stop(),()=>sound.set(false),()=>a.onerror(),()=>[...timers.values()][0].fn()]){sound.set(true);const pending=sound.explanation(clip);finish();await pending;assert.equal(a.paused,true);assert.equal(a.onended,null);assert.equal(timers.size,0)}
 const fallback=sound.explanation({key:'unavailable'},true);assert.match(a.src,/oops-natural/);a.onended();await fallback;
 const success=sound.feedback('success',1);assert.match(a.src,/great-job-natural/);a.onended();await success;
}
async function main(){
 const repair=require(path.join(project,'lesson-02/logic.js')),rn=require(path.join(project,'lesson-02/error-narration.js'));let repairs=0;const used=new Set();
 for(const e of repair.examples)for(const p of programs([null,...e.cards.map(c=>c.id)],3)){
  const r=repair.execute(e.id,p);assert.equal(r.valid,true);
  for(const s of r.steps){const c=rn.step(e.id,s);assert.equal(!!c,!!(s.problem||s.missing));if(c){assert.ok(c.text);assert.ok(rn.clips[c.key]);used.add(c.key)}if(s.missing)assert.equal(c.key,'missing-instruction')}
  const c=rn.result(e.id,r);assert.equal(!!c,!r.success);if(c){assert.ok(c.text);used.add(c.key)}repairs++;
 }
 assert.equal(used.size,Object.keys(rn.clips).length,'All repair reasons reachable and covered');
 const tied=repair.execute('balloon',['knot','inflate','hang']);assert.equal(rn.step('balloon',tied.steps[1]).key,'balloon-pump-tied');
 const away=repair.execute('balloon',['hang','inflate','knot']);assert.equal(rn.step('balloon',away.steps[1]).key,'balloon-pump-away');
 const noCover=repair.execute('lantern',['light','on','on']);assert.equal(rn.result('lantern',noCover).key,'result-lantern-cover');
 const whole=repair.execute('apple',['wash','wash','wash']);assert.equal(rn.result('apple',whole).key,'result-apple-uncut');
 const route=require(path.join(project,'lesson-03/route-logic.js')),dn=require(path.join(project,'lesson-03/error-narration.js'));let routes=0;
 for(const e of route.examples)for(let n=0;n<=e.limit;n++)for(const p of programs(Object.keys(route.arrows),n)){
  const r=route.execute(e.id,p);
  for(const s of r.steps){const c=dn.step(e.id,s);assert.equal(!!c,s.problem);if(c){assert.ok(dn.clips[c.key]);assert.ok(c.key.endsWith(s.action));const a=route.arrows[s.action],next=[s.before[0]+a.dx,s.before[1]+a.dy];if(c.key.startsWith('edge'))assert.ok(next.some(x=>x<0||x>=e.size));else assert.ok(e.blocked.some(b=>b[0]===next[0]&&b[1]===next[1]))}}
  const c=dn.result(e.id,r);assert.equal(!!c,!r.success);if(c){assert.ok(dn.clips[c.key]);if(c.key==='result-left')assert.ok(r.pos[0]<e.target[0]);if(c.key==='result-right')assert.ok(r.pos[0]>e.target[0]);if(c.key==='result-above')assert.ok(r.pos[1]<e.target[1]);if(c.key==='result-below')assert.ok(r.pos[1]>e.target[1]);}routes++;
 }
 assert.equal(dn.result('pumpkin',{valid:true,success:false,pos:[1,1],visited:[[0,1],[2,1],[1,1]]}).key,'result-away');
 await playback(path.join(project,'lesson-02'),rn,'missing-instruction');await playback(path.join(project,'lesson-03'),dn,'edge-left');
 console.log(`${repairs} repair programs and ${routes} arrow programs: specific step/final explanations covered; completion, Stop, mute, media errors, timeout, fallback and success playback passed.`);
}
main().catch(e=>{console.error(e);process.exitCode=1});
