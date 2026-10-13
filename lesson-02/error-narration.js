'use strict';
const ErrorNarration=(()=>{
 const clips={
  'missing-instruction':'An instruction is missing. Pip does nothing here.',
  'hat-pick-empty':'No hat is on the table. Pip cannot pick it up.',
  'hat-wear-empty':'Pip has no hat in his hand. He cannot put it on.',
  'apple-wash-pieces':'The apple is already cut. This washer only washes whole apples.',
  'apple-cut-away':'The apple is away from the cutting table. We cannot cut it here.',
  'apple-bowl-empty':'There are no cut pieces to put in the bowl.',
  'cake-load-empty':'No cupcake is on the starting tray. We cannot pick one up.',
  'cake-ice-empty':'No cupcake is under the nozzle. The icing misses it.',
  'cake-serve-empty':'No cupcake is on the work table. We cannot serve it.',
  'lantern-cover-blocked':'The cover blocks the slot. This light stays outside.',
  'lantern-switch-empty':'No light is on the base. The switch cannot turn it on.',
  'balloon-pump-tied':'The balloon is tied. Air cannot go in.',
  'balloon-pump-away':'The balloon is away from the pump. We cannot fill it here.',
  'balloon-tie-away':'The balloon is away from the table. We cannot tie it here.',
  'balloon-escaped':'The balloon was not tied. It slipped away from the hook.',
  'result-hat-table':'The hat is still on the table. Check our instructions.',
  'result-hat-hand':'The hat is still in Pip’s hand. Check our instructions.',
  'result-hat-wave':'Pip has his hat, but has not waved hello.',
  'result-apple-muddy-whole':'The apple still has mud on it. Which instruction could clean it?',
  'result-apple-muddy-pieces':'The apple pieces still have mud on them. Check our instructions.',
  'result-apple-uncut':'The apple is clean but still whole. Which instruction could cut it?',
  'result-apple-bowl':'The clean apple pieces are outside the bowl. Check our instructions.',
  'result-cake-icing':'The cupcake has no icing. Which instruction could add it?',
  'result-cake-stand':'The iced cupcake is still on the table. Check our instructions.',
  'result-lantern-light':'No light is inside the lantern. Check our instructions.',
  'result-lantern-cover':'The light has no cover. Check our instructions.',
  'result-lantern-off':'The light is still off. Which instruction could switch it on?',
  'result-balloon-away':'The untied balloon slipped away. Check our instructions.',
  'result-balloon-flat':'The balloon is still flat. Which instruction could fill it?',
  'result-balloon-tie':'The balloon is full but untied. Check our instructions.',
  'result-balloon-hook':'The tied balloon is still on the table. Check our instructions.'
 };
 const notes={
  'No hat is left on the table.':'hat-pick-empty',
  'Pip has no hat in his hand to put on.':'hat-wear-empty',
  'The whole-apple washer cannot wash these pieces.':'apple-wash-pieces',
  'The apple is away from the cutting table.':'apple-cut-away',
  'There are no cut pieces to put in the bowl.':'apple-bowl-empty',
  'No cupcake is left at the starting tray.':'cake-load-empty',
  'There is no cupcake under the icing nozzle.':'cake-ice-empty',
  'There is no cupcake on the work table to serve.':'cake-serve-empty',
  'The cover blocks the loading slot.':'lantern-cover-blocked',
  'No light is on the base to switch on.':'lantern-switch-empty',
  'The balloon has already slipped away.':'balloon-tie-away',
  'The untied balloon slips away. The hook is empty.':'balloon-escaped'
 };
 function clip(key){return key?{key,text:clips[key]}:null}
 function step(id,s){
  if(s.missing)return clip('missing-instruction');
  if(!s.problem)return null;
  if(id==='balloon'&&s.action==='inflate')return clip(s.before.tied?'balloon-pump-tied':'balloon-pump-away');
  return clip(notes[s.note]);
 }
 function result(id,r){
  if(!r.valid||r.success)return null;const s=r.state;let key;
  if(id==='hat')key=s.where==='head'?'result-hat-wave':s.where==='hand'?'result-hat-hand':'result-hat-table';
  if(id==='apple')key=!s.clean?(s.cut?'result-apple-muddy-pieces':'result-apple-muddy-whole'):!s.cut?'result-apple-uncut':'result-apple-bowl';
  if(id==='cake')key=!s.iced?'result-cake-icing':'result-cake-stand';
  if(id==='lantern')key=!s.light?'result-lantern-light':!s.cover?'result-lantern-cover':'result-lantern-off';
  if(id==='balloon')key=s.escaped?'result-balloon-away':!s.full?'result-balloon-flat':!s.tied?'result-balloon-tie':'result-balloon-hook';
  return clip(key);
 }
 return {clips,step,result};
})();
if(typeof module!=='undefined')module.exports=ErrorNarration;
