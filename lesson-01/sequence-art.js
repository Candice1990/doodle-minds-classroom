'use strict';
const SequenceArt=(()=>{
 const star='<path d="M0-25L7-7L26-7L11 5L16 24L0 13L-16 24L-11 5L-26-7L-7-7Z" fill="#dd9074" stroke="#ac6754" stroke-width="2"/>';
 const face='<g fill="#78543d"><circle cx="-16" cy="-9" r="4"/><circle cx="16" cy="-9" r="4"/></g><path d="M-17 9Q0 31 17 9" fill="none" stroke="#78543d" stroke-width="4" stroke-linecap="round"/>';
 function pumpkin(smile=false){return `<path d="M0-48Q0-70 18-68" fill="none" stroke="#63815a" stroke-width="9"/><ellipse rx="62" ry="51" fill="#dc8c4f"/><ellipse rx="41" ry="51" fill="#eda968"/><ellipse rx="20" ry="50" fill="#f5bf7d"/>${smile?'<g class="pumpkin-face">'+face+'</g>':''}`}
 function bow(){return '<path d="M0 0Q-46-38-39-4Q-27 17 0 0Q28-38 40-8Q43 16 0 0L-19 31L-4 22L0 0L16 30L30 33L0 0Z" fill="#dc8b76" stroke="#ae6454" stroke-width="2"/>'}
 function card(s){const folded=s.folded;return `<path d="M${folded?-52:-88} -58H${folded?52:88}V58H${folded?-52:-88}Z" fill="#fff7d8" stroke="#bf9f77" stroke-width="3"/>${!folded?'<path d="M0-58V58" stroke="#ceb994" stroke-dasharray="5 4" stroke-width="2"/>':''}${s.inside&&!folded?`<g class="draw-star" transform="translate(43 0)">${star}</g>`:''}${s.inside&&folded?'<path d="M-37-32L-30-37L-22-32" stroke="#db9776" stroke-width="5" fill="none"/><path d="M-41 36H36" stroke="#e1cfaa" stroke-width="2"/>':''}${s.outside?`<g class="draw-star" transform="translate(0 0)">${star}</g>`:''}`}
 function bag(s={}){return `<path d="M-66-54Q0-76 66-54L76 65Q0 94-76 65Z" fill="#d9b985" stroke="#af8b5d" stroke-width="3"/><ellipse class="bag-mouth" cy="-54" rx="${s.open?66:45}" ry="${s.open?20:4}" fill="${s.open?'#927c59':'#c5a16c'}"/><rect x="-42" y="-17" width="84" height="72" rx="19" fill="#fae7b5" stroke="#c39e69" stroke-width="2"/>${s.filled?`<g class="bag-sweets">${[[-19,10],[20,16],[0,39]].map(([x,y],i)=>`<g transform="translate(${x} ${y}) rotate(${i*35}) scale(.45)">${PartyArt.candy()}</g>`).join('')}</g>`:''}${s.bow?`<g class="ribbon" transform="translate(0 -55)">${bow()}</g>`:''}`}
 function bulb(on=false){return `<circle class="light-glow" cy="-10" r="75" fill="#ffdc75" opacity="${on?.35:0}"/><path d="M-25 13Q-39-28 0-36Q39-28 25 13L15 34H-15Z" fill="${on?'#ffe57d':'#fff2d0'}" stroke="#bb9c66" stroke-width="3"/><path d="M-14 28H14V43H-14Z" fill="#9daf93"/><path d="M-7 22L-11-4L0 2L11-4L7 22" fill="none" stroke="#d2af68" stroke-width="3"/>`}
 function shade(lit=false){const shape='<path d="M-43-54Q0-93 43-54" fill="none" stroke="#b78252" stroke-width="6"/><path d="M-69-37Q0-63 69-37L84 57Q0 93-84 57Z" fill="#efb574" fill-opacity=".8" stroke="#be8452" stroke-width="4"/>'+[-45,-15,15,45].map(x=>`<path d="M${x}-36Q${x*1.3} 18 ${x} 61" stroke="#ffe5a2" stroke-width="15" fill="none"/>`).join('');return shape.replaceAll('#efb574',lit?'#ffda7b':'#b69a79').replaceAll('#ffe5a2',lit?'#fff0b5':'#d6c3a5')}
 function balloon(s={}){return `${s.full?'<ellipse cy="-28" rx="60" ry="78" fill="#d99398" stroke="#ad747d" stroke-width="3"/><ellipse cx="-22" cy="-60" rx="11" ry="24" fill="#f4c6b8" opacity=".8" transform="rotate(25 -22 -60)"/>':'<path d="M-34 10Q-44-20 0-16Q39-20 35 11L9 32H-9Z" fill="#d99398" stroke="#ad747d" stroke-width="3"/>'}<path d="M-6 ${s.full?50:28}L0 ${s.full?60:40}L6 ${s.full?50:28}" fill="#c58087"/>${s.tied?`<g class="ribbon" transform="translate(0 ${s.full?55:32}) scale(.5)">${bow()}</g><path d="M0 ${s.full?60:38}Q-17 102 0 127" stroke="#bb9166" stroke-width="2" fill="none"/>`:''}`}
 function mail(){return '<path d="M-54 66V-49Q-54-79 0-79Q54-79 54-49V66Z" fill="#a9bea0" stroke="#779575" stroke-width="3"/><path d="M-31-37H31" stroke="#54745f" stroke-width="12" stroke-linecap="round"/><path d="M-1 66V100" stroke="#8fa383" stroke-width="9"/>'}
 function arrow(){return '<path d="M-18 0H18M7-12L19 0L7 12" fill="none" stroke="#517e69" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'}
 function tiny(content,x,y,scale=1,cls=''){return `<g transform="translate(${x} ${y}) scale(${scale})"${cls?` class="${cls}"`:''}>${content}</g>`}
 function icon(id,size=70){let art='';
 const flat={folded:false,inside:false,outside:false};
 if(id==='load')art=tiny(pumpkin(),75,60,.7)+'<path d="M31 112H119" stroke="#b48d65" stroke-width="9" stroke-linecap="round"/><path d="M75 88V104M67 97L75 105L83 97" stroke="#517e69" stroke-width="4" fill="none"/>';
 if(id==='stamp')art='<path d="M46 15H104V40H89V83H61V40H46Z" fill="#9aaa95" stroke="#647c64" stroke-width="3"/><rect x="34" y="82" width="82" height="42" rx="10" fill="#c19b76"/>'+tiny(face,75,103,.55);
 if(id==='display')art=tiny(pumpkin(false),75,75,.7)+'<path d="M23 111H127M36 111V139M114 111V139" stroke="#b48d65" stroke-width="8"/>';
 if(id==='draw')art=tiny(card(flat),74,87,.6)+tiny(star,96,87,.63)+'<path d="M80 14H117V28H109V43H88V28H80Z" fill="#a7bca0"/>';
 if(id==='fold-card')art='<path d="M20 25L74 10V110L20 125Z" fill="#fff5d4" stroke="#ba9b78" stroke-width="3"/><path d="M77 10L131 25V125L77 110Z" fill="#e6b78c" stroke="#ba9b78" stroke-width="3"/>'+tiny(arrow(),105,62,.6)+'<path d="M80 61H127" stroke="#517e69" stroke-width="4"/>';
 if(id==='post-card')art=tiny(card({folded:true,inside:true}),28,77,.33)+tiny(arrow(),75,76,.48)+tiny(mail(),115,88,.45);
 if(id==='open-bag')art=tiny(bag({open:true}),75,89,.56)+tiny(arrow(),32,39,.4)+tiny(arrow(),114,39,.4);
 if(id==='fill-bag')art=tiny(bag({open:true,filled:true}),75,91,.48)+tiny(PartyArt.candy(),74,25,.48)+'<path d="M75 41V62M65 53L75 63L85 53" stroke="#517e69" stroke-width="4" fill="none"/>';
 if(id==='tie-bag')art=tiny(bag({filled:true,bow:true}),75,82,.56);
 if(id==='load-light')art=tiny(bulb(),38,67,.45)+tiny(arrow(),83,67,.48)+'<rect x="105" y="87" width="36" height="12" rx="5" fill="#a6b497"/>';
 if(id==='cover-light')art=tiny(shade(),75,66,.55)+tiny(bulb(),75,87,.35)+'<path d="M17 28V68M8 58L17 68L26 58" fill="none" stroke="#517e69" stroke-width="4"/>';
 if(id==='switch-on')art=tiny(bulb(true),67,62,.65)+'<rect x="99" y="89" width="32" height="26" rx="7" fill="#78997d"/><circle cx="115" cy="102" r="8" fill="#f5d777"/>';
 if(id==='inflate')art=tiny(balloon({full:true}),91,82,.48)+'<path d="M37 110V57M21 57H53M19 110H55M55 109Q73 126 80 107" stroke="#7c9a85" stroke-width="6" fill="none"/>';
 if(id==='knot')art=tiny(balloon({full:true,tied:true}),75,63,.55);
 if(id==='hang')art='<path d="M112 16V43Q112 60 95 56" stroke="#967550" stroke-width="6" fill="none"/>'+tiny(balloon({full:true,tied:true}),67,66,.5);
 return `<svg viewBox="0 0 150 150" width="${size}" height="${size}" aria-hidden="true">${art}</svg>`;
 }
 function goal(id,size=82){const content={pumpkin:tiny(pumpkin(true),75,75,.66)+'<path d="M24 109H126M36 109V139M114 109V139" stroke="#b48d65" stroke-width="8"/>',invitation:tiny(card({folded:false,inside:true}),75,74,.65),sweets:tiny(bag({filled:true,bow:true}),75,78,.64),lantern:tiny(bulb(true),75,82,.7)+tiny(shade(true),75,78,.7),balloon:tiny(balloon({full:true,tied:true}),75,72,.66)}[id];return `<svg viewBox="0 0 150 160" width="${size}" height="${size}" aria-hidden="true">${content}</svg>`}
 function outcome(id,s,size=82){let art='';
  if(id==='pumpkin')art=tiny(pumpkin(s.face),75,70,.7)+(s.shown?'<path d="M22 108H128M35 108V138M115 108V138" stroke="#b48d65" stroke-width="8"/>':'<rect x="22" y="108" width="106" height="12" rx="5" fill="#d8b989"/>');
  if(id==='invitation')art=tiny(card({folded:false,inside:s.inside}),75,78,.72);
  if(id==='sweets')art=tiny(bag(s),75,75,.72);
  if(id==='lantern')art=(s.light?tiny(bulb(s.on),65,83,.6):'')+(s.cover?tiny(shade(s.on),65,76,.6):'')+(!s.light?tiny(bulb(false),122,110,.35):'');
  if(id==='balloon')art=s.escaped?'<path d="M75 27V68Q75 88 57 81" stroke="#967550" stroke-width="7" fill="none"/>':tiny(balloon(s),75,65,.65);
  return `<svg class="outcome-picture" viewBox="0 0 150 160" width="${size}" height="${size}" role="img" aria-label="Actual ${PartyLogic.example(id).name} result">${art}</svg>`;
 }
 function mark(x,y,label){return `<g class="error-target" transform="translate(${x} ${y})"><circle r="48" fill="#fff4e6" fill-opacity=".35" stroke="#bd6d59" stroke-width="4" stroke-dasharray="7 5"/><circle cx="36" cy="-36" r="17" fill="#bd6d59"/><path d="M29-43L43-29M43-43L29-29" stroke="#fff7e8" stroke-width="5" stroke-linecap="round"/><title>${label}</title></g>`}
 function frame(content,label,phase='idle'){return `<svg class="party-scene seq-scene ${phase}" viewBox="0 0 960 560" role="img" aria-label="${label}"><path d="M50 275Q12 113 191 108Q352 19 491 84Q729 18 866 147Q979 319 885 452Q671 547 469 502Q213 558 76 430Z" fill="#e3e1d0"/><path d="M73 383Q227 292 429 375Q656 280 898 384L881 443Q630 528 468 496Q212 546 81 430Z" fill="#cfdcb2"/>${PartyArt.decor()}${content}</svg>`}
 function stampTool(x,y,drop,phase){return `<g transform="translate(${x} ${y})"><g class="stamp-head ${phase||'parked'}" style="--stamp-drop:${drop}px"><path d="M-34-20H34V5H16V75H-16V5H-34Z" fill="#9eaf95" stroke="#667b60" stroke-width="3"/><path d="M-37 78H37" stroke="#9c7251" stroke-width="12" stroke-linecap="round"/></g></g>`}
 function machine(id,s,options={}){
 const e=PartyLogic.example(id),step=options.step,action=step?.action||'',phase=options.phase||'idle';let art='';
 const moving=(content,x,y,fromX=x,fromY=y,cls='')=>`<g transform="translate(${x} ${y})"><g class="${step?'motion':''} ${cls}" style="--dx:${fromX-x}px;--dy:${fromY-y}px">${content}</g></g>`;
 const table='<path d="M315 410H852M352 410V478M822 410V478" stroke="#ba936b" stroke-width="14" stroke-linecap="round"/><rect x="420" y="370" width="185" height="18" rx="9" fill="#d8b989"/><path d="M431 393H594" stroke="#eed1a6" stroke-width="5" stroke-dasharray="8 5"/>';
 art+=table;if(id==='pumpkin'||id==='invitation')art+='<path d="M402 371V149Q402 133 419 133H598Q615 133 615 150V371" stroke="#98ab8a" stroke-width="7" fill="none"/><path d="M499 135V170" stroke="#91a282" stroke-width="7"/>';
 if(id==='pumpkin'){
  const x=s.shown?765:s.loaded?500:330,y=s.shown?325:s.loaded?318:329,bx=step?.before.shown?765:step?.before.loaded?500:330,by=step?.before.shown?325:step?.before.loaded?318:329;
  art+='<path d="M267 380H393" stroke="#b48e67" stroke-width="10" stroke-linecap="round"/><path d="M697 376H838M711 376V410M825 376V410" stroke="#b48e67" stroke-width="10"/>';
  if(s.tableFace)art+=`<g class="table-ink">${tiny(face,500,399,.6)}</g>`;
  art+=moving(pumpkin(s.face),x,y,bx,by,s.face&&action==='stamp'?'new-face':'');
  art+=stampTool(500,155,step?.before.loaded&&!step?.before.shown?80:139,options.stampPhase);

 }
 if(id==='invitation'){
  art+=tiny(mail(),785,310,.9);
  const x=s.where==='bench'?510:785,y=s.where==='bench'?305:s.posted?300:250;
  if(!s.posted)art+=moving(card(s),x,y,step?.before.where==='bench'?510:785,step?.before.where==='bench'?305:250,action==='fold'?'card-fold':'');
  else art+='<g class="post-inspection" transform="translate(785 322) scale(.72)"><rect x="-98" y="-68" width="196" height="136" rx="12" fill="#eff3df" stroke="#8ca481" stroke-width="3" stroke-dasharray="5 4"/>'+card({folded:false,inside:s.inside,outside:false})+'<text x="0" y="94" text-anchor="middle" font-family="Trebuchet MS" font-size="22" font-weight="bold" fill="#294f45">LOOK INSIDE</text></g>';
  if(action==='post')art+=moving(card(step.before),785,260,510,305,'posting-card');
  art+=stampTool(545,140,105,action==='draw'?options.stampPhase:null);
 }
 if(id==='sweets'){
  art+=tiny(bag(s),520,320,.92);
  if(!s.filled&&!s.spilled)art+=[0,1,2].map(i=>tiny(PartyArt.candy(),741+i*24,285+i*27,.58)).join('');
  if(s.spilled)art+=[0,1,2].map(i=>moving(tiny(PartyArt.candy(),0,0,.55),673+i*44,391,745+i*15,260+i*25,'spill')).join('');
  if(action==='fill'&&s.filled)art+=[0,1,2].map(i=>moving(tiny(PartyArt.candy(),0,0,.5),498+i*22,315+i*14,746+i*15,270+i*18,'sweet-fall')).join('');
  
 }
 if(id==='lantern'){
  if(s.on&&s.cover)art+='<ellipse cx="510" cy="310" rx="112" ry="104" fill="#ffe38e" opacity=".32"/>';
  art+='<rect x="433" y="373" width="161" height="17" rx="8" fill="#92a783"/><path d="M592 385H699" stroke="#8ba07b" stroke-width="3"/><rect x="693" y="354" width="55" height="40" rx="10" fill="#92a783"/><circle cx="720" cy="372" r="12" fill="'+(s.on?'#f4d36c':'#f3eee0')+'"/>';
  const x=s.light?510:s.outside?768:780,y=s.light?315:s.outside?350:297;
  art+=moving(bulb(s.on),x,y,step?.before.light?510:780,step?.before.light?315:297,action==='light'&&s.outside?'blocked-light':action==='on'?'light-up':'');
  art+=moving(shade(s.cover&&s.on),s.cover?510:777,s.cover?310:225,step?.before.cover?510:777,step?.before.cover?310:225,'lantern-cover');
 }
 if(id==='balloon'){
  art+='<path d="M783 149V200Q783 222 766 212" stroke="#9c7756" stroke-width="9" fill="none"/><path d="M361 387V293M331 293H391M326 387H397M397 386Q480 430 530 356" stroke="#829c83" stroke-width="10" fill="none" stroke-linecap="round"/>';
  const x=s.where==='bench'?530:s.where==='hook'?768:908,y=s.where==='bench'?305:s.where==='hook'?273:93;
  art+=moving(balloon(s),x,y,step?.before.where==='bench'?530:step?.before.where==='hook'?768:908,step?.before.where==='bench'?305:step?.before.where==='hook'?273:93,action==='inflate'&&s.full?'inflate-balloon':'');
  if(action==='inflate'&&step.problem)art+='<g class="air-puff"><path d="M407 301Q441 278 460 303M420 315Q456 305 468 329" fill="none" stroke="#e8f0d6" stroke-width="8" stroke-linecap="round"/></g>';
 }
 const failed=options.issue||options.result&&!options.result.success;
 if(failed){
  if(id==='pumpkin')art+=options.issue?.action==='stamp'?mark(500,399,'Face stamped on the empty table'):mark(765,s.shown?325:360,s.shown?'No face on the pumpkin':'Empty display stand');
  if(id==='invitation')art+=mark(s.posted?816:510,s.posted?322:305,s.inside?'Card not posted':'No star inside');
  if(id==='sweets')art+=mark(520,s.filled?269:333,s.filled?'Missing bow':'Empty bag');
  if(id==='lantern')art+=options.issue?.action==='on'?mark(720,372,'No light on the base'):mark(s.light?510:768,315,s.light?'Light is off':'Light is outside');
  if(id==='balloon')art+=mark(s.escaped?775:s.where==='hook'?768:530,s.escaped?204:s.where==='hook'?273:305,s.escaped?'Empty hook':'Flat balloon');
 }
 art+=`<g transform="translate(${id==='pumpkin'?170:225} 337) scale(${id==='pumpkin'?.88:1.02})"><g class="pip-body">${PartyArt.pip()}</g></g>`;
 if(phase==='done')art+=PartyArt.reaction('success',e.cheer);
 if(phase==='thinking')art+=PartyArt.reaction('oops');
 return frame(art,`${e.name} machine. ${options.note||e.goal}`,`${phase} ${step?'running-step op-'+action:''} ${options.stampPhase?'stamp-'+options.stampPhase:''}`);
 }
 function overview(completed=new Set()){
 let art='<path d="M163 287Q480 398 811 278" fill="none" stroke="#fff6dc" stroke-width="17" stroke-linecap="round"/>';
 PartyLogic.examples.forEach((e,i)=>{const x=154+i*166,y=i%2?320:265;art+=`<g transform="translate(${x} ${y})"><rect x="-69" y="-78" width="138" height="160" rx="24" fill="#fff9e8" stroke="${completed.has(e.id)?'#9cab73':'#cfbf9d'}" stroke-width="3"/>${goal(e.id,90).replace('<svg','<svg x="-45" y="-55"')}<text x="0" y="66" text-anchor="middle" font-family="Trebuchet MS" font-size="16" font-weight="bold" fill="#294f45">${i+1} · ${e.name}</text>${completed.has(e.id)?'<circle cx="48" cy="-64" r="16" fill="#94ad79"/><path d="M40-64L46-57L57-72" stroke="#fff9e8" stroke-width="3" fill="none"/>':''}</g>`});
 art+=`<g transform="translate(275 425) scale(.62)">${PartyArt.pip()}</g>`;
 return frame(art,'Five party jobs: pumpkin, invitation, treats, lantern and balloon.');
 }
 return {icon,goal,outcome,machine,overview};
})();
