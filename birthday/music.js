// Original locally synthesized score. No external audio requests.
const BirthdayMusic=(()=>{
 let ctx=null,master=null,timer=null,enabled=false,theme='gate',step=0,next=0,listener=()=>{};const beat=.43;
 const birthday=[[67,1],[67,.5],[69,1.5],[67,1.5],[72,1.5],[71,3],[67,1],[67,.5],[69,1.5],[67,1.5],[74,1.5],[72,3],[67,1],[67,.5],[79,1.5],[76,1.5],[72,1.5],[71,1.5],[69,3],[77,1],[77,.5],[76,1.5],[72,1.5],[74,1.5],[72,4.5]];
 function init(){if(ctx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ctx=new C();master=ctx.createGain();master.gain.value=.65;const compressor=ctx.createDynamicsCompressor();master.connect(compressor);compressor.connect(ctx.destination)}
 function note(midi,t,len,vol,type='sine'){if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(midi-69)/12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.04,len));o.connect(g);g.connect(master);o.start(t);o.stop(t+len+.03)}
 function bell(n,t,len,v){note(n,t,len,v);note(n+12,t,len*.6,v*.17);note(n+19,t,len*.35,v*.035)}
 function drum(t,strong){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(strong?125:220,t);o.frequency.exponentialRampToValueAtTime(42,t+.13);g.gain.setValueAtTime(strong?.13:.025,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(master);o.start(t);o.stop(t+.18)}
 function schedule(){if(!enabled||!ctx||ctx.state!=='running')return;if(next<ctx.currentTime)next=ctx.currentTime+.03;let budget=0;while(next<ctx.currentTime+.3&&budget++<12){const t=next;
 if(theme==='birthday'){const [n,d]=birthday[step%birthday.length];bell(n,t,d*beat*.9,.12);if(step%3===0)note(n-24,t,1.3,.035,'triangle');next+=d*beat;step++;continue}
 if(theme==='gate'){const riff=[40,40,47,43,40,52,47,43];note(riff[step%8],t,.17,.09,'sawtooth');note(riff[step%8]+12,t,.14,.025,'triangle');if(step%2===0)drum(t,true);next+=.18;step++;continue}
 const chords=[[48,55,59,62],[43,50,55,59],[45,52,55,60],[41,48,53,57]],c=chords[Math.floor(step/16)%4];const upbeat=theme==='mvp',warm=theme==='duo';if(step%8===0)c.forEach((n,i)=>note(n,t+i*.025,upbeat?1.2:2.6,.018,'sine'));if(step%2===0)bell(c[(step/2)%4]+12,t,.8,upbeat?.07:.045);if(step%8===0)note(c[0]-12,t,1.4,.055,'triangle');if(upbeat||step%4===0)drum(t,step%4===0);if(warm&&step%8===4)bell(c[2]+24,t,1.4,.025);next+=upbeat?.23:.31;step++;
 }}
 function start(){init();if(!ctx)return Promise.resolve();enabled=true;return ctx.resume().then(()=>{if(!timer)timer=setInterval(schedule,80);next=ctx.currentTime+.03;schedule();listener(true)}).catch(()=>{enabled=false;listener(false)})}
 function pause(){enabled=false;listener(false);if(ctx)ctx.suspend().catch(()=>{})}
 function setTheme(value){if(theme===value)return;theme=value;step=0;if(ctx){const now=ctx.currentTime;master.gain.cancelScheduledValues(now);master.gain.setTargetAtTime(.001,now,.07);next=now+.32;master.gain.setTargetAtTime(.65,now+.33,.2)}}
 return{start,pause,setTheme,toggle:()=>enabled?pause():start(),subscribe:fn=>{listener=fn;fn(enabled);return()=>{listener=()=>{}}},getTheme:()=>theme};
})();
