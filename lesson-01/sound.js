'use strict';
const PartySound=(()=>{
 let ctx,master,greeting,finishGreeting,feedbackAudio,finishFeedback,on=true;const voices=new Set();
 function unlock(){if(!on)return;try{if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;ctx=new A();master=ctx.createGain();master.gain.value=.48;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume().catch(()=>{})}catch{}}
 function stop(){if(feedbackAudio){feedbackAudio.pause();feedbackAudio.currentTime=0}finishFeedback?.();if(greeting){greeting.pause();greeting.currentTime=0}finishGreeting?.();for(const v of voices){try{v.source.stop()}catch{}v.source.disconnect();v.gain.disconnect()}voices.clear()}
 function tone(f,d=.18,delay=0,type='sine',end=f,volume=.17){if(!on)return;unlock();if(!ctx)return;try{const t=ctx.currentTime+delay,s=ctx.createOscillator(),g=ctx.createGain();s.type=type;s.frequency.setValueAtTime(f,t);s.frequency.exponentialRampToValueAtTime(end,t+d);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(volume,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(g);g.connect(master);const v={source:s,gain:g};voices.add(v);s.onended=()=>{voices.delete(v);s.disconnect();g.disconnect()};s.start(t);s.stop(t+d+.02)}catch{}}
 function play(id){
 if(id==='stamp'){tone(170,.13,0,'sine',95,.2);tone(760,.055,.06,'triangle',480,.1)}
 else if(id==='oops'){tone(440,.27,0,'triangle',310);tone(310,.3,.23,'triangle',220);tone(155,.17,.48,'sine',100,.18)}
 else if(id==='think'){tone(330,.22,0,'triangle',440);tone(330,.3,.3,'triangle',250)}
 else if(id==='wave'){[523,659,523,784].forEach((f,i)=>tone(f,.2,i*.18,'sine'))}
 else if(id==='hat'){tone(240,.55,0,'triangle',1000);tone(880,.2,.55)}
 else if(id==='pick'){tone(180,.5,0,'triangle',600);tone(700,.18,.52)}
 else if(id==='basket'){tone(650,.42,0,'sine',220);tone(140,.18,.45,'triangle',80,.22)}
 else if(id==='letter'){tone(280,.5,0,'triangle',850);tone(1047,.3,.52)}
 else if(id==='finish'){[523,659,784,1047,1318].forEach((f,i)=>tone(f,.38,i*.12));[523,659,784].forEach(f=>tone(f,.48,.55,'sine',f,.08));[0,.16,.32,.48].forEach(t=>clap(t));tone(130,.2,.02,'triangle',70,.15)}
 else tone(640,.12,0,'sine',850,.12);
 }
 function clap(delay=0){
  unlock();if(!on||!ctx)return;
  try{const duration=.11,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;gain.gain.value=.08;source.connect(gain);gain.connect(master);const v={source,gain};voices.add(v);source.onended=()=>{voices.delete(v);source.disconnect();gain.disconnect()};source.start(ctx.currentTime+delay);}catch{}
 }
 function feedback(kind,index=0,narration=null){
  finishFeedback?.();
  if(master&&ctx)master.gain.setValueAtTime(on?.24:0,ctx.currentTime);
  play(kind==='oops'?'oops':'finish');
  if(!on)return Promise.resolve();
  return new Promise(resolve=>{
   let timer;
   const finish=()=>{clearTimeout(timer);if(feedbackAudio){feedbackAudio.onended=null;feedbackAudio.onerror=null;feedbackAudio.pause();feedbackAudio.currentTime=0}if(finishFeedback===finish)finishFeedback=null;if(master&&ctx)master.gain.setValueAtTime(on?.48:0,ctx.currentTime);resolve()};
   finishFeedback=finish;
   try{feedbackAudio??=document.getElementById('feedback-voice');if(!feedbackAudio){finish();return}const clip=narration&&typeof ErrorVoiceAssets!=='undefined'?ErrorVoiceAssets[narration.key]:null;feedbackAudio.src=clip?.src||'assets/'+(kind==='oops'?'oops':['yeah','great-job','congratulations','yeah','congratulations'][index%5])+ '-natural.mp3?v=1';feedbackAudio.volume=.8;feedbackAudio.playbackRate=1;feedbackAudio.onended=finish;feedbackAudio.onerror=finish;timer=setTimeout(finish,clip?clip.durationMs+2000:6500);feedbackAudio.play()?.catch(finish)}catch{finish()}
  });
 }
 function explanation(narration,final=false){
  const clip=narration&&typeof ErrorVoiceAssets!=='undefined'?ErrorVoiceAssets[narration.key]:null;
  if(clip)return feedback('oops',0,narration);
  if(final)return feedback('oops');
  play('oops');return Promise.resolve();
 }
 function hello(){
  stop();
  if(!on)return new Promise(resolve=>setTimeout(resolve,1450));
  return new Promise(resolve=>{
   let timer;
   const finish=()=>{clearTimeout(timer);if(greeting){greeting.onended=null;greeting.onerror=null;greeting.pause();greeting.currentTime=0}if(finishGreeting===finish)finishGreeting=null;resolve()};
   finishGreeting=finish;
   try{
    greeting??=document.getElementById('pip-hello');if(!greeting){finish();return}
    greeting.volume=.75;greeting.playbackRate=1;greeting.currentTime=0;
    greeting.onended=finish;greeting.onerror=finish;
    timer=setTimeout(finish,5000);
    const playing=greeting.play();if(playing?.catch)playing.catch(finish);
   }catch{finish()}
  });
 }
 function set(v){on=v;if(!v)stop();if(master&&ctx)master.gain.setValueAtTime(v?.48:0,ctx.currentTime);if(v)unlock()}
 return {unlock,play,hello,feedback,explanation,stop,set};
})();
