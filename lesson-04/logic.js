'use strict';
const DebugLogic=(()=>{
 const choices={lights:['on','off'],path:['gold','purple','sage'],dance:['clap','wave','stamp']};
 const samples={lights:{goal:['on','off','on','off'],program:['on','off','off','off']},path:{goal:['gold','purple','sage','gold'],program:['gold','sage','purple','gold']},dance:{goal:['clap','wave','stamp','wave'],program:['clap','wave','wave','wave']}};
 function valid(p){return !!p&&Object.hasOwn(choices,p.kind)&&['goal','program'].every(k=>Array.isArray(p[k])&&p[k].length===4&&p[k].every(a=>choices[p.kind].includes(a)))}
 function snapshot(p){if(!valid(p))throw Error('Choose four complete instructions');return Object.freeze({kind:p.kind,goal:Object.freeze([...p.goal]),program:Object.freeze([...p.program])})}
 function compare(goal,trace){return {match:goal.length===trace.length&&goal.every((a,i)=>a===trace[i]),differences:goal.map((a,i)=>a===trace[i]?null:i).filter(i=>i!==null)}}
 function signature(p){return JSON.stringify([p.kind,p.goal,p.program])}
 function fresh(kind){return {kind,goal:[...samples[kind].goal],program:[...samples[kind].program]}}
 function savedValid(p){return valid(p)&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=40&&compare(p.goal,p.program).match}
 return {choices,samples,valid,snapshot,compare,signature,fresh,savedValid};
})();
if(typeof module!=='undefined')module.exports=DebugLogic;
