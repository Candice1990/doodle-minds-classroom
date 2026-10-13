'use strict';
const assert=require('node:assert/strict'),L=require('./logic');
const perm=a=>a.length?a.flatMap((x,i)=>perm(a.filter((_,j)=>i!==j)).map(p=>[x,...p])):[[]];
for(const e of L.examples){const short=L.execute(e.id,e.starter);assert.equal(short.success,false,e.id+' missing program fails');assert.equal(short.steps.filter(s=>s.missing).length,1);const empty=short.steps.find(s=>s.missing);assert.deepEqual(empty.before,empty.after,'An empty space must do nothing');assert.ok(short.checks.some(c=>!c.met));
 for(const c of e.cards){const p=e.starter.map(x=>x===null?c.id:x),r=L.execute(e.id,p);assert.equal(r.success,c.id===e.solution[e.starter.indexOf(null)],e.id+' candidate '+c.id);assert.equal(r.steps.length,3);assert.deepEqual(L.execute(e.id,p),r);assert.equal(r.success,r.checks.every(c=>c.met));}
 for(const p of perm(e.solution)){const r=L.execute(e.id,p);assert.deepEqual(r.steps[0].before,L.initial(e.id));for(let i=1;i<3;i++)assert.deepEqual(r.steps[i].before,r.steps[i-1].after);assert.deepEqual(r.state,r.steps[2].after);}
 for(let i=0;i<3;i++){const p=[...e.solution];p[i]=null;assert.equal(L.execute(e.id,p).success,false,e.id+' each necessary instruction');}
 assert.equal(L.execute(e.id,['unknown',null,null]).valid,false);
}
assert.equal(L.execute('lantern',['light','on','cover']).success,true);
console.log('Five missing programs, 15 candidate repairs, 30 full-order traces, every omitted instruction and replay passed.');
