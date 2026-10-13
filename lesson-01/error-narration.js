'use strict';
// Ana narration follows the executed state, never a prescribed card order.
const ErrorNarration=(()=>{
 const clips={
  'pumpkin-stamp-empty':'Oops! The pumpkin is not here yet. The stamp made a face on the empty table!',
  'pumpkin-stamp-away':'Oops! The pumpkin is already on display. The stamp only reaches the empty work table!',
  'pumpkin-display-empty':'Oops! There is no pumpkin on the work table to show!',
  'card-open-slot':'Oops! The card is still open. It is too wide to fit through the post slot!',
  'card-fold-away':'Oops! The card has left the work table. We cannot fold it here now!',
  'card-star-outside':'Oops! The card is already closed. The star went on the outside, not inside!',
  'card-stamp-away':'Oops! The card has left the work table. The stamp cannot reach it now!',
  'sweets-spilled':'Oops! The bag is closed. The sweets fell onto the table, not into the bag!',
  'bag-bow-undone':'Oops! Opening the bag untied the bow. Now the bow is gone!',
  'light-cover-blocked':'Oops! The cover is already on. It blocks the slot, so the light stays outside!',
  'light-switch-empty':'Oops! There is no light on the base yet. The button cannot turn it on!',
  'balloon-escaped':'Oops! The balloon was not tied. It slipped away from the hook!',
  'balloon-tie-away':'Oops! The balloon has gone away. There is no balloon here to tie!',
  'balloon-pump-tied':'Oops! The balloon is already tied. The pump cannot put air inside!',
  'balloon-pump-away':'Oops! The balloon is no longer at the pump. We cannot fill it with air here!',
  'result-pumpkin-blank':'The pumpkin is on display, but it has no smiling face. Let’s change the order!',
  'result-pumpkin-table':'The pumpkin is still on the work table. The display stand is empty. Let’s change the order!',
  'result-pumpkin-face-table':'Our pumpkin has a smiling face, but it is still on the work table. The display stand is empty!',
  'result-card-outside':'The card was posted, but its star is on the outside. We need a star inside!',
  'result-card-open':'The open card could not fit through the post slot. Our invitation was not posted!',
  'result-bag-empty':'The bag is empty. The sweets are on the table. Let’s change the order!',
  'result-bag-open':'The sweets are inside, but the bag is open and has no bow. Let’s change the order!',
  'result-light-outside':'The light is outside the lantern. The cover blocked it from going in!',
  'result-light-off':'The light is inside the lantern, but it is still off. Let’s change the order!',
  'result-balloon-away':'The balloon slipped away. The party hook is empty. Let’s change the order!',
  'result-balloon-flat':'The tied balloon is on the hook, but it is still flat. No air could go inside!'
 };
 const stepKeys={
  'The stamp made a face on the empty table.':'pumpkin-stamp-empty',
  'There was no pumpkin to move to the stand.':'pumpkin-display-empty',
  'The open card is too wide for the post slot.':'card-open-slot',
  'There is no card on the folding table.':'card-fold-away',
  'The card was closed. The star went on the outside.':'card-star-outside',
  'The card was already away from the stamping table.':'card-stamp-away',
  'The bag was closed. The sweets fell on the table.':'sweets-spilled',
  'Opening the bag untied the bow. There is no bow now.':'bag-bow-undone',
  'The cover blocked the slot. The light stayed outside.':'light-cover-blocked',
  'The button was pressed before a light was on the base.':'light-switch-empty',
  'The untied balloon slipped away from the hook.':'balloon-escaped',
  'The balloon is no longer on the tying table.':'balloon-tie-away',
  'The balloon was already tied. Air could not go in.':'balloon-pump-tied',
  'The balloon is no longer at the pump.':'balloon-pump-away'
 };
 const resultKeys={
  'The pumpkin on the stand has no face.':'result-pumpkin-blank',
  'The pumpkin is still on the work table. The stand is empty.':'result-pumpkin-table',
  'A smiling pumpkin is still on the work table. The stand is empty.':'result-pumpkin-face-table',
  'The card was posted, but it is blank INSIDE. The star is on the outside.':'result-card-outside',
  'The open card could not fit through the post slot.':'result-card-open',
  'The bag is empty. The sweets are on the table.':'result-bag-empty',
  'The sweets are inside, but the bag is open with no bow.':'result-bag-open',
  'The cover blocked the light. It is outside and cannot glow.':'result-light-outside',
  'The light is inside, but it is still OFF.':'result-light-off',
  'The balloon slipped away. The hook is empty.':'result-balloon-away',
  'The tied balloon is still flat. No air could go in.':'result-balloon-flat'
 };
 function item(key){return key?{key,text:clips[key]}:null}
 function step(id,s){if(!s?.problem)return null;return item(id==='pumpkin'&&s.action==='stamp'&&s.before.shown?'pumpkin-stamp-away':stepKeys[s.note])}
 function result(id,r){return r?.valid&&!r.success?item(resultKeys[r.reason]):null}
 return {clips,step,result};
})();
if(typeof module!=='undefined')module.exports=ErrorNarration;
