'use strict';
const assert=require('node:assert/strict'),L=require('./route-logic');
function all(n){return n?all(n-1).flatMap(p=>Object.keys(L.arrows).map(a=>[...p,a])):[[]]}
let tested=0;
for(const e of L.examples){let success=0;for(let n=0;n<=e.limit;n++)for(const p of all(n)){const r=L.execute(e.id,p);tested++;assert.equal(r.valid,true);assert.deepEqual(r.visited[0],e.start);assert.equal(r.visited.length,p.length+1);assert.equal(r.steps.length,p.length);let oracle=[...e.start];for(let i=0;i<p.length;i++){const a=L.arrows[p[i]],next=[oracle[0]+a.dx,oracle[1]+a.dy],blocked=next.some(x=>x<0||x>=3)||e.blocked.some(x=>x[0]===next[0]&&x[1]===next[1]);assert.deepEqual(r.steps[i].before,oracle);assert.equal(r.steps[i].problem,blocked);if(!blocked)oracle=next;assert.deepEqual(r.steps[i].after,oracle);}assert.deepEqual(r.pos,oracle);assert.equal(r.success,oracle[0]===e.target[0]&&oracle[1]===e.target[1]);if(r.success)success++;assert.deepEqual(L.execute(e.id,p),r,'Replay starts at START');}assert.ok(success);assert.equal(L.execute(e.id,e.solution).success,true);assert.equal(L.execute(e.id,['turn']).valid,false);assert.equal(L.execute(e.id,Array(e.limit+1).fill('right')).valid,false);}
assert.equal(L.execute('ghost',['right','up','up']).success,true);
assert.equal(L.execute('ghost',['up','right','up']).success,true);
assert.equal(L.execute('cat',['down','left','left']).success,true);
const hedge=L.execute('house',['right','up','up','right']);assert.equal(hedge.steps[1].problem,true);assert.deepEqual(hedge.steps[1].before,hedge.steps[1].after);assert.equal(hedge.steps.length,4);assert.equal(hedge.success,false);
assert.equal(L.execute('pumpkin',['left','right']).success,false);
console.log(`${tested} arrow programs checked: one-square steps, map edges, hedges, all valid alternatives, frozen traces and clean replay.`);
