'use strict';
const PartyLogic=(()=>{
 const examples=[
  {id:'pumpkin',name:'Pumpkin face',title:'A smile to welcome our friends.',story:'Pip has a pumpkin and a face stamp. His first machine follows picture cards. Let’s watch Pip’s mixed-up plan.',goal:'A smiling pumpkin on the display stand.',cards:[{id:'load',label:'Put pumpkin',icon:'load'},{id:'stamp',label:'Stamp face',icon:'stamp'},{id:'display',label:'Show pumpkin',icon:'display'}],bank:['stamp','display','load'],starter:['stamp','load','display'],suggested:['load','stamp','display'],cheer:'Yeah! You got it!',ask:'Point to the first card. What will the machine do? After it runs, which two cards could we swap?',next:'Our pumpkin can welcome the guests. Now Pip needs an invitation with a star inside.'},
  {id:'invitation',name:'Invitation',title:'A little invitation for Milo.',story:'Now Pip needs an invitation for Milo. Its star must be inside. The card starts open; only a folded card fits the post slot.',goal:'A folded invitation with a star inside, posted to Milo.',cards:[{id:'draw',label:'Stamp star',icon:'draw'},{id:'fold',label:'Fold card',icon:'fold-card'},{id:'post',label:'Post card',icon:'post-card'}],bank:['fold','post','draw'],starter:[],suggested:['draw','fold','post'],cheer:'Great job!',ask:'Pip follows the pictures from left to right. What happens if we fold before stamping?',next:'The invitation is for our friends. Let’s prepare a little bag of sweets for them.'},
  {id:'sweets',name:'Treat bag',title:'A sweet little surprise.',story:'Our guests need treats, too. Pip has a closed bag, sweets and a ribbon. Make a bag of sweets with a bow.',goal:'Sweets inside the bag, with a bow on top.',cards:[{id:'open',label:'Open bag',icon:'open-bag'},{id:'fill',label:'Add sweets',icon:'fill-bag'},{id:'tie',label:'Tie bow',icon:'tie-bag'}],bank:['tie','open','fill'],starter:[],suggested:['open','fill','tie'],cheer:'Congratulations!',ask:'Act out your first, next and last steps. Where will the sweets go if the bag is closed?',next:'The treats are for the table. Pip also needs a glowing lantern to light the party.'},
  {id:'lantern',name:'Lantern',title:'Let’s light up the party.',story:'Let’s light the party table. Pip has a light, a cover and an ON button. The cover blocks the loading slot. Make the lantern glow.',goal:'The light is on the base, glowing inside the lantern.',cards:[{id:'light',label:'Put light',icon:'load-light'},{id:'cover',label:'Add cover',icon:'cover-light'},{id:'on',label:'Light on',icon:'switch-on'}],bank:['cover','on','light'],starter:[],suggested:['light','cover','on'],cheer:'Yeah! You got it!',ask:'After one plan works, try swapping two cards. Can another sequence work too?',next:'Our lantern lights the party. One last machine will hang a balloon for the guests.'},
  {id:'balloon',name:'Balloon',title:'One last party surprise.',story:'One last decoration: a balloon on the party hook. It starts flat at the pump. Pip has a ribbon. Arrange the three pictures yourself.',goal:'A full balloon, tied and hanging on the party hook.',cards:[{id:'inflate',label:'Pump air',icon:'inflate'},{id:'knot',label:'Tie balloon',icon:'knot'},{id:'hang',label:'Hang balloon',icon:'hang'}],bank:['hang','knot','inflate'],starter:[],suggested:['inflate','knot','hang'],cheer:'Congratulations!',ask:'You are the programmers now. Point to each picture and tell Pip what comes first, next and last.',next:'You have tested five sequences. Now make a paper sequence for a partner.'}
 ];
 function example(id){const e=examples.find(e=>e.id===id);if(!e)throw new Error('Unknown machine');return e}
 function initial(id){example(id);return {pumpkin:{loaded:false,face:false,tableFace:false,shown:false},invitation:{where:'bench',folded:false,inside:false,outside:false,posted:false},sweets:{open:false,filled:false,bow:false,spilled:false},lantern:{light:false,cover:false,on:false,outside:false},balloon:{where:'bench',full:false,tied:false,escaped:false}}[id]}
 function inspect(id,s){return {
  pumpkin:[{label:'On the stand',met:s.shown},{label:'Smiling face',met:s.face}],
  invitation:[{label:'Star INSIDE',met:s.inside},{label:'Posted',met:s.posted}],
  sweets:[{label:'Sweets inside',met:s.filled},{label:'Bow on top',met:s.bow&&!s.open}],
  lantern:[{label:'Light inside',met:s.light&&s.cover},{label:'Glowing',met:s.on}],
  balloon:[{label:'Full of air',met:s.full},{label:'Tied',met:s.tied},{label:'On the hook',met:s.where==='hook'}]
 }[id]}
 function outcomeReason(id,s){
  if(id==='pumpkin')return !s.shown?(s.face?'A smiling pumpkin is still on the work table. The stand is empty.':'The pumpkin is still on the work table. The stand is empty.'):'The pumpkin on the stand has no face.';
  if(id==='invitation')return s.posted?'The card was posted, but it is blank INSIDE. The star is on the outside.':s.folded?'The card is still outside the post slot.':'The open card could not fit through the post slot.';
  if(id==='sweets')return !s.filled?'The bag is empty. The sweets are on the table.':'The sweets are inside, but the bag is open with no bow.';
  if(id==='lantern')return !s.light?'The cover blocked the light. It is outside and cannot glow.':'The light is inside, but it is still OFF.';
  return s.escaped?'The balloon slipped away. The hook is empty.':!s.full?'The tied balloon is still flat. No air could go in.':'The balloon is not on the hook.';
 }
 function execute(id,program){
  const e=example(id),allowed=e.cards.map(c=>c.id);let s=initial(id);const steps=[];let firstProblem=null;
  if(!Array.isArray(program)||program.length!==3||new Set(program).size!==3||program.some(a=>!allowed.includes(a)))return {valid:false,success:false,steps,state:s,reason:'Choose each of the three pictures once.'};
  for(const [index,action] of program.entries()){
   const before={...s};let note='',problem='';
   if(id==='pumpkin'){
    if(action==='load'){s.loaded=true;note='The pumpkin is on the stamping table.'}
    if(action==='stamp'){if(s.loaded&&!s.shown){s.face=true;note='The stamp makes a face on the pumpkin.'}else{s.tableFace=true;problem='The stamp made a face on the empty table.';note=problem}}
    if(action==='display'){if(s.loaded){s.shown=true;s.loaded=false;note=s.face?'The smiling pumpkin moves to the stand.':'A blank pumpkin moves to the stand.'}else{problem='There was no pumpkin to move to the stand.';note=problem}}
   }
   if(id==='invitation'){
    if(action==='draw'){if(s.where==='bench'){if(s.folded){s.outside=true;problem='The card was closed. The star went on the outside.';note=problem}else{s.inside=true;note='The star goes inside the open card.'}}else{problem='The card was already away from the stamping table.';note=problem}}
    if(action==='fold'){if(s.where==='bench'){s.folded=true;note='The card closes, keeping its inside picture inside.'}else{problem='There is no card on the folding table.';note=problem}}
    if(action==='post'){s.where='mailbox';if(s.folded){s.posted=true;note='The folded card fits through the post slot.'}else{problem='The open card is too wide for the post slot.';note=problem}}
   }
   if(id==='sweets'){
    if(action==='open'){s.open=true;s.bow=false;if(before.bow)problem='Opening the bag untied the bow. There is no bow now.';note=problem||'The bag opens.'}
    if(action==='fill'){if(s.open){s.filled=true;note='The sweets fall inside the open bag.'}else{s.spilled=true;problem='The bag was closed. The sweets fell on the table.';note=problem}}
    if(action==='tie'){s.open=false;s.bow=true;note=s.filled?'A bow closes the bag of sweets.':'A bow closes an empty bag.'}
   }
   if(id==='lantern'){
    if(action==='light'){if(!s.cover){s.light=true;note='The light goes on the base.'}else{s.outside=true;problem='The cover blocked the slot. The light stayed outside.';note=problem}}
    if(action==='cover'){s.cover=true;note='The lantern cover goes over the base.'}
    if(action==='on'){if(s.light){s.on=true;note='The light on the base switches on.'}else{problem='The button was pressed before a light was on the base.';note=problem}}
   }
   if(id==='balloon'){
    if(action==='inflate'){if(s.where==='bench'&&!s.tied){s.full=true;note='The pump fills the balloon with air.'}else{problem=s.tied?'The balloon was already tied. Air could not go in.':'The balloon is no longer at the pump.';note=problem}}
    if(action==='knot'){if(s.where==='bench'){s.tied=true;note=s.full?'The ribbon keeps the air in.':'The ribbon ties a flat balloon.'}else{problem='The balloon is no longer on the tying table.';note=problem}}
    if(action==='hang'){if(!s.tied){s.escaped=true;s.where='away';problem='The untied balloon slipped away from the hook.';note=problem}else{s.where='hook';note=s.full?'The full balloon hangs on the hook.':'A flat balloon hangs on the hook.'}}
   }
   if(problem&&!firstProblem)firstProblem={index,reason:problem};
   steps.push({index,action,before,after:{...s},note,problem:!!problem});
  }
  const checks=inspect(id,s),success=checks.every(c=>c.met);
  return {valid:true,success,steps,state:s,checks,firstProblem,reason:success?'The machine followed your order and made the goal.':outcomeReason(id,s)};
 }
 return {examples,example,initial,inspect,execute};
})();
if(typeof module!=='undefined')module.exports=PartyLogic;
