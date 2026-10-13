'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const logic=require('./logic.js'),narration=require('./error-narration.js');
function permutations(a){return a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[x,...p])):[[]]}
const used=new Set();let count=0;
for(const e of logic.examples)for(const program of permutations(e.cards.map(c=>c.id))){
 const result=logic.execute(e.id,program);
 for(const step of result.steps){const clip=narration.step(e.id,step);assert.equal(!!clip,step.problem);if(clip){assert.ok(clip.text);used.add(clip.key)}}
 const clip=narration.result(e.id,result);assert.equal(!!clip,!result.success);if(clip)used.add(clip.key);count++;
}
assert.equal(used.size,Object.keys(narration.clips).length);
const early=logic.execute('pumpkin',['stamp','load','display']),late=logic.execute('pumpkin',['load','display','stamp']);
assert.equal(narration.step('pumpkin',early.steps[0]).key,'pumpkin-stamp-empty');
assert.equal(narration.step('pumpkin',late.steps[2]).key,'pumpkin-stamp-away');
assert.match(narration.result('pumpkin',early).text,/no smiling face/);
assert.equal(narration.result('lantern',logic.execute('lantern',['light','on','cover'])),null);
async function audioChecks(){
 const audio={src:'',currentTime:0,paused:true,onended:null,onerror:null,play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true}};
 let nextTimer=0;const timers=new Map();
 const context={document:{getElementById:()=>audio},window:{},ErrorVoiceAssets:{'pumpkin-stamp-empty':{src:'assets/errors/pumpkin-stamp-empty.mp3',durationMs:4100}},setTimeout(fn,ms){const id=++nextTimer;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/sound.js','utf8')+'\nglobalThis.sound=PartySound;',context);
 const sound=context.sound,clip=narration.step('pumpkin',early.steps[0]);
 let settled=false;const playing=sound.explanation(clip).then(()=>settled=true);
 await Promise.resolve();assert.equal(settled,false);assert.equal(audio.src,'assets/errors/pumpkin-stamp-empty.mp3');assert.equal([...timers.values()][0].ms,6100);
 audio.onended();await playing;assert.equal(settled,true);assert.equal(timers.size,0);
 const stopped=sound.explanation(clip);sound.stop();await stopped;assert.equal(audio.paused,true);assert.equal(audio.onended,null);assert.equal(timers.size,0);
 const muted=sound.explanation(clip);sound.set(false);await muted;assert.equal(audio.paused,true);assert.equal(timers.size,0);sound.set(true);
 const failed=sound.explanation(clip);audio.onerror();await failed;assert.equal(timers.size,0);
 const timeout=sound.explanation(clip);[...timers.values()][0].fn();await timeout;assert.equal(timers.size,0);
 const fallback=sound.explanation(narration.result('pumpkin',early),true);assert.match(audio.src,/oops-natural/);audio.onended();await fallback;
}
audioChecks().then(()=>console.log(`${count} orders: all ${used.size} narration causes covered; finished playback, Stop, mute, media error, timeout and missing-clip fallback passed.`)).catch(e=>{console.error(e);process.exitCode=1});
