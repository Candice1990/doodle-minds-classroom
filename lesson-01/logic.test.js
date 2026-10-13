'use strict';
const assert=require('node:assert/strict');
const L=require('./logic.js');
function permutations(a){return a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[x,...p])):[[]]}
for(const e of L.examples){
 const expected=e.id==='lantern'?['light,cover,on','light,on,cover']:[e.suggested.join(',')];
 const successes=[];
 for(const p of permutations(e.suggested)){
  const r=L.execute(e.id,p);assert.equal(r.valid,true);assert.equal(r.steps.length,3);assert.deepEqual(r.steps.map(s=>s.action),p);assert.deepEqual(r.steps[0].before,L.initial(e.id));for(let i=1;i<3;i++)assert.deepEqual(r.steps[i].before,r.steps[i-1].after);assert.deepEqual(r.state,r.steps[2].after);if(r.success)successes.push(p.join(','));else {assert.ok(r.reason.length>0);assert.ok(r.checks.some(c=>!c.met));assert.ok(r.firstProblem,'Every failing plan should identify a concrete failed step');}assert.equal(r.success,r.checks.every(c=>c.met));
  assert.deepEqual(L.execute(e.id,p),r,'Replay must start clean');assert.deepEqual(p,r.steps.map(s=>s.action),'Input program must not change');
 }
 assert.deepEqual(successes.sort(),expected.sort(),e.id+' valid orders');
 for(const p of [[],e.suggested.slice(0,2),[e.suggested[0],e.suggested[0],e.suggested[2]],['missing',...e.suggested.slice(1)]]){const r=L.execute(e.id,p);assert.equal(r.valid,false);assert.equal(r.steps.length,0)}
}
const badPumpkin=L.execute('pumpkin',['stamp','load','display']);assert.equal(badPumpkin.state.tableFace,true);assert.equal(badPumpkin.state.face,false);assert.equal(badPumpkin.state.shown,true);assert.equal(badPumpkin.firstProblem.index,0);
const badBag=L.execute('sweets',['open','tie','fill']);assert.equal(badBag.state.spilled,true);assert.equal(badBag.state.filled,false);
const badInvitation=L.execute('invitation',['fold','draw','post']);assert.equal(badInvitation.state.outside,true);assert.equal(badInvitation.state.inside,false);assert.equal(badInvitation.state.posted,true);
const badLantern=L.execute('lantern',['cover','light','on']);assert.equal(badLantern.state.outside,true);assert.equal(badLantern.state.on,false);
const badBalloon=L.execute('balloon',['inflate','hang','knot']);assert.equal(badBalloon.state.escaped,true);assert.equal(badBalloon.state.tied,false);
console.log('30 complete programs, exact valid-order sets, step traces, replay, invalid input and five visible failure causes passed.');

const displayFirst=L.execute('pumpkin',['display','stamp','load']);assert.equal(displayFirst.success,false);assert.equal(displayFirst.state.face,false);assert.equal(displayFirst.state.shown,false);assert.match(displayFirst.reason,/stand is empty/);
const smilingWorktop=L.execute('pumpkin',['display','load','stamp']);assert.equal(smilingWorktop.state.face,true);assert.equal(smilingWorktop.success,false);assert.equal(smilingWorktop.checks.find(c=>c.label==='On the stand').met,false);
const lostBow=L.execute('sweets',['tie','open','fill']);assert.equal(lostBow.state.filled,true);assert.equal(lostBow.state.bow,false);assert.equal(lostBow.firstProblem.index,1);
// Actual-result drawings must reflect executed state rather than reuse the goal drawing.
const vm=require('node:vm'),fs=require('node:fs');const context=vm.createContext({PartyLogic:L,PartyArt:{decor:()=>'',pip:()=>'',reaction:()=>'',candy:()=>'<circle class="candy" r="20"/>'}});vm.runInContext(fs.readFileSync(__dirname+'/sequence-art.js','utf8')+';globalThis.art=SequenceArt;',context);
for(const e of L.examples)for(const p of permutations(e.suggested)){
 const r=L.execute(e.id,p),picture=context.art.outcome(e.id,r.state),scene=context.art.machine(e.id,r.state,{phase:r.success?'done':'thinking',result:r});
 assert.equal(scene.includes('class="error-target"'),!r.success,e.id+' error target');
 if(e.id==='pumpkin'){assert.equal(picture.includes('class="pumpkin-face"'),r.state.face);assert.equal(scene.includes('class="pumpkin-face"'),r.state.face);}
 if(e.id==='invitation')assert.equal(picture.includes('class="draw-star"'),r.state.inside,'Inspect the real inside, not the outside star');
 if(e.id==='sweets')assert.equal(picture.includes('class="bag-sweets"'),r.state.filled);
}
console.log('Failure-step detection, final goal checks and actual-result drawings passed for all 30 orders.');
