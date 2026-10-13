'use strict';
const RepairLogic=(()=>{
 const examples=[
 {id:'hat',name:'Party hat',title:'A party hat for Pip.',goal:'Pip wears his party hat and waves hello.',context:'Pip wants to greet his guests in a party hat.',start:'His hat starts on the table.',rules:['Pick up takes the hat into his hand.','Put on moves a held hat onto his head. A wave does not move the hat.'],question:'Which instruction could help Pip wear the hat?',cards:[{id:'pick',label:'Pick up hat',icon:'pick-hat'},{id:'wear',label:'Put on hat',icon:'wear-hat'},{id:'wave',label:'Wave hello',icon:'wave'}],starter:['pick',null,'wave'],solution:['pick','wear','wave'],cheer:'Yeah! You got it!',hint:'Watch his hand and his head. What did our program leave out?'},
 {id:'apple',name:'Apple treats',title:'Clean treats for our friends.',goal:'Clean apple pieces in the serving bowl.',context:'Pip is making apple treats for the party.',start:'A muddy apple waits beside an empty bowl.',rules:['Wash cleans a whole apple at the washing station.','Cut makes pieces. Put in bowl moves those pieces to the bowl. Neither one washes them.'],question:'Which instruction could make the apple clean?',cards:[{id:'wash',label:'Wash apple',icon:'wash'},{id:'cut',label:'Cut apple',icon:'cut'},{id:'bowl',label:'Put in bowl',icon:'bowl'}],starter:[null,'cut','bowl'],solution:['wash','cut','bowl'],cheer:'Great job!',hint:'Look at the mud. Can cutting or moving remove it?'},
 {id:'cake',name:'Cupcake',title:'A cupcake needs its party topping.',goal:'A cupcake with icing on the serving stand.',context:'Pip wants a pretty cupcake for his guests.',start:'A plain cupcake waits beside the icing station.',rules:['Put cupcake moves it onto the work table.','Add icing works on the table. Serve moves the cupcake away to the stand.'],question:'Which instruction could add the missing topping?',cards:[{id:'load',label:'Put cupcake',icon:'cake-load'},{id:'ice',label:'Add icing',icon:'ice'},{id:'serve',label:'Serve cupcake',icon:'cake-serve'}],starter:['load',null,'serve'],solution:['load','ice','serve'],cheer:'Congratulations!',hint:'Compare the cupcake with our goal. What is missing?'},
 {id:'lantern',name:'Lantern',title:'A little glow for the party.',goal:'The light glows inside the lantern.',context:'The party table needs a glowing lantern.',start:'The light starts OFF, beside the empty base.',rules:['Put light places the light on the base. The cover blocks the loading slot.','Light on switches on a light already on the base. Adding the cover does not turn it on.'],question:'Which instruction could make the lantern glow?',cards:[{id:'light',label:'Put light',icon:'load-light'},{id:'cover',label:'Add cover',icon:'cover-light'},{id:'on',label:'Light on',icon:'switch-on'}],starter:['light','cover',null],solution:['light','cover','on'],cheer:'Yeah! You got it!',hint:'The light is inside. Why is the lantern still dark?'},
 {id:'balloon',name:'Balloon',title:'A balloon that stays with us.',goal:'A full, tied balloon on the party hook.',context:'One last decoration needs a little repair.',start:'A flat balloon waits at the pump.',rules:['Pump air fills an untied balloon. A ribbon keeps it secure.','An untied balloon slips away from the hook.'],question:'Which instruction could keep the balloon on the hook?',cards:[{id:'inflate',label:'Pump air',icon:'inflate'},{id:'knot',label:'Tie balloon',icon:'knot'},{id:'hang',label:'Hang balloon',icon:'hang'}],starter:['inflate',null,'hang'],solution:['inflate','knot','hang'],cheer:'Congratulations!',hint:'Look at the empty hook. What could stop the balloon slipping away?'}
 ];
 function example(id){const e=examples.find(e=>e.id===id);if(!e)throw Error('Unknown repair');return e}
 function initial(id){example(id);return {hat:{where:'table',wave:false},apple:{clean:false,cut:false,bowl:false},cake:{where:'source',iced:false},lantern:{light:false,cover:false,on:false,outside:false},balloon:{where:'bench',full:false,tied:false,escaped:false}}[id]}
 function inspect(id,s){return {hat:[{label:'Hat on head',met:s.where==='head'},{label:'Hello wave',met:s.wave}],apple:[{label:'Clean',met:s.clean},{label:'Pieces in bowl',met:s.cut&&s.bowl}],cake:[{label:'Icing on top',met:s.iced},{label:'On the stand',met:s.where==='stand'}],lantern:[{label:'Light inside',met:s.light&&s.cover},{label:'Glowing',met:s.on}],balloon:[{label:'Full of air',met:s.full},{label:'Tied on hook',met:s.tied&&s.where==='hook'}]}[id]}
 function execute(id,program){const e=example(id);let s=initial(id),steps=[];
 if(!Array.isArray(program)||program.length!==3||program.some(x=>x!==null&&!e.cards.some(c=>c.id===x)))return {valid:false,success:false,steps,state:s,reason:'Use these picture cards in the three spaces.'};
 for(const [index,action] of program.entries()){const before={...s};let note='',problem=false;
 if(action===null){note='No instruction here. The machine does nothing.';steps.push({index,action,before,after:{...s},note,problem:false,missing:true});continue}
 if(id==='hat'){
 if(action==='pick'){if(s.where==='table'){s.where='hand';note='Pip picks up the hat.'}else{problem=true;note='No hat is left on the table.'}}
 if(action==='wear'){if(s.where==='hand'){s.where='head';note='The hat goes onto Pip’s head.'}else{problem=true;note='Pip has no hat in his hand to put on.'}}
 if(action==='wave'){s.wave=true;note='Pip waves. The hat stays where it is.'}}
 if(id==='apple'){
 if(action==='wash'){if(!s.cut&&!s.bowl){s.clean=true;note='The water washes off the mud.'}else{problem=true;note='The whole-apple washer cannot wash these pieces.'}}
 if(action==='cut'){if(!s.bowl){s.cut=true;note=s.clean?'Clean apple pieces are ready.':'Cutting makes pieces, but the mud stays.'}else{problem=true;note='The apple is away from the cutting table.'}}
 if(action==='bowl'){if(s.cut){s.bowl=true;note=s.clean?'Clean pieces go into the bowl.':'Dirty pieces go into the bowl.'}else{problem=true;note='There are no cut pieces to put in the bowl.'}}}
 if(id==='cake'){
 if(action==='load'){if(s.where==='source'){s.where='table';note='The plain cupcake moves to the work table.'}else{problem=true;note='No cupcake is left at the starting tray.'}}
 if(action==='ice'){if(s.where==='table'){s.iced=true;note='Icing lands on the cupcake.'}else{problem=true;note='There is no cupcake under the icing nozzle.'}}
 if(action==='serve'){if(s.where==='table'){s.where='stand';note=s.iced?'The iced cupcake goes to the stand.':'The plain cupcake goes to the stand.'}else{problem=true;note='There is no cupcake on the work table to serve.'}}}
 if(id==='lantern'){
 if(action==='light'){if(!s.cover){s.light=true;note='The light goes onto the base.'}else{s.outside=true;problem=true;note='The cover blocks the loading slot.'}}
 if(action==='cover'){s.cover=true;note='The cover goes over the base. It does not turn the light on.'}
 if(action==='on'){if(s.light){s.on=true;note='The light switches on!'}else{problem=true;note='No light is on the base to switch on.'}}}
 if(id==='balloon'){
 if(action==='inflate'){if(s.where==='bench'&&!s.tied){s.full=true;note='The pump fills the balloon.'}else{problem=true;note='The pump cannot fill this balloon now.'}}
 if(action==='knot'){if(s.where==='bench'){s.tied=true;note=s.full?'The ribbon secures the full balloon.':'The ribbon ties a flat balloon.'}else{problem=true;note='The balloon has already slipped away.'}}
 if(action==='hang'){if(s.tied){s.where='hook';note=s.full?'The full balloon stays on the hook.':'A flat balloon hangs on the hook.'}else{s.where='away';s.escaped=true;problem=true;note='The untied balloon slips away. The hook is empty.'}}}
 steps.push({index,action,before,after:{...s},note,problem});}
 const checks=inspect(id,s),success=checks.every(c=>c.met);
 const reason={hat:s.where==='head'?'Pip has not waved hello.':s.wave?'Pip waved, but his head still has no hat.':'Pip still has no hat on his head.',apple:s.clean?'The apple pieces are not in the bowl.':'The apple pieces still have mud on them.',cake:s.iced?'The cupcake has not reached the stand.':'The cupcake is plain. The icing is missing.',lantern:s.light?'The lantern is still OFF.':'The light is outside the lantern.',balloon:s.escaped?'The balloon slipped away. The hook is empty.':s.full?'The balloon is not tied on the hook.':'The balloon is still flat.'}[id];
 return {valid:true,success,steps,state:s,checks,reason:success?'Our repaired program made the goal.':reason,firstProblem:steps.find(x=>x.problem)};
 }
 return {examples,example,initial,inspect,execute};
})();
if(typeof module!=='undefined')module.exports=RepairLogic;
