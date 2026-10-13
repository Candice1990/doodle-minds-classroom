'use strict';
const ErrorNarration=(()=>{
 const clips={
  'edge-right':'Right points off the map. Pip stays on this square.',
  'edge-up':'Up points off the map. Pip stays on this square.',
  'edge-left':'Left points off the map. Pip stays on this square.',
  'edge-down':'Down points off the map. Pip stays on this square.',
  'hedge-right':'A hedge blocks the square to the right. Pip stays here.',
  'hedge-up':'A hedge blocks the square above. Pip stays here.',
  'hedge-left':'A hedge blocks the square to the left. Pip stays here.',
  'hedge-down':'A hedge blocks the square below. Pip stays here.',
  'result-left':'Pip stopped to the left of the goal. Check our directions.',
  'result-right':'Pip stopped to the right of the goal. Check our directions.',
  'result-above':'Pip stopped above the goal. Check our directions.',
  'result-below':'Pip stopped below the goal. Check our directions.',
  'result-away':'Pip reached the goal, then moved away. Check the last directions.'
 };
 function clip(key){return key?{key,text:clips[key]}:null}
 function step(id,s){if(!s.problem)return null;return clip((s.note.includes('off the map')?'edge-':'hedge-')+s.action)}
 function result(id,r){
  if(!r.valid||r.success)return null;
  const goal=(typeof module!=='undefined'?require('./route-logic.js'):RouteLogic).example(id).target;
  if(r.visited.slice(0,-1).some(p=>p[0]===goal[0]&&p[1]===goal[1]))return clip('result-away');
  const dx=r.pos[0]-goal[0],dy=r.pos[1]-goal[1];
  return clip(dx<0?'result-left':dx>0?'result-right':dy<0?'result-above':'result-below');
 }
 return {clips,step,result};
})();
if(typeof module!=='undefined')module.exports=ErrorNarration;
