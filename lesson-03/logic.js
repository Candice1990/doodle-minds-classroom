'use strict';
const LoopLogic=(()=>{
 const choices={lights:['on','off'],path:['gold','purple','sage'],dance:['clap','wave','stamp']};
 const labels={on:'Light on',off:'Light off',gold:'Gold dot',purple:'Purple stripe',sage:'Green leaf',clap:'Clap',wave:'Wave',stamp:'Stamp'};
 function valid(p){return !!p&&Object.hasOwn(choices,p.kind)&&Number.isInteger(p.count)&&p.count>=1&&p.count<=4&&Array.isArray(p.body)&&p.body.length>=1&&p.body.length<=3&&p.body.every(a=>choices[p.kind].includes(a))&&(p.kind!=='lights'||p.body.join(',')==='on,off')}
 function expand(p){if(!valid(p))throw Error('Choose a complete repeat program');return Object.freeze(Array.from({length:p.count},(_,i)=>p.body.map((action,j)=>Object.freeze({round:i+1,step:j+1,action}))).flat())}
 function signature(p){return JSON.stringify([p.kind,p.body,p.count])}
 function savedValid(p){return valid(p)&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=40}
 return {choices,labels,valid,expand,signature,savedValid};
})();
if(typeof module!=='undefined')module.exports=LoopLogic;
