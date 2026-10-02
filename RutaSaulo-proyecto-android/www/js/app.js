"use strict";
/* ============ UTILIDADES ============ */
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const SVGNS="http://www.w3.org/2000/svg";
const sv=(tag,attrs)=>{const n=document.createElementNS(SVGNS,tag);for(const k in attrs||{})n.setAttribute(k,attrs[k]);return n};
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parseD=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const MESES=["ene","feb","mar","abr","may","jun","jul","ago","set","oct","nov","dic"];
const DIAS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const fmtD=d=>d.getDate()+" "+MESES[d.getMonth()];
const hm=min=>{const h=Math.floor(min/60),m=Math.round(min%60);return h?(h+" h"+(m?" "+pad(m):"")):(m+" min")};
const tmin=s=>{const [h,m]=s.split(":").map(Number);return h*60+m};
const tstr=m=>Math.floor(m/60)+":"+pad(m%60);
const wdIdx=d=>(d.getDay()+6)%7;
const mmss=sec=>{sec=Math.max(0,Math.round(sec));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return h?h+":"+pad(m)+":"+pad(s):m+":"+pad(s)};
const f1=n=>(Math.round(n*10)/10).toString().replace(".",",");
const todayIso=()=>iso(new Date());
const reduceMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function toast(msg,ms){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("show"),ms||2400)}
function mondayOf(d){const x=new Date(d);x.setDate(x.getDate()-wdIdx(x));return x}
const smooth=()=>reduceMotion?"auto":"smooth";


/* ============ ÍCONOS (SVG, sin emojis: toda la tipografía es Poppins) ============ */
const IC={
 play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 run:'<circle cx="14.5" cy="4.5" r="2"/><path d="M7 21l3.2-5.5 3.3 2V21M6 11.5l3-3.5h4.5l2.5 4 3 1M10.2 15.5 12 10"/>',
 bike:'<circle cx="6" cy="16" r="3.6"/><circle cx="18" cy="16" r="3.6"/><path d="M6 16l3.5-7h5.5l3 7M9.5 9l3 7M13.5 5.5h3"/>',
 dumbbell:'<path d="M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11"/>',
 mountain:'<path d="M2.5 20l6.5-12 4 6.5 2.5-3.5 6 9z"/>',
 repeat:'<path d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4"/>',
 stretch:'<circle cx="12" cy="4.5" r="2"/><path d="M4 10l8 1.5 8-1.5M12 11.5V16l-3 5M12 16l3 5"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 flame:'<path d="M12 2.5c.8 3.6 5.5 5.6 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.7 1.6-4.4 2.6-5.4 0 1.8 1 2.9 2 2.9 0-3 .1-5.3.9-8z"/>',
 drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
 flag:'<path d="M5 21V4M5 4h12l-2.5 4.5L17 13H5"/>',
 medal:'<circle cx="12" cy="15" r="5"/><path d="M8.6 11.3 6 3h4l2 5 2-5h4l-2.6 8.3"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
 clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2.5h6"/>',
 scale:'<rect x="3.5" y="4" width="17" height="16" rx="4"/><path d="M8 10a5 5 0 0 1 8 0M12 10l1.5-2"/>',
 sunrise:'<path d="M3 19h18M6.5 19a5.5 5.5 0 0 1 11 0M12 4v3M5 10.5l1.8 1.5M19 10.5 17.2 12"/>',
 heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4 4 0 0 1 12 7.5a4 4 0 0 1 7.5 2.3C19.5 15.4 12 20 12 20z"/>',
 calendar:'<rect x="3.5" y="4.5" width="17" height="16" rx="3"/><path d="M16 2.5v4M8 2.5v4M3.5 10h17"/>',
 road:'<path d="M8 3 4.5 21M16 3l3.5 18M12 5v2.5M12 11v2.5M12 17v2.5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 briefcase:'<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18"/>',
 utensils:'<path d="M7 3v18M4.5 3v5a2.5 2.5 0 0 0 5 0V3M17 3c-2 1.8-3 4.5-3 8h3v10"/>',
 users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0M16 4.8a3.2 3.2 0 0 1 0 6.4M17.5 14a5.5 5.5 0 0 1 3.5 6"/>',
 cart:'<path d="M3 4h2.5l2.2 11h10.6l2-8H6.6"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
 pot:'<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h20M9 6.5c0-1 1-1.5 1-2.5M14 6.5c0-1 1-1.5 1-2.5"/>',
 chart:'<path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/>',
 dot:'<circle cx="12" cy="12" r="3"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
 alarm:'<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.8M4 4.5 6.5 2.5M20 4.5l-2.5-2M6 20.5l-1.5 1.5M18 20.5l1.5 1.5"/>',
 bolt:'<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>'
};
function ic(n,cls){return `<svg class="ic ${cls||""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||IC.star}</svg>`}
function face(n){const m={1:"M8.5 16.5q3.5-3 7 0",2:"M8.8 16q3.2-1.6 6.4 0",3:"M9 15.5h6",4:"M8.8 14.8q3.2 2 6.4 0",5:"M8.3 14q3.7 4 7.4 0"}[n];return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.2 9.6v.6M14.8 9.6v.6"/><path d="${m}"/></svg>`}
const FEEL_LBL=["Muy mal","Mal","Normal","Bien","Excelente"];

/* ============ DATOS GUARDADOS ============ */
const KEY="ruta-saulo-v1";
const DEF={settings:{start:"2026-10-05",onboarded:false,notif:{morning:true,evening:true,pre:true,thaw:true,errands:true,weigh:true,water:false,review:true},alarms:{train:"06:00",rest:"07:00",sat:"07:00",sun:"07:30"},alarmsSet:false},acts:[],checkins:{},water:{},weights:[],shop:{},prep:{},active:null,seenBadges:[]};
let db=load();
function load(){try{const o=JSON.parse(localStorage.getItem(KEY)||"null");if(!o)return JSON.parse(JSON.stringify(DEF));const d=JSON.parse(JSON.stringify(DEF));Object.assign(d,o);d.settings=Object.assign({},DEF.settings,o.settings||{});d.settings.notif=Object.assign({},DEF.settings.notif,(o.settings||{}).notif||{});d.settings.alarms=Object.assign({},DEF.settings.alarms,(o.settings||{}).alarms||{});return d}catch(e){return JSON.parse(JSON.stringify(DEF))}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){toast("No se pudo guardar")}}
const state={get start(){return db.settings.start}};
const TRAIN_KEYS=["run","str","bike","long","brick"];
const KEY_NAME={run:"Carrera",str:"Fuerza + core",bike:"Bici de calidad",long:"Fondo en bici",brick:"Bici + trote",mob:"Movilidad",other:"Otra actividad"};
const KEY_COLOR={run:"var(--z4)",str:"var(--z3)",bike:"var(--z2)",long:"var(--z2)",brick:"var(--z5)",mob:"var(--z1)",other:"var(--z0)"};
const KEY_ICON={run:"run",str:"dumbbell",bike:"bike",long:"mountain",brick:"repeat",mob:"stretch",other:"star",rest:"moon"};
const catTile=(key,sm)=>`<span class="cat cat-${key}${sm?" sm":""}">${ic(KEY_ICON[key]||"star")}</span>`;

/* ============ CALENDARIO ============ */
function weekOfDate(ds){const diff=Math.floor((parseD(ds)-parseD(state.start))/86400000);return diff<0?0:Math.floor(diff/7)+1}
function currentWeek(){return Math.min(16,Math.max(0,weekOfDate(todayIso())))}
function planDate(w,wd){return iso(addDays(parseD(state.start),(w-1)*7+wd))}
function actsOn(ds){return db.acts.filter(a=>a.date===ds)}
function doneSession(ds,key){return db.acts.some(a=>a.date===ds&&a.key===key)}
function weekActs(w){return db.acts.filter(a=>weekOfDate(a.date)===w)}
function weekSessionsDone(w){const s=new Set();weekActs(w).forEach(a=>{if(TRAIN_KEYS.includes(a.key))s.add(a.date+a.key)});return s.size}
function planWeekHours(w){return (w>=1&&w<=16)?weekHours(w):0}

/* ============ NATIVO: NOTIFICACIONES Y PANTALLA ============ */
const isNative=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
const LN=isNative&&window.capacitorLocalNotifications?window.capacitorLocalNotifications.LocalNotifications:null;
const KA=isNative&&window.capacitorKeepAwake?window.capacitorKeepAwake.KeepAwake:null;
const SA=isNative&&window.capacitorExports&&window.capacitorExports.registerPlugin?window.capacitorExports.registerPlugin("SystemAlarm"):null;
const ALARM_SET=[["train","Martes a jueves","Ruta: hoy entrenas a las 6:15",[3,4,5],"run"],["rest","Lunes y viernes","Ruta: hoy descansas",[2,6],"moon"],["sat","Sábado","Ruta: fondo a las 8:30",[7],"mountain"],["sun","Domingo","Ruta: bici y trote a las 9:00",[1],"repeat"]];
async function createAlarms(){
 if(!SA){toast("Las alarmas se crean en la app instalada en Android");return}
 let ok=0;
 for(const [k,,msg,days] of ALARM_SET){const [h,m]=db.settings.alarms[k].split(":").map(Number);
  try{await SA.setAlarm({hour:h,minutes:m,days,message:msg,skipUi:true});ok++;await new Promise(r=>setTimeout(r,900))}catch(e){toast((e&&e.message)||"No se pudo crear la alarma");break}}
 if(ok){db.settings.alarmsSet=true;save();toast(ok+" alarmas creadas en el Reloj de tu teléfono",3500);render()}
}
async function openAlarms(){if(!SA){toast("Solo en la app de Android");return}try{await SA.openAlarms()}catch(e){toast("No se encontró la app de Reloj")}}
let notifGranted=false;
async function notifSetup(){
 if(!LN)return;
 try{const p=await LN.checkPermissions();notifGranted=p.display==="granted";}catch(e){}
 try{await LN.createChannel({id:"plan",name:"Recordatorios del plan",description:"Qué toca hoy, mañana, comida y compras",importance:4,vibration:true});
     await LN.createChannel({id:"alarma",name:"Alarmas del plan",description:"Aviso sonoro 10 minutos antes de cada sesión",importance:5,vibration:true,sound:"alarma.wav",visibility:1});
     await LN.createChannel({id:"workout",name:"Entrenamiento en curso",description:"Cambios de intervalo y comida en la bici",importance:5,vibration:true});}catch(e){}
}
async function askNotif(){
 if(!LN){toast("Las notificaciones funcionan en la app instalada en Android");return}
 try{const p=await LN.requestPermissions();notifGranted=p.display==="granted";
  if(notifGranted){await scheduleReminders();toast("Recordatorios activados")}else toast("Permiso denegado: actívalo en Ajustes de Android");
 }catch(e){toast("No se pudo pedir el permiso")}
 render();
}
const at=(ds,hhmm)=>{const d=parseD(ds),[h,m]=hhmm.split(":").map(Number);d.setHours(h,m,0,0);return d};
function reminderList(days){
 const out=[],now=new Date(),N=db.settings.notif;
 const push=(id,when,title,body)=>{if(when>now)out.push({id,title,body,schedule:{at:when,allowWhileIdle:true},channelId:"plan",smallIcon:"ic_stat_notify",iconColor:"#1E45FB"})};
 for(let i=0;i<days;i++){
  const ds=iso(addDays(now,i)),d=parseD(ds),wd=wdIdx(d),w=weekOfDate(ds),s=sessionFor(w,wd),base=(i+1)*20;
  const nd=iso(addDays(d,1)),nwd=wdIdx(addDays(d,1)),ns=sessionFor(weekOfDate(nd),nwd);
  if(N.morning){
   if(s&&wd<=3)push(base+1,at(ds,"06:00"),"Hoy: "+s.title+" a las 6:15",hm(s.dur)+". Un vaso de agua, ½ plátano y a la calle.");
   else if(s&&wd===5)push(base+1,at(ds,"07:00"),"Hoy: "+s.title.toLowerCase()+" de "+hm(s.dur),"Sales a las 8:30. Desayuno grande ahora.");
   else if(s&&wd===6)push(base+1,at(ds,"07:30"),"Hoy: bici + trote a las 9:00",hm(s.dur)+". Deja las zapatillas en la puerta.");
   else if(w>=1&&w<=16&&(wd===0||wd===4))push(base+1,at(ds,"07:00"),"Hoy descansas","10 minutos de movilidad y a trabajar. Desayuno: "+R[MENU[wd].d].n+".");
  }
  if(N.pre&&s){const st=tmin(s.start)-10;const wh=at(ds,tstr(st).padStart(5,"0"));if(wh>now)out.push({id:base+10,title:"En 10 minutos: "+s.title,body:purposeOf(s.key,w),schedule:{at:wh,allowWhileIdle:true},channelId:"alarma",smallIcon:"ic_stat_notify",iconColor:"#1E45FB"})}
  if(N.evening&&ns){const t=tstr(tmin(ns.start));push(base+2,at(ds,"21:45"),"Mañana: "+ns.title+" a las "+t,"Deja lista la ropa"+(nwd>=5?", bidones y comida":" y el desayuno")+". A dormir a las 22:30.")}
  const thaw=FROZEN[nwd];
  if(N.thaw&&thaw&&weekOfDate(nd)>=1)push(base+3,at(ds,"22:00"),"Pasa a la refri","Lo de mañana: "+thaw.map(r=>R[r].n.toLowerCase()).join(" y ")+(wd===4?" y 4 barritas":"")+".");
  if(N.errands&&wd===5)push(base+4,at(ds,"16:15"),"Compras en 15 minutos","Mercado a las 16:30 con tu lista de S/ 100.");
  if(N.errands&&wd===6)push(base+5,at(ds,"15:15"),"Prep de la semana a las 15:30","2 horas y tienes comida hasta el sábado.");
  if(N.weigh&&wd===0&&w>=1)push(base+6,at(ds,"07:02"),"Lunes: pésate","En ayunas, después del baño. Anótalo en Progreso.");
  if(N.water){push(base+7,at(ds,"11:00"),"Agua","¿Vas por el primer litro?");push(base+8,at(ds,"16:00"),"Agua","Rellena la botella antes de las 19:00.")}
  if(N.review&&wd===6&&w>=1)push(base+9,at(ds,"17:30"),"Revisión semanal","5 minutos en Progreso: cómo te fue y qué ajustar.");
 }
 return out;
}
async function scheduleReminders(){
 if(!LN||!notifGranted)return;
 try{
  const pend=await LN.getPending();const old=(pend.notifications||[]).filter(n=>n.id<40000).map(n=>({id:n.id}));
  if(old.length)await LN.cancel({notifications:old});
  const list=reminderList(14);if(list.length)await LN.schedule({notifications:list});
 }catch(e){console.warn(e)}
}
async function testNotif(){
 if(!LN){toast("Solo en la app de Android");return}
 if(!notifGranted){await askNotif();if(!notifGranted)return}
 try{await LN.schedule({notifications:[{id:39999,title:"¡Funciona!",body:"Así te llegarán los recordatorios.",schedule:{at:new Date(Date.now()+5000),allowWhileIdle:true},channelId:"plan",smallIcon:"ic_stat_notify"}]});toast("Llega en 5 segundos")}catch(e){toast("Error al programar")}
}

/* ============ REPRODUCTOR DE ENTRENAMIENTO ============ */
let P=null,WK=null,audio=null,pLoop=null;
function beep(freq,dur,vol){try{if(!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;o.type="sine";g.gain.value=vol||0.25;o.connect(g);g.connect(audio.destination);const t=audio.currentTime;g.gain.setValueAtTime(vol||0.25,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.start(t);o.stop(t+dur)}catch(e){}}
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function savePlayer(){db.active=P?Object.assign({},P,{savedAt:Date.now()}):null;save()}
function startWorkout(key,w,date){
 if(P&&!confirm("Ya tienes un entrenamiento en curso. ¿Empezar uno nuevo?"))return;
 try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();audio.resume&&audio.resume()}catch(e){}
 WK=buildWorkout(key,w);
 P={key,w,date:date||todayIso(),idx:0,segEl:0,totEl:0,running:true,last:Date.now(),durs:{},fired:[],beeped:-1,startedAt:Date.now()};
 savePlayer();openPlayer();beep(880,.25);vib(200);
 if(KA)KA.keepAwake().catch(()=>{});
 scheduleWorkoutNotifs();
}
function resumeSaved(){
 const a=db.active;if(!a)return false;
 if(Date.now()-a.savedAt>12*3600*1000){db.active=null;save();return false}
 P=a;WK=buildWorkout(P.key,P.w);
 if(P.running){P.last=a.savedAt;stepTime()}
 return true;
}
function openPlayer(){
 const el=$("#player");el.hidden=false;pushLayer("player");
 renderPlayer();
 clearInterval(pLoop);pLoop=setInterval(()=>{if(stepTime())renderPlayer();else updateClock()},250);
}
function minimizePlayer(){$("#player").hidden=true;clearInterval(pLoop);pLoop=setInterval(stepTime,1000);render()}
function seg(){return WK.segs[P.idx]}
function stepTime(){
 if(!P||!P.running)return false;
 const now=Date.now(),dt=now-P.last;P.last=now;P.segEl+=dt;P.totEl+=dt;let changed=false;
 while(P&&seg()&&seg().s>0&&P.segEl>=seg().s*1000){const over=P.segEl-seg().s*1000;P.durs[P.idx]=seg().s;advance(true,over);changed=true}
 if(!P)return true;
 const s=seg();
 if(s&&s.s>0){const left=Math.ceil((s.s*1000-P.segEl)/1000);if(left<=3&&left>=1&&P.beeped!==P.idx*10+left){P.beeped=P.idx*10+left;beep(660,.12)}}
 (WK.alerts||[]).forEach((a,i)=>{if(!P.fired.includes(i)&&P.totEl>=a.t*1000){P.fired.push(i);vib([300,150,300]);beep(520,.4);toast(a.msg,6000);changed=true}});
 if(now-(P._sv||0)>3000){P._sv=now;savePlayer()}
 return changed;
}
function advance(auto,carry){
 if(!auto)P.durs[P.idx]=Math.round(P.segEl/1000);
 P.idx++;P.segEl=carry||0;P.beeped=-1;
 if(P.idx>=WK.segs.length){finishWorkout();return}
 beep(seg().rest?520:990,.35);vib(seg().rest?[150]:[250,120,250]);
 savePlayer();scheduleWorkoutNotifs();
}
function back(){if(P.idx===0){P.segEl=0}else{P.idx--;P.segEl=0}savePlayer();scheduleWorkoutNotifs();renderPlayer()}
function togglePause(){
 if(P.running){stepTime();P.running=false;cancelWorkoutNotifs()}else{P.running=true;P.last=Date.now();scheduleWorkoutNotifs()}
 savePlayer();renderPlayer();
}
async function cancelWorkoutNotifs(){if(!LN)return;try{const pend=await LN.getPending();const ids=(pend.notifications||[]).filter(n=>n.id>=50000&&n.id<51000).map(n=>({id:n.id}));if(ids.length)await LN.cancel({notifications:ids})}catch(e){}}
async function scheduleWorkoutNotifs(){
 if(!LN||!notifGranted||!P)return;
 await cancelWorkoutNotifs();if(!P||!P.running)return;
 const list=[],now=Date.now();let t=now,i=P.idx,el=P.segEl;
 while(i<WK.segs.length&&list.length<40){
  const s=WK.segs[i];if(!s.s)break;
  t+=s.s*1000-el;el=0;i++;
  const n=WK.segs[i];if(!n)break;
  list.push({id:50000+list.length,title:"Ahora: "+n.l,body:(n.s?mmss(n.s)+" ":"Toca LISTO al terminar. ")+(n.z?"Z"+n.z:""),schedule:{at:new Date(t),allowWhileIdle:true},channelId:"workout",smallIcon:"ic_stat_notify"});
 }
 (WK.alerts||[]).forEach((a,k)=>{if(P.fired.includes(k))return;const when=now+(a.t*1000-P.totEl);if(when>now&&list.length<60)list.push({id:50500+k,title:"Come y bebe",body:a.msg,schedule:{at:new Date(when),allowWhileIdle:true},channelId:"workout",smallIcon:"ic_stat_notify"})});
 try{if(list.length)await LN.schedule({notifications:list})}catch(e){}
}
function segKind(s){if(s.rest||s.z===0)return {t:"Recupera",ic:"drop",bg:"#00BCC8",c:"#1A1A1A"};if(!s.s&&s.ex)return {t:EX[s.ex].cat==="Pliometría"?"Técnica y potencia":"Fuerza",ic:"dumbbell",bg:"#1E45FB",c:"#FFFFFF"};if(s.test)return {t:"Test",ic:"clock",bg:"#D0FF00",c:"#1A1A1A"};if(s.z>=3)return {t:"Esfuerzo",ic:"bolt",bg:"#D0FF00",c:"#1A1A1A"};return {t:"Suave",ic:"heart",bg:"#00BCC8",c:"#1A1A1A"}}
function segWhy(s){return s.ex?EX_APORTA[s.ex]||"":s.rest?SEG_WHY.rest:SEG_WHY[s.z]||""}
function renderPlayer(){
 if(!P||!WK)return;const s=seg();if(!s)return;
 const el=$("#player"),next=WK.segs[P.idx+1],manual=!s.s;
 const total=WK.segs.length,pct=Math.round(P.idx/total*100);
 const exId=s.ex||(s.rest&&next&&next.ex)||null;
 el.innerHTML=`<div class="ptop"><button class="link" style="color:#fff" data-act="pmin">‹ Volver</button><span>${esc(WK.title)}</span><button class="link" style="color:#D0FF00" data-act="pstop">Terminar</button></div>
 <div class="zoneband" style="background:${segKind(s).bg}"></div>
 <div class="small" style="opacity:.7">Paso ${P.idx+1} de ${total}</div>
 <div class="cur">
  ${exId?`<div class="pfig" id="pfig"></div>`:""}
  <span class="kind" style="background:${segKind(s).bg};color:${segKind(s).c}">${ic(segKind(s).ic,"ic-sm")}${segKind(s).t}${s.z?", zona "+s.z:""}</span>
  <div class="lab">${s.rest&&next&&next.ex?"Descanso. Sigue: "+esc(next.l):esc(s.l)}</div>
  <div class="clock${manual?" manual":""}" id="pclock"></div>
  ${s.note&&!s.rest?`<div class="note">${esc(s.note)}</div>`:manual?`<div class="note">${s.test?"El cronómetro mide tu test. Toca LISTO justo al terminar.":"Hazlo a tu ritmo y toca LISTO."}</div>`:""}
  <div class="why">${esc(s.rest&&next&&next.ex?EX_APORTA[next.ex]||"":segWhy(s))}</div>
  ${!P.running?`<div class="note" style="color:#D0FF00;font-weight:600">En pausa</div>`:""}
 </div>
 ${next?`<div class="next"><span class="small" style="opacity:.6">Después</span><b>${esc(next.l)}</b><span class="small" style="opacity:.7">${next.s?mmss(next.s):"a tu ritmo"}${next.z?", Z"+next.z:""}</span></div>`:`<div class="next"><b>Último paso</b></div>`}
 <div class="bar"><i style="width:${pct}%"></i></div>
 <div class="tot"><div><b id="ptot">${mmss(P.totEl/1000)}</b><span>Tiempo total</span></div><div><b>${P.idx}/${total}</b><span>Pasos hechos</span></div></div>
 <div class="ctrls">
  ${manual?`<button class="sec" data-act="ppause">${P.running?"Pausa":"Seguir"}</button><button class="main done-btn" data-act="pdone">LISTO</button><button class="sec" data-act="pskip">Saltar</button>`
   :`<button class="sec" data-act="pback">Atrás</button><button class="main" data-act="ppause">${P.running?"Pausa":"Seguir"}</button><button class="sec" data-act="pskip">Saltar</button>`}
 </div>`;
 if(exId){const box=$("#pfig");box.style.setProperty("--figure","#EEF1F4");box.style.setProperty("--figure-far","#5C6670");box.style.setProperty("--prop","#2E353C");addAnimated(box,exId);const cap=box.querySelector(".figcap");if(cap)cap.remove()}
 updateClock();
}
function updateClock(){
 if(!P||$("#player").hidden)return;const s=seg(),c=$("#pclock");if(!c||!s)return;
 c.textContent=s.s?mmss(Math.ceil((s.s*1000-P.segEl)/1000)):mmss(P.segEl/1000);
 const t=$("#ptot");if(t)t.textContent=mmss(P.totEl/1000);
}
function finishWorkout(){
 if(!P)return;stepTime&&P.running&&stepTime();P.running=false;clearInterval(pLoop);cancelWorkoutNotifs();if(KA)KA.allowSleep().catch(()=>{});
 beep(1046,.5);vib([300,100,300,100,500]);
 const testIdx=WK.segs.findIndex(s=>s.test);let testSec=testIdx>=0&&P.durs[testIdx]!=null?P.durs[testIdx]:null;
 const el=$("#player");el.hidden=false;
 el.innerHTML=`<div style="overflow-y:auto;flex:1">
  <div class="ptop"><span></span><span>Resumen</span><span></span></div>
  <div style="text-align:center;margin:18px 0 10px"><div class="logo">${ic("flag")}</div><h2 style="font-size:1.5rem">¡Sesión terminada!</h2><div style="color:#A3ADB8">${esc(WK.title)}</div></div>
  <div class="tot" style="margin-bottom:14px"><div><b>${mmss(P.totEl/1000)}</b><span>Tiempo</span></div><div><b>${Math.min(P.idx,WK.segs.length)}/${WK.segs.length}</b><span>Pasos</span></div></div>
  <div class="sumcard">${activityForm({key:P.key,date:P.date,min:Math.round(P.totEl/60000),test:testIdx>=0?{lbl:WK.segs[testIdx].test,km:WK.segs[testIdx].km,sec:testSec}:null},true)}</div>
 </div>`;
 bindActivityForm(el,true);
}

/* ============ CAPAS (hoja inferior, reproductor) Y BOTÓN ATRÁS ============ */
const layers=[];
function pushLayer(n){layers.push(n);try{history.pushState({layer:n},"")}catch(e){}}
window.addEventListener("popstate",()=>{const top=layers.pop();if(top==="sheet")hideSheet();else if(top==="player")minimizePlayerSafe()});
function closeTop(){if(layers.length)history.back()}
function openSheet(html,after){
 const sh=$("#sheet"),b=$("#sheetBody");b.innerHTML=html;sh.scrollTop=0;
 if(!sh.classList.contains("on")){sh.classList.add("on");$("#scrim").classList.add("on");pushLayer("sheet")}
 if(after)after(b);
}
function hideSheet(){$("#sheet").classList.remove("on");$("#scrim").classList.remove("on")}
$("#scrim").addEventListener("click",closeTop);
function minimizePlayerSafe(){if(!P){$("#player").hidden=true;clearInterval(pLoop);render();return}minimizePlayer()}

/* ============ FORMULARIO DE ACTIVIDAD ============ */
const FEEL=[1,2,3,4,5];
function activityForm(a,fromPlayer){
 const opts=Object.entries(KEY_NAME).map(([k,v])=>`<option value="${k}"${a.key===k?" selected":""}>${v}</option>`).join("");
 return `<form id="actForm">
  ${fromPlayer?"":`<div class="grid2"><div><label class="f">Tipo</label><select class="i" name="key">${opts}</select></div><div><label class="f">Fecha</label><input class="i" type="date" name="date" value="${a.date||todayIso()}"></div></div>`}
  <div class="grid2"><div><label class="f">Duración (min)</label><input class="i" type="number" inputmode="numeric" name="min" value="${a.min??""}"></div><div><label class="f">Distancia (km)</label><input class="i" type="number" inputmode="decimal" step="0.1" name="km" value="${a.km??""}"></div></div>
  <div class="grid2"><div><label class="f">Desnivel + (m)</label><input class="i" type="number" inputmode="numeric" name="elev" value="${a.elev??""}"></div><div><label class="f">FC media</label><input class="i" type="number" inputmode="numeric" name="hr" value="${a.hr??""}"></div></div>
  ${a.test?`<label class="f">Tiempo del test ${esc(a.test.lbl)} (mm:ss)</label><input class="i" name="testTime" placeholder="24:30" value="${a.test.sec?mmss(a.test.sec):""}"><input type="hidden" name="testLbl" value="${esc(a.test.lbl)}"><input type="hidden" name="testKm" value="${a.test.km}">`:""}
  <label class="f">Esfuerzo (RPE): <span id="rpeV">${a.rpe||5}</span>/10</label><input type="range" min="1" max="10" name="rpe" value="${a.rpe||5}">
  <label class="f">¿Cómo te sentiste?</label><div class="emo" id="feel">${FEEL.map((f,i)=>`<button type="button" data-feel="${i+1}" aria-pressed="${(a.feel||3)===i+1}" aria-label="${FEEL_LBL[i]}">${face(i+1)}</button>`).join("")}</div>
  <input type="hidden" name="feel" value="${a.feel||3}">
  <label class="f">Notas</label><textarea class="i" name="notes" rows="2" placeholder="Ruta, sensaciones, molestias">${esc(a.notes||"")}</textarea>
  <input type="hidden" name="id" value="${a.id||""}"><input type="hidden" name="pkey" value="${a.key||""}"><input type="hidden" name="pdate" value="${a.date||""}">
  <div class="row" style="margin-top:14px;gap:8px"><button class="btn full" type="submit">Guardar actividad</button>${fromPlayer?`<button class="btn ghost" type="button" data-act="discard">Descartar</button>`:a.id?`<button class="btn ghost" type="button" data-act="delact" data-id="${a.id}">Borrar</button>`:""}</div>
 </form>`;
}
function bindActivityForm(root,fromPlayer){
 const f=root.querySelector("#actForm");
 f.rpe.addEventListener("input",()=>root.querySelector("#rpeV").textContent=f.rpe.value);
 root.querySelector("#feel").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;f.feel.value=b.dataset.feel;root.querySelectorAll("#feel button").forEach(x=>x.setAttribute("aria-pressed",x===b))});
 f.addEventListener("submit",e=>{
  e.preventDefault();
  const num=n=>{const v=f[n]&&f[n].value.trim();return v?Number(v.replace(",",".")):null};
  const key=f.key?f.key.value:f.pkey.value,date=f.date?f.date.value:f.pdate.value;
  let test=null;if(f.testLbl){const m=f.testTime.value.trim().match(/^(\d+):(\d{1,2})$/);if(m)test={lbl:f.testLbl.value,km:Number(f.testKm.value),sec:+m[1]*60+ +m[2]}}
  const a={id:f.id.value||Date.now().toString(36),date,key,w:weekOfDate(date),title:(fromPlayer&&WK?WK.title:KEY_NAME[key]),min:num("min"),km:num("km"),elev:num("elev"),hr:num("hr"),rpe:+f.rpe.value,feel:+f.feel.value,notes:f.notes.value.trim().slice(0,500),test,ts:Date.now()};
  const i=db.acts.findIndex(x=>x.id===a.id);if(i>=0)db.acts[i]=a;else db.acts.push(a);
  if(fromPlayer){P=null;WK=null;db.active=null}
  save();toast(test?"Test guardado: "+mmss(test.sec):"Actividad guardada");
  closeTop();setTimeout(checkBadges,400);if(fromPlayer){tab="progreso";sub.progreso="act"}render();
 });
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-act='discard']");if(b&&confirm("¿Descartar esta sesión?")){P=null;WK=null;db.active=null;save();closeTop();render()}
});

/* ============ CHECK-IN ============ */
function verdictOf(c){
 if(!c)return null;
 if(c.pain===2||(c.sleep<5&&c.energy<=2))return {k:"r",t:"Hoy descansa o haz solo 30' muy suaves en Z1. Mañana sigues con el plan."};
 if(c.sleep<6||c.energy<=2||c.pain===1)return {k:"y",t:"Haz la sesión, pero solo la parte suave (Z2): sin intervalos ni tests."};
 return {k:"g",t:"Todo en verde: haz la sesión como está planificada."};
}

/* ============ PANTALLAS ============ */
let tab="hoy";const sub={plan:"semana",comida:"hoy",progreso:"resumen"};let planWeek=null,exFilter="Todos";
const TITLES={hoy:"Hoy",plan:"Plan",entrenar:"Entrenar",comida:"Comida",progreso:"Progreso"};
function render(){
 $("#title").textContent=TITLES[tab];
 $$(".nav button").forEach(b=>{if(b.dataset.tab===tab)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
 const v=$("#view");
 v.innerHTML=({hoy:viewHoy,plan:viewPlan,entrenar:viewEntrenar,comida:viewComida,progreso:viewProgreso})[tab]();
 afterRender();
}
const segCtl=(group,items,cur)=>`<div class="seg">${items.map(([k,l])=>`<button data-seg="${group}" data-v="${k}" aria-pressed="${k===cur}">${l}</button>`).join("")}</div>`;
const chips=zs=>zs.map(z=>`<span class="chip z${z}">Z${z}</span>`).join(" ");
function waterTarget(ds){const d=parseD(ds),s=sessionFor(weekOfDate(ds),wdIdx(d));return 2500+Math.round((s?s.dur:0)*10/250)*250}
function ring(p,col){const r=26,c=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--soft)" stroke-width="8"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-Math.min(1,p))}" transform="rotate(-90 32 32)"/></svg>`}
function streakWeeks(){let n=0;const cw=currentWeek();if(cw<1)return 0;let w=cw;if(weekSessionsDone(cw)<4)w=cw-1;for(;w>=1;w--){if(weekSessionsDone(w)>=4)n++;else break}return n}

function viewHoy(){
 const ds=todayIso(),d=new Date(),wd=wdIdx(d),w=weekOfDate(ds),s=sessionFor(w,wd),cw=currentWeek();
 let h="";
 if(P)h+=`<button class="card row between" style="width:100%;border-color:var(--acc);background:var(--acc2)" data-act="openplayer"><span><b>Entrenamiento en curso</b><br><span class="sub">${esc(WK.title)}, ${mmss(P.totEl/1000)}</span></span><span class="btn sm">Abrir</span></button>`;
 if(isNative&&!notifGranted)h+=`<div class="card"><h3>Activa los recordatorios</h3><p class="sub">Te aviso qué toca cada mañana, la noche anterior, la comida del congelador, las compras y los cambios de intervalo.</p><button class="btn" data-act="asknotif">Activar notificaciones</button></div>`;
 if(isNative&&SA&&!db.settings.alarmsSet)h+=`<div class="card row" style="align-items:flex-start;gap:12px"><span class="cat cat-run">${ic("alarm")}</span><div style="flex:1"><h3>Crea tus alarmas</h3><p class="sub">Suenan en el Reloj de tu teléfono aunque esté en silencio: 6:00 los días de entreno, 7:00 al descansar y más tarde los fines de semana.</p><button class="btn sm" data-act="mkalarms">Crear alarmas</button></div></div>`;
 if(w===0){const diff=Math.ceil((parseD(state.start)-parseD(ds))/86400000);h+=`<div class="card hero rest"><div class="k">Antes de empezar</div><h2>Arrancas en ${diff} día${diff===1?"":"s"}</h2><p style="opacity:.85">Tu plan empieza el lunes ${fmtD(parseD(state.start))}. Mientras: compra con la lista, mira los ejercicios y duerme bien.</p><div class="row wrap" style="gap:8px"><button class="btn" data-goto="comida:compras">Lista de compras</button><button class="btn ghost" data-goto="plan:ejercicios">Ejercicios</button></div></div>`}
 const done=s&&doneSession(ds,s.key);
 if(s){
  h+=`<div class="card hero${done?" done":""}"><div class="k">${catTile(s.key)}<span style="flex:1">${DIAS[wd]} ${fmtD(d)}<br>Semana ${w}</span>${done?`<span class="tag ok">${ic("check","ic-sm")} Hecha</span>`:""}</div><h2 style="margin-top:14px">${esc(s.title)}</h2><p class="why">${esc(purposeOf(s.key,w))}</p>
  <div class="meta"><div><b>${tstr(tmin(s.start))}</b><span>Empieza</span></div><div><b>${hm(s.dur)}</b><span>Duración</span></div><div><b>${chips(s.z)}</b><span>Zonas</span></div></div>
  <div class="row" style="gap:8px">${done?`<button class="btn ghost" data-goto="progreso:act">Ver actividad</button>`:`<button class="btn cta" data-act="start" data-key="${s.key}" data-w="${w}">${ic("play")} Empezar</button>`}<button class="btn ghost" data-act="sess" data-key="${s.key}" data-w="${w}">Ver sesión</button></div></div>`;
 }else if(w>=1&&w<=16){
  h+=`<div class="card hero rest"><div class="k">${catTile("rest")}<span>${DIAS[wd]} ${fmtD(d)}<br>Semana ${w}</span></div><h2 style="margin-top:14px">Hoy descansas</h2><p class="why">${esc(purposeOf("rest",w))} Solo 10 minutos de movilidad.</p><div style="margin-top:14px"><button class="btn" data-act="start" data-key="mob" data-w="${w}">${ic("play")} Movilidad guiada</button></div></div>`;
 }
 // Check-in
 const c=db.checkins[ds],v=verdictOf(c);
 if(w>=1&&s){
  if(c)h+=`<div class="card"><div class="row between"><h3>Cómo amaneciste</h3><button class="link" data-act="recheck">Editar</button></div><div class="verdict v-${v.k}">${esc(v.t)}</div></div>`;
  else h+=`<div class="card" id="checkin"><h3>¿Cómo amaneciste?</h3><p class="sub">10 segundos y te digo si hoy va completo o suave.</p>
   <label class="f">Horas de sueño: <span id="slV">7</span></label><input type="range" min="3" max="10" step="0.5" value="7" id="slR">
   <label class="f">Energía</label><div class="emo" id="enE">${FEEL.map((f,i)=>`<button type="button" data-v="${i+1}" aria-pressed="${i===2}" aria-label="${FEEL_LBL[i]}">${face(i+1)}</button>`).join("")}</div>
   <label class="f">Molestias</label><div class="seg" id="paE"><button type="button" data-v="0" aria-pressed="true">Ninguna</button><button type="button" data-v="1" aria-pressed="false">Leve</button><button type="button" data-v="2" aria-pressed="false">Fuerte</button></div>
   <button class="btn full" data-act="savecheck">Listo</button></div>`;
 }
 // Agenda
 const blocks=dayBlocks(d),nowM=d.getHours()*60+d.getMinutes();
 let i0=blocks.findIndex(b=>nowM<b.b);if(i0<0)i0=blocks.length-1;
 const show=blocks.slice(i0,i0+4);
 h+=`<div class="sec-t">${ic("clock")}Lo que sigue</div><div class="card"><ul class="tl">${show.map((b,i)=>tlItem(b,i===0&&nowM>=b.a)).join("")}</ul><button class="link" style="margin-top:8px" data-act="day" data-day="${ds}">Ver el día completo</button></div>`;
 // Comidas
 const M=MENU[wd];
 h+=`<div class="sec-t">${ic("utensils")}Comidas de hoy</div><div class="card">${mealRows(M,wd)}</div>`;
 // Agua
 const wml=db.water[ds]||0,wt=waterTarget(ds);
 h+=`<div class="card water">${ring(wml/wt,"#3B8FD9")}<div style="flex:1"><h3>Agua: ${f1(wml/1000)} de ${f1(wt/1000)} L</h3><div class="row" style="gap:6px;margin-top:6px"><button class="btn sm" data-act="water" data-ml="250">+ vaso</button><button class="btn sm" data-act="water" data-ml="500">+ ½ L</button><button class="btn sm ghost" data-act="water" data-ml="-250">−</button></div></div></div>`;
 // Semana
 if(cw>=1){const dn=weekSessionsDone(cw),hrs=weekActs(cw).reduce((t,a)=>t+(a.min||0),0)/60,km=weekActs(cw).reduce((t,a)=>t+(a.km||0),0);
  h+=`<div class="sec-t">${ic("chart")}Tu semana ${cw}</div><div class="card"><div class="stats"><div><b>${dn}/5</b><span>Sesiones</span></div><div><b>${f1(hrs)} h</b><span>de ${f1(planWeekHours(cw))} h</span></div><div><b>${f1(km)}</b><span>km</span></div><div><b>${streakWeeks()}${ic("flame","ic-sm")}</b><span>Racha</span></div></div></div>`}
 return h;
}
function blockIcon(b){if(b.k==="train")return KEY_ICON[b.x.sess.key];if(b.k==="sleep")return"moon";if(b.k==="work")return"briefcase";if(b.k==="food")return"utensils";if(b.k==="act")return"users";if(b.k==="prep")return /Compras/.test(b.t)?"cart":/fondo|salida/i.test(b.t)?"bolt":"pot";const t=b.t;if(/Despertar/.test(t))return"sunrise";if(/Ducha/.test(t))return"drop";if(/Traslado/.test(t))return"road";if(/Movilidad/.test(t))return"stretch";if(/Revisión/.test(t))return"chart";if(/Cerrar|Libre y|Dormir/.test(t))return"moon";if(/Preparar|Arreglarte/.test(t))return"bolt";return"dot"}
function tlItem(b,now){
 const lbl=b.k==="food"&&b.x.rec&&R[b.x.rec]?`${esc(b.t)}: <button class="exlink" data-rec="${b.x.rec}">${esc(R[b.x.rec].n)}</button>`:esc(b.t)+(b.k==="food"&&b.d?": "+esc(b.d):"");
 const det=b.k==="food"?(b.x.note?esc(b.x.note):""):esc(b.d);
 return `<li class="${now?"now":""}"><span class="t">${tstr(b.a)}</span><div class="b k-${b.k}">${ic(blockIcon(b))}<div>${lbl}${det?`<small>${det}</small>`:""}</div></div></li>`;
}

function mealRows(M,wd){
 const r=[];if(M.pre)r.push(["Al despertar",null,M.pre]);
 r.push(["Desayuno",M.d,M.dn]);if(M.post)r.push(["Al volver",M.post,"más 2 huevos"]);
 r.push(["Almuerzo",M.a,M.an||(FROZEN[wd]&&FROZEN[wd].includes(M.a)?"del congelador":"")]);r.push(["Media tarde",null,M.mt]);
 r.push(["Cena",M.c,M.cn||(FROZEN[wd]&&FROZEN[wd].includes(M.c)?"del congelador":"")]);
 return `<ul class="tl meals">${r.map(([t,id,n])=>`<li><span class="t">${t}</span><div class="b k-food"><div>${id?`<button class="exlink" data-rec="${id}">${esc(R[id].n)}</button>`:esc(n)}${id&&n?`<small>${esc(n)}</small>`:""}</div></div></li>`).join("")}</ul>`;
}

/* ---------- PLAN ---------- */
function viewPlan(){
 let h=segCtl("plan",[["semana","Semana"],["fases","16 semanas"],["ejercicios","Ejercicios"],["horario","Horario"]],sub.plan);
 if(sub.plan==="semana"){
  const w=planWeek||Math.max(1,currentWeek()),p=phaseOf(w),dl=DELOAD.includes(w);
  h+=`<div class="card"><div class="row between"><button class="iconbtn" data-act="wk" data-d="-1" ${w===1?"disabled":""} aria-label="Semana anterior">‹</button><div style="text-align:center"><h3 style="font-size:1.25rem">Semana ${w}</h3><div class="sub"><span class="light" style="background:${PHASES[p].c}"></span> ${PHASES[p].n}${dl?", descarga":""}</div></div><button class="iconbtn" data-act="wk" data-d="1" ${w===16?"disabled":""} aria-label="Semana siguiente">›</button></div><p class="sub" style="text-align:center;margin-bottom:0">${esc(PHASES[p].f)} ${f1(weekHours(w))} h en 5 días.</p></div>`;
  for(let wd=0;wd<7;wd++){
   const ds=planDate(w,wd),d=parseD(ds),s=sessionFor(w,wd),ok=s&&doneSession(ds,s.key);
   h+=`<button class="daycard${s?"":" rest"}${ds===todayIso()?" today":""}" data-act="day" data-day="${ds}">${catTile(s?s.key:"rest")}
    <div><div class="dn">${DIAS[wd]} ${fmtD(d)}</div>${s?`<div class="tt">${esc(s.title)}</div><div class="ds">${tstr(tmin(s.start))}, ${hm(s.dur)} ${chips(s.z)}</div><div class="why">${esc(purposeOf(s.key,w))}</div>`:`<div class="tt" style="color:var(--ink2)">Descanso</div><div class="ds">Movilidad 10'</div>`}</div>
    ${s?`<span class="check${ok?" on":""}">${ic("check")}</span>`:"<span></span>"}</button>`;
  }
 }else if(sub.plan==="fases"){
  const mx=11.5,cw=currentWeek();
  h+=`<div class="card"><h3>Horas por semana</h3><div class="wkbars">${Array.from({length:16},(_,i)=>{const w=i+1;return `<button class="${w===cw?"sel":""}" style="height:${weekHours(w)/mx*100}%;background:${PHASES[phaseOf(w)].c};opacity:${DELOAD.includes(w)?.5:1}" data-act="gowk" data-w="${w}" aria-label="Semana ${w}"></button>`}).join("")}</div><div class="wknums">${Array.from({length:16},(_,i)=>`<span>${i+1}</span>`).join("")}</div></div>`;
  [1,2,3,4].forEach(p=>h+=`<div class="card"><div class="row"><span class="light" style="background:${PHASES[p].c}"></span><h3>Semanas ${(p-1)*4+1} a ${p*4}: ${PHASES[p].n}</h3></div><p class="sub" style="margin-bottom:0">${esc(PHASES[p].f)}</p></div>`);
  h+=`<div class="card"><h3>Tests y metas</h3><ul class="dots"><li>Semana 4: test de 3 km.</li><li>Semanas 8 y 12: test de 5 km.</li><li>Semana 15: simulacro de 5 h con 2000 m de desnivel.</li><li>Semana 16: 5 km final, meta menos de 24:00.</li></ul></div>`;
  h+=`<div class="card"><h3>Zonas</h3>${ZONES.map(z=>`<div class="phase-row"><div><span class="chip z${z.z}">${esc(z.n)}</span> <span class="sub">RPE ${z.rpe}, ${esc(z.fc)}</span></div><div class="small">${esc(z.talk)}. ${esc(z.use)}.</div></div>`).join("")}</div>`;
  h+=`<div class="card"><h3>Reglas</h3><ol class="steps">${RULES.map(r=>`<li>${esc(r)}</li>`).join("")}</ol></div>`;
 }else if(sub.plan==="ejercicios"){
  h+=segCtl("exf",["Todos","Fuerza","Core","Pliometría"].map(c=>[c,c]),exFilter);
  EX_ORDER.filter(id=>exFilter==="Todos"||EX[id].cat===exFilter).forEach(id=>{const ex=EX[id];h+=`<button class="exitem" data-ex="${id}"><div class="fig" data-fig="${id}"></div><div><div class="sub">${ex.cat}</div><div style="font-weight:600">${esc(ex.n)}</div><div class="aporta">${esc(EX_APORTA[id]||"")}</div></div></button>`});
  h+=`<div class="card"><h3>Movilidad de 10 minutos</h3><ol class="steps">${MOBILITY.map(m=>`<li>${esc(m)}</li>`).join("")}</ol><button class="btn" data-act="start" data-key="mob" data-w="${Math.max(1,currentWeek())}">${ic("play")} Hacerla guiada</button></div>`;
 }else{
  const types=[["Martes a jueves",1],["Lunes y viernes",0],["Sábado",5],["Domingo",6]];
  const w=Math.max(1,currentWeek());
  types.forEach(([n,wd])=>{const d=parseD(planDate(w,wd));h+=`<div class="card"><h3>${n}</h3><ul class="tl" style="margin-top:6px">${dayBlocks(d).map(b=>tlItem(b,false)).join("")}</ul></div>`});
 }
 return h;
}
/* ---------- ENTRENAR ---------- */
function viewEntrenar(){
 const ds=todayIso(),wd=wdIdx(new Date()),w=weekOfDate(ds),s=sessionFor(w,wd),cw=Math.max(1,Math.min(16,w||1));
 let h="";
 if(P)h+=`<div class="card hero"><div class="k">${catTile(P.key)}<span>En curso</span></div><h2 style="margin-top:12px">${esc(WK.title)}</h2><p class="why">${mmss(P.totEl/1000)} transcurridos</p><button class="btn cta full" style="margin-top:12px" data-act="openplayer">Volver al entrenamiento</button></div>`;
 if(s){const wk=buildWorkout(s.key,w);h+=`<div class="card hero"><div class="k">${catTile(s.key)}<span>La sesión de hoy</span></div><h2 style="margin-top:14px">${esc(s.title)}</h2><p class="why">${esc(purposeOf(s.key,w))}</p><div class="meta"><div><b>~${estMin(wk)} min</b><span>Duración</span></div><div><b>${wk.segs.length}</b><span>Pasos guiados</span></div><div><b>${chips(s.z)}</b><span>Zonas</span></div></div><button class="btn cta full" data-act="start" data-key="${s.key}" data-w="${w}">${ic("play")} Iniciar</button></div>`}
 else h+=`<div class="card hero rest"><div class="k">${catTile("rest")}<span>${w>=1?"Día de descanso":"Antes de empezar"}</span></div><h2 style="margin-top:14px">Movilidad guiada</h2><p class="why">${esc(purposeOf("mob",cw))}</p><button class="btn" style="margin-top:12px" data-act="start" data-key="mob" data-w="${cw}">${ic("play")} Empezar 10 minutos</button></div>`;
 h+=`<div class="sec-t">${ic("calendar")}Semana ${cw}</div>`;
 [1,2,3,5,6].forEach(x=>{const ss=sessionFor(cw,x);if(!ss)return;const dsx=planDate(cw,x),ok=doneSession(dsx,ss.key);
  h+=`<div class="card" style="padding:12px 14px"><div class="row" style="align-items:flex-start;gap:12px">${catTile(ss.key)}<div style="flex:1;min-width:0"><div class="sub">${DIAS[x]}${ok?` <span class="tag ok" style="padding:1px 8px">Hecha</span>`:""}</div><b>${esc(ss.title)}</b><div class="aporta">${esc(purposeOf(ss.key,cw))}</div><div class="ds sub" style="margin-top:4px">${hm(ss.dur)} ${chips(ss.z)}</div></div><button class="btn sm" data-act="start" data-key="${ss.key}" data-w="${cw}" data-date="${dsx}" aria-label="Empezar">${ic("play")}</button></div></div>`});
 h+=`<div class="sec-t">${ic("info")}Cómo funciona</div><div class="card small"><ul class="dots"><li>Cada paso tiene su temporizador. Al cambiar, suena, vibra y te llega una notificación aunque bloquees el teléfono.</li><li>En fuerza haces la serie, tocas LISTO y el descanso empieza solo.</li><li>En los fondos te aviso cada 30 minutos para comer y beber.</li><li>Para el GPS usa tu reloj o Strava, y anota aquí los km al terminar.</li></ul></div>`;
 h+=`<button class="btn ghost full" data-act="manual">${ic("plus")} Registrar actividad a mano</button>`;
 return h;
}

/* ---------- COMIDA ---------- */
function viewComida(){
 let h=segCtl("comida",[["hoy","Hoy"],["semana","Semana"],["recetas","Recetas"],["compras","Compras"],["prep","Prep"]],sub.comida);
 const wd=wdIdx(new Date());
 if(sub.comida==="hoy"){
  h+=`<div class="card"><h3>${DIAS[wd]}</h3>${mealRows(MENU[wd],wd)}</div>`;
  h+=TARGETS.map(t=>`<div class="card"><div class="sub">${esc(t.k)}</div><div style="font-size:1.4rem;font-weight:900">${esc(t.v)}</div><p class="small" style="margin:0">${esc(t.d)}</p></div>`).join("");
  h+=`<div class="card small" style="border-color:var(--warn)">${esc(WEIGHT_NOTE)}</div>`;
 }else if(sub.comida==="semana"){
  MENU.forEach((m,i)=>h+=`<div class="card"><h3>${DIAS[i]}${i===wd?" (hoy)":""}</h3>${mealRows(m,i)}</div>`);
 }else if(sub.comida==="recetas"){
  const groups={};Object.entries(R).forEach(([id,r])=>{(groups[r.t]=groups[r.t]||[]).push([id,r])});
  Object.entries(groups).forEach(([g,list])=>{h+=`<div class="sec-t">${esc(g)}</div>`;list.forEach(([id,r])=>h+=`<button class="card row between" style="width:100%;text-align:left" data-rec="${id}"><span><b>${esc(r.n)}</b><br><span class="sub">${esc(r.por)}, ~${r.kcal} kcal${r.p?", "+r.p+" g proteína":""}</span></span><span class="sub">S/ ${r.cost.toFixed(2)}</span></button>`)});
 }else if(sub.comida==="compras"){
  const tot=SHOP.reduce((a,x)=>a+x[1],0),got=SHOP.reduce((a,x,i)=>a+(db.shop[i]?x[1]:0),0);
  h+=`<div class="card"><div class="row between"><h3>Mercado del sábado</h3><span class="sub">S/ ${got.toFixed(2)} de ${tot.toFixed(2)}</span></div><ul class="shop">${SHOP.map((s,i)=>`<li class="${db.shop[i]?"done":""}"><label><input type="checkbox" data-shop="${i}" ${db.shop[i]?"checked":""}><span>${esc(s[0])}</span></label><span class="pr">S/ ${s[1].toFixed(2)}</span></li>`).join("")}</ul><button class="btn ghost full" style="margin-top:10px" data-act="shopreset">Empezar lista nueva</button></div>`;
 }else{
  const key=iso(mondayOf(new Date()));const pd=db.prep[key]||{};
  h+=`<div class="card"><h3>Prep del domingo, 15:30 a 17:30</h3><ul class="shop">${PREP.map((s,i)=>`<li class="${pd[i]?"done":""}"><label><input type="checkbox" data-prep="${i}" ${pd[i]?"checked":""}><span>${esc(s)}</span></label></li>`).join("")}</ul></div>`;
  h+=`<div class="card"><h3>Comida en la bici</h3><ul class="dots">${FUEL.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="row" style="gap:12px"><button class="exlink" data-rec="iso">Isotónico casero</button><button class="exlink" data-rec="barritas">Barritas</button></div></div>`;
 }
 return h;
}
/* ---------- PROGRESO ---------- */
const range16=Array.from({length:16},(_,i)=>i+1);
function tests(){return db.acts.filter(a=>a.test&&a.test.sec).map(a=>Object.assign({date:a.date},a.test)).sort((a,b)=>a.date<b.date?-1:1)}
function best5(){const t=tests();let b=Infinity;t.forEach(x=>{const e=x.km===5?x.sec:x.sec*Math.pow(5/x.km,1.06);if(e<b)b=e});return b}
function bikeKm(){return db.acts.filter(a=>["bike","long","brick"].includes(a.key)).reduce((t,a)=>t+(a.km||0),0)}
function weightsSorted(){return db.weights.slice().sort((a,b)=>a.date<b.date?-1:1)}
function weightDelta(){const w=weightsSorted();return w.length>1?w[w.length-1].kg-w[0].kg:0}
function maxStreak(){let m=0,c=0;range16.forEach(w=>{if(weekSessionsDone(w)>=4){c++;m=Math.max(m,c)}else c=0});return m}
const BADGES=[
 {id:"first",ic:"run",n:"Primer paso",d:"Tu primera actividad",ok:()=>db.acts.length>=1},
 {id:"check10",ic:"heart",n:"Escucha tu cuerpo",d:"10 check-ins",ok:()=>Object.keys(db.checkins).length>=10},
 {id:"week",ic:"calendar",n:"Semana completa",d:"5 de 5 sesiones",ok:()=>range16.some(w=>weekSessionsDone(w)>=5)},
 {id:"streak3",ic:"flame",n:"Racha de 3",d:"3 semanas seguidas con 4+",ok:()=>maxStreak()>=3},
 {id:"early",ic:"sunrise",n:"Madrugador",d:"10 sesiones a las 6:15",ok:()=>db.acts.filter(a=>["run","str","bike"].includes(a.key)).length>=10},
 {id:"water7",ic:"drop",n:"Hidratado",d:"7 días con la meta de agua",ok:()=>Object.entries(db.water).filter(([d,ml])=>ml>=waterTarget(d)).length>=7},
 {id:"km100",ic:"bike",n:"100 km",d:"Acumulados en bici",ok:()=>bikeKm()>=100},
 {id:"km500",ic:"road",n:"500 km",d:"Acumulados en bici",ok:()=>bikeKm()>=500},
 {id:"long4",ic:"mountain",n:"Fondo de 4 h",d:"Un sábado de 4 horas",ok:()=>db.acts.some(a=>a.key==="long"&&(a.min||0)>=240)},
 {id:"long5",ic:"mountain",n:"Fondo de 5 h",d:"Un sábado de 5 horas",ok:()=>db.acts.some(a=>a.key==="long"&&(a.min||0)>=300)},
 {id:"test3",ic:"clock",n:"Primer test",d:"Test de 3 km hecho",ok:()=>tests().length>=1},
 {id:"sub25",ic:"medal",n:"Sub 25",d:"5 km en menos de 25:00",ok:()=>tests().some(t=>t.km===5&&t.sec<1500)},
 {id:"sub24",ic:"medal",n:"Sub 24",d:"5 km en menos de 24:00",ok:()=>tests().some(t=>t.km===5&&t.sec<1440)},
 {id:"kg3",ic:"scale",n:"–3 kg",d:"Desde tu primer pesaje",ok:()=>weightDelta()<=-3},
 {id:"kg6",ic:"trophy",n:"–6 kg",d:"Desde tu primer pesaje",ok:()=>weightDelta()<=-6}
];
function checkBadges(){const nw=BADGES.filter(b=>b.ok()&&!db.seenBadges.includes(b.id));if(!nw.length)return;nw.forEach(b=>db.seenBadges.push(b.id));save();toast("Logro desbloqueado: "+nw.map(b=>b.n).join(", "),4000)}
const paceStr=s=>Math.floor(s/60)+":"+pad(Math.round(s%60));
function viewProgreso(){
 let h=segCtl("progreso",[["resumen","Resumen"],["act","Actividades"],["peso","Peso"],["logros","Logros"]],sub.progreso);
 const cw=Math.max(1,currentWeek());
 if(sub.progreso==="resumen"){
  const A=weekActs(cw),hrs=A.reduce((t,a)=>t+(a.min||0),0)/60,km=A.reduce((t,a)=>t+(a.km||0),0),el=A.reduce((t,a)=>t+(a.elev||0),0);
  h+=`<div class="card"><h3>Semana ${cw}</h3><div class="stats" style="margin-top:8px"><div><b>${weekSessionsDone(cw)}/5</b><span>Sesiones</span></div><div><b>${f1(hrs)} h</b><span>Tiempo</span></div><div><b>${f1(km)}</b><span>km</span></div><div><b>${Math.round(el)}</b><span>m D+</span></div></div></div>`;
  h+=`<div class="card"><h3>Horas: plan vs. hecho</h3><div id="hrsChart"></div><p class="sub small" style="margin:0">Barra hueca: plan. Barra llena: lo que hiciste.</p></div>`;
  const all=db.acts,T=all.reduce((t,a)=>t+(a.min||0),0)/60;
  h+=`<div class="card"><h3>Desde el inicio</h3><div class="stats" style="margin-top:8px"><div><b>${all.length}</b><span>Actividades</span></div><div><b>${f1(T)} h</b><span>Tiempo</span></div><div><b>${Math.round(bikeKm())}</b><span>km bici</span></div><div><b>${streakWeeks()}${ic("flame","ic-sm")}</b><span>Racha</span></div></div></div>`;
  const ts=tests(),b5=best5();
  h+=`<div class="card"><h3>Tests y ritmos</h3>${ts.length?`<ul class="dots">${ts.map(t=>`<li>${fmtD(parseD(t.date))}: ${t.lbl} en <b>${mmss(t.sec)}</b> (${paceStr(t.sec/t.km)}/km)</li>`).join("")}</ul>`:`<p class="sub">Tu primer test es en la semana 4. Con él calculo tus ritmos de entrenamiento.</p>`}
   ${isFinite(b5)?(()=>{const p=b5/5;return `<div class="sec-t" style="margin-top:6px">Tus ritmos de carrera</div><div class="phase-row"><div><span class="chip z2">Z2 suave</span> ${paceStr(p+75)} a ${paceStr(p+105)} /km</div></div><div class="phase-row"><div><span class="chip z3">Tempo</span> ${paceStr(p+20)} a ${paceStr(p+30)} /km</div></div><div class="phase-row"><div><span class="chip z4">Umbral</span> ${paceStr(p+8)} a ${paceStr(p+15)} /km</div></div><div class="phase-row"><div><span class="chip z5">VO2máx</span> ${paceStr(p-3)} a ${paceStr(p+3)} /km</div></div><p class="sub small">Calculados con tu mejor 5 km equivalente (${mmss(b5)}). En altura, guíate más por la sensación.</p>`})():""}</div>`;
 }else if(sub.progreso==="act"){
  h+=`<button class="btn ghost full" style="margin-bottom:10px" data-act="manual">+ Registrar actividad a mano</button>`;
  const list=db.acts.slice().sort((a,b)=>(b.date+b.ts)>(a.date+a.ts)?1:-1);
  if(!list.length)h+=`<div class="empty">Aquí aparecerán tus entrenamientos. Empieza el primero desde Entrenar.</div>`;
  list.forEach(a=>{h+=`<button class="card act" style="width:100%;text-align:left" data-act="editact" data-id="${a.id}"><div class="top">${catTile(a.key)}<div><b>Saulo</b><div class="sub">${DIAS[wdIdx(parseD(a.date))]} ${fmtD(parseD(a.date))}${a.w?", semana "+a.w:""}</div></div><span style="margin-left:auto;width:26px;height:26px;color:var(--ink3)" title="${FEEL_LBL[(a.feel||3)-1]}">${face(a.feel||3)}</span></div>
   <h3>${esc(a.title||KEY_NAME[a.key])}</h3>${a.notes?`<div class="sub">${esc(a.notes)}</div>`:""}
   <div class="nums"><div><b>${a.min?hm(a.min):"–"}</b><span>Tiempo</span></div>${a.km?`<div><b>${f1(a.km)} km</b><span>Distancia</span></div>`:""}${a.km&&a.min&&["run"].includes(a.key)?`<div><b>${paceStr(a.min*60/a.km)}</b><span>/km</span></div>`:a.km&&a.min?`<div><b>${f1(a.km/(a.min/60))}</b><span>km/h</span></div>`:""}${a.elev?`<div><b>${a.elev} m</b><span>D+</span></div>`:""}<div><b>${a.rpe||"–"}</b><span>RPE</span></div></div>
   ${a.test?`<div class="verdict v-g" style="margin-top:10px">${ic("clock","ic-sm")} Test ${esc(a.test.lbl)}: ${mmss(a.test.sec)}</div>`:""}</button>`});
 }else if(sub.progreso==="peso"){
  const ws=weightsSorted(),last=ws[ws.length-1];
  h+=`<div class="card"><h3>Registrar peso</h3><p class="sub">Los lunes en ayunas, después del baño.</p><div class="row" style="gap:8px"><input class="i" type="number" inputmode="decimal" step="0.1" id="wIn" placeholder="${last?last.kg:"75,0"}" style="flex:1"><button class="btn" data-act="addw">Guardar</button></div></div>`;
  h+=`<div class="card"><div class="row between"><h3>Tendencia</h3><span class="sub">Meta semana 16: 67 kg</span></div><div id="wChart"></div>${ws.length>1?`<p class="sub" style="margin:4px 0 0">Cambio total: <b>${weightDelta()>0?"+":""}${f1(weightDelta())} kg</b> en ${ws.length} pesajes.</p>`:""}</div>`;
  if(ws.length)h+=`<div class="card"><ul class="shop">${ws.slice().reverse().map(x=>`<li><span style="flex:1">${fmtD(parseD(x.date))}</span><b>${f1(x.kg)} kg</b><button class="link" data-act="delw" data-d="${x.date}" style="margin-left:12px">Borrar</button></li>`).join("")}</ul></div>`;
 }else{
  const n=BADGES.filter(b=>b.ok()).length;
  h+=`<div class="card"><h3>${n} de ${BADGES.length} logros</h3></div><div class="badges">${BADGES.map(b=>`<div class="badge${b.ok()?" on":""}"><span class="bi">${ic(b.ic)}</span>${esc(b.n)}<div class="sub" style="font-weight:500;font-size:.7rem">${esc(b.d)}</div></div>`).join("")}</div>`;
 }
 return h;
}
function drawBars(el){
 const cw=Math.max(1,currentWeek()),from=Math.max(1,cw-7),W=340,H=150,L=24,B=20,n=cw-from+1,bw=(W-L)/8;
 const done=w=>weekActs(w).reduce((t,a)=>t+(a.min||0),0)/60,mx=12,y=v=>(H-B)-(v/mx)*(H-B-8);
 const s=sv("svg",{viewBox:`0 0 ${W} ${H}`,width:"100%"});
 [0,5,10].forEach(v=>{s.appendChild(sv("line",{x1:L,x2:W,y1:y(v),y2:y(v),stroke:"var(--soft)"}));const t=sv("text",{x:L-4,y:y(v)+4,"text-anchor":"end","font-size":10,fill:"var(--ink3)"});t.textContent=v;s.appendChild(t)});
 for(let i=0;i<n;i++){const w=from+i,x=L+i*bw+6,pw=bw-12;
  s.appendChild(sv("rect",{x,y:y(weekHours(w)),width:pw,height:(H-B)-y(weekHours(w)),fill:"none",stroke:"var(--ink3)",rx:3}));
  const d=Math.min(done(w),mx);if(d>0)s.appendChild(sv("rect",{x:x+3,y:y(d),width:pw-6,height:(H-B)-y(d),fill:"var(--acc)",rx:2}));
  const t=sv("text",{x:x+pw/2,y:H-5,"text-anchor":"middle","font-size":10,fill:w===cw?"var(--acc)":"var(--ink3)","font-weight":700});t.textContent="S"+w;s.appendChild(t)}
 el.appendChild(s);
}
function drawWeight(el){
 const ws=weightsSorted();if(!ws.length){el.innerHTML=`<div class="empty">Tu primer pesaje aparecerá aquí.</div>`;return}
 const W=340,H=160,L=30,R2=8,T=10,B=20,vals=ws.map(x=>x.kg).concat([67]),mn=Math.floor(Math.min(...vals)-1),mx=Math.ceil(Math.max(...vals)+1);
 const x=i=>ws.length===1?(L+W-R2)/2:L+i*(W-L-R2)/(ws.length-1),y=v=>T+(mx-v)/(mx-mn)*(H-T-B);
 const s=sv("svg",{viewBox:`0 0 ${W} ${H}`,width:"100%"});
 for(let v=mn;v<=mx;v+=Math.max(1,Math.round((mx-mn)/4))){s.appendChild(sv("line",{x1:L,x2:W-R2,y1:y(v),y2:y(v),stroke:"var(--soft)"}));const t=sv("text",{x:L-4,y:y(v)+4,"text-anchor":"end","font-size":10,fill:"var(--ink3)"});t.textContent=v;s.appendChild(t)}
 s.appendChild(sv("line",{x1:L,x2:W-R2,y1:y(67),y2:y(67),stroke:"var(--ok)","stroke-dasharray":"5 4"}));
 s.appendChild(sv("polyline",{points:ws.map((e,i)=>x(i)+","+y(e.kg)).join(" "),fill:"none",stroke:"var(--acc)","stroke-width":2.5,"stroke-linejoin":"round"}));
 ws.forEach((e,i)=>s.appendChild(sv("circle",{cx:x(i),cy:y(e.kg),r:3.5,fill:"var(--card)",stroke:"var(--acc)","stroke-width":2})));
 el.appendChild(s);
}

/* ============ HOJAS DE DETALLE ============ */
function sheetSession(key,w,date){
 if(key==="mob"){openSheet(`<h2>Movilidad de 10 minutos</h2><div class="why-box">${ic("target")}<div><b>Para qué sirve</b>${esc(purposeOf("mob",w))}</div></div><ol class="steps">${MOBILITY.map(m=>`<li>${esc(m)}</li>`).join("")}</ol><button class="btn full" data-act="start" data-key="mob" data-w="${w}">${ic("play")} Hacerla guiada</button>`);return}
 const wd={run:1,str:2,bike:3,long:5,brick:6}[key],s=sessionFor(w,wd);if(!s)return;
 const wk=buildWorkout(key,w);
 openSheet(`<div class="row" style="gap:12px;margin-bottom:10px">${catTile(key)}<div><div class="sub">${DIAS[wd]}, semana ${w}, ${tstr(tmin(s.start))}</div><h2 style="margin:0">${esc(s.title)}</h2></div></div>
 <div class="why-box">${ic("target")}<div><b>Para qué sirve</b>${esc(purposeOf(key,w))}</div></div><div class="row" style="gap:8px;margin-bottom:6px">${chips(s.z)}<span class="sub">${hm(s.dur)}, ${wk.segs.length} pasos guiados</span></div>
 <button class="btn cta full" data-act="start" data-key="${key}" data-w="${w}" data-date="${date||planDate(w,wd)}">${ic("play")} Empezar guiado</button>
 <div class="card" style="margin-top:12px">${sessionBody(s,w)}</div>
 <details class="card"><summary style="font-weight:800">Ver los ${wk.segs.length} pasos</summary><ol class="steps small">${wk.segs.map(x=>`<li>${esc(x.l)} <span class="sub">${x.s?mmss(x.s):"a tu ritmo"}</span><div class="aporta">${esc(x.ex?EX_APORTA[x.ex]:x.rest?SEG_WHY.rest:SEG_WHY[x.z]||"")}</div></li>`).join("")}</ol></details>`);
}
function sheetDay(ds){
 const d=parseD(ds),wd=wdIdx(d),w=weekOfDate(ds),s=sessionFor(w,wd),ok=s&&doneSession(ds,s.key);
 openSheet(`<div class="sub">${w>=1&&w<=16?"Semana "+w:""}</div><h2>${DIAS[wd]} ${fmtD(d)}</h2>
 ${s?`<div class="card"><div class="row between"><div><b>${esc(s.title)}</b><div class="sub">${tstr(tmin(s.start))}, ${hm(s.dur)} ${chips(s.z)}</div></div>${ok?`<span class="check on">${ic("check")}</span>`:""}</div><div class="row" style="gap:8px;margin-top:10px"><button class="btn sm" data-act="start" data-key="${s.key}" data-w="${w}" data-date="${ds}">${ic("play")} Empezar</button><button class="btn sm ghost" data-act="sess" data-key="${s.key}" data-w="${w}">Ver sesión</button></div></div>`:`<div class="card"><b>Día de descanso</b><div class="sub">10 minutos de movilidad.</div></div>`}
 <div class="card"><ul class="tl">${dayBlocks(d).map(b=>tlItem(b,false)).join("")}</ul></div>`);
}
function sheetRecipe(id){
 const r=R[id];if(!r)return;const unit=["iso","barritas"].includes(id)?" por unidad":" por porción";
 openSheet(`<div class="sub">${esc(r.t)}</div><h2>${esc(r.n)}</h2><div class="recp"><div class="meta"><span><b>${esc(r.por)}</b></span><span>~${r.kcal} kcal${unit}</span>${r.p?`<span>${r.p} g proteína</span>`:""}<span>~S/ ${r.cost.toFixed(2)}${unit}</span></div>
 <div class="card"><h3>Ingredientes</h3><ul class="dots">${r.ing.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
 <div class="card"><h3>Preparación</h3><ol class="steps">${r.st.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
 <div class="card small"><b>Dato:</b> ${esc(r.tip)}</div></div>`);
}
function dosesFor(id){
 const out=[];for(let p=1;p<=4;p++){const src=[...STR[p].i,...PLYO[p],...CORE[p]].find(x=>x[0]===id);const day=STR[p].i.concat(CORE[p]).some(x=>x[0]===id)?"miércoles":"martes";if(src)out.push(`<li><b>${PHASES[p].n}</b>, ${day}: ${esc(src[1])}</li>`)}
 return out.join("")||"<li>Según la sesión.</li>";
}
function sheetExercise(id){
 const ex=EX[id];
 openSheet(`<div class="sub">${ex.cat}: ${esc(ex.mus)}</div><h2>${esc(ex.n)}</h2><div class="bigfig" id="bigfig"></div><div class="why-box">${ic("target")}<div><b>Qué te aporta</b>${esc(EX_APORTA[id]||"")}</div></div><p class="small muted">${esc(ex.why)}</p>
 <div class="card"><h3>Cómo hacerlo</h3><ol class="steps">${ex.how.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
 <div class="card"><h3>Errores comunes</h3><ul class="dots">${ex.err.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
 <div class="card"><h3>Ajustes</h3><ul class="dots"><li><b>Más fácil:</b> ${esc(ex.easy)}</li><li><b>Más difícil:</b> ${esc(ex.hard)}</li></ul></div>
 <div class="card"><h3>En tu plan</h3><ul class="dots">${dosesFor(id)}</ul></div>`,b=>addAnimated(b.querySelector("#bigfig"),id));
}
function sheetActivity(id){
 const a=id?db.acts.find(x=>x.id===id):{key:"other",date:todayIso()};if(!a)return;
 openSheet(`<h2>${id?"Editar actividad":"Registrar actividad"}</h2>${activityForm(a,false)}`,b=>bindActivityForm(b,false));
}
function sheetSettings(){
 const N=db.settings.notif,A=db.settings.alarms;
 const sw=(k,icn,t,d)=>`<label class="switch"><span class="row" style="gap:12px;align-items:flex-start">${ic(icn)}<span><b>${t}</b><br><span class="sub small">${d}</span></span></span><input type="checkbox" data-notif="${k}" ${N[k]?"checked":""}></label>`;
 openSheet(`<h2>Ajustes</h2>
 <div class="sec-t" style="margin-top:6px">${ic("alarm")}Alarmas</div>
 <div class="card"><p class="sub" style="margin-top:0">Se crean en el Reloj de tu teléfono: suenan aunque esté en silencio y aunque la app esté cerrada.</p>
 ${ALARM_SET.map(([k,lbl,,,icn])=>`<div class="alarm-row"><span class="cat sm cat-${k==="train"?"run":k==="rest"?"rest":k==="sat"?"long":"brick"}">${ic(icn)}</span><span><b style="font-weight:500">${lbl}</b></span><input type="time" data-alarm="${k}" value="${A[k]}"></div>`).join("")}
 <div class="row" style="gap:8px;margin-top:12px"><button class="btn" style="flex:1" data-act="mkalarms">${ic("alarm")} ${db.settings.alarmsSet?"Crear de nuevo":"Crear alarmas"}</button><button class="btn ghost" data-act="openalarms">Ver en el Reloj</button></div>
 ${db.settings.alarmsSet?`<p class="sub small" style="margin-bottom:0">Si cambias una hora, borra la alarma antigua en el Reloj para no tener dos.</p>`:""}</div>
 <div class="sec-t">${ic("bell")}Recordatorios</div>
 <div class="card"><div class="row between"><span class="sub">${LN?(notifGranted?"Permiso activado":"Sin permiso"):"Disponibles en la app de Android"}</span></div>
 ${LN&&!notifGranted?`<button class="btn full" style="margin:8px 0" data-act="asknotif">Dar permiso de notificaciones</button>`:""}
 ${sw("pre","alarm","Aviso sonoro antes de entrenar","10 minutos antes de cada sesión, con sonido de alarma")}
 ${sw("morning","sunrise","Qué toca hoy","Al despertar")}
 ${sw("evening","moon","Qué toca mañana","21:45, para dejar todo listo")}
 ${sw("thaw","pot","Comida del congelador","22:00, pasar a la refri lo de mañana")}
 ${sw("errands","cart","Compras y prep","Sábado 16:15 y domingo 15:15")}
 ${sw("weigh","scale","Pesarte","Lunes 7:02")}
 ${sw("review","chart","Revisión semanal","Domingo 17:30")}
 ${sw("water","drop","Agua","11:00 y 16:00")}
 <button class="btn ghost full" style="margin-top:12px" data-act="testnotif">Probar una notificación</button></div>
 <div class="sec-t">${ic("calendar")}Plan</div>
 <div class="card"><label class="f" style="margin-top:0">Empiezo el lunes</label><input class="i" type="date" id="setStart" value="${db.settings.start}"></div>
 <div class="sec-t">${ic("info")}Respaldo</div>
 <div class="card"><p class="sub" style="margin-top:0">Guarda una copia de tus datos o pásalos a otro teléfono.</p><div class="row" style="gap:8px"><button class="btn sm" data-act="export">Copiar respaldo</button><button class="btn sm ghost" data-act="import">Importar</button></div><textarea class="i" id="bk" rows="3" style="margin-top:10px" placeholder="Aquí aparece o se pega el respaldo"></textarea></div>
 <button class="btn ghost full" data-act="wipe" style="color:var(--bad)">Borrar todos mis datos</button>
 <p class="sub small" style="text-align:center;margin-top:14px">Ruta Saulo 1.2. Plan educativo: no reemplaza a un médico.</p>`,b=>{
  b.querySelector("#setStart").addEventListener("change",e=>{if(!e.target.value)return;db.settings.start=iso(mondayOf(parseD(e.target.value)));e.target.value=db.settings.start;save();scheduleReminders();toast("Empiezas el lunes "+fmtD(parseD(db.settings.start)));render()});
  b.addEventListener("change",e=>{const t=e.target;if(t.dataset.notif){db.settings.notif[t.dataset.notif]=t.checked;save();scheduleReminders()}else if(t.dataset.alarm&&t.value){db.settings.alarms[t.dataset.alarm]=t.value;save()}});
 });
}

function sheetOnboard(){
 openSheet(`<div class="logo">${ic("bike")}</div><h2 style="text-align:center">Hola, Saulo</h2>
 <p style="text-align:center" class="muted">Tu ruta de 16 semanas en una sola app.</p>
 <div class="card">${[["calendar","Hoy","Qué toca, comidas, agua y cómo amaneciste."],["play","Entrenar","Sesiones guiadas con temporizador, sonido y vibración."],["utensils","Comida","Menú, recetas, compras de S/ 100 y prep."],["chart","Progreso","Actividades, peso, tests y logros."],["alarm","Alarmas","Te despiertan y te avisan antes de cada sesión."]].map(([i,t,d])=>`<div class="row" style="gap:12px;padding:8px 0;align-items:flex-start">${ic(i)}<span><b>${t}</b><br><span class="sub">${d}</span></span></div>`).join("")}</div>
 <label class="f">¿Qué lunes empiezas?</label><input class="i" type="date" id="obStart" value="${db.settings.start}">
 ${LN?`<button class="btn cta full" style="margin-top:14px" data-act="obnotif">${ic("bell")} Activar recordatorios y alarmas</button>`:""}
 <button class="btn ${LN?"ghost ":""}full" style="margin-top:8px" data-act="obdone">${LN?"Ahora no":"Empezar"}</button>`);
}

/* ============ EVENTOS ============ */
document.addEventListener("click",async e=>{
 const navb=e.target.closest(".nav button");if(navb){tab=navb.dataset.tab;window.scrollTo(0,0);render();return}
 const sg=e.target.closest("[data-seg]");if(sg){const g=sg.dataset.seg,v=sg.dataset.v;if(g==="exf")exFilter=v;else sub[g]=v;render();return}
 const go=e.target.closest("[data-goto]");if(go){const [t,s]=go.dataset.goto.split(":");tab=t;if(s)sub[t]=s;render();window.scrollTo(0,0);return}
 const rc=e.target.closest("[data-rec]");if(rc){e.preventDefault();sheetRecipe(rc.dataset.rec);return}
 const ex=e.target.closest("[data-ex]");if(ex){e.preventDefault();sheetExercise(ex.dataset.ex);return}
 const b=e.target.closest("[data-act]");if(!b)return;
 const a=b.dataset.act;
 if(a==="start"){if($("#sheet").classList.contains("on"))closeTop();setTimeout(()=>startWorkout(b.dataset.key,+b.dataset.w||1,b.dataset.date),$("#sheet").classList.contains("on")?250:0)}
 else if(a==="sess")sheetSession(b.dataset.key,+b.dataset.w);
 else if(a==="day")sheetDay(b.dataset.day);
 else if(a==="openplayer")openPlayer();
 else if(a==="pmin")closeTop();
 else if(a==="pstop"){if(confirm("¿Terminar la sesión ahora?")){P.durs[P.idx]=Math.round(P.segEl/1000);finishWorkout()}}
 else if(a==="ppause")togglePause();
 else if(a==="pskip"){stepTime();advance(false);if(P)renderPlayer()}
 else if(a==="pdone"){stepTime();advance(false);if(P)renderPlayer()}
 else if(a==="pback")back();
 else if(a==="asknotif")askNotif();
 else if(a==="testnotif")testNotif();
 else if(a==="mkalarms")createAlarms();
 else if(a==="openalarms")openAlarms();
 else if(a==="wk"){planWeek=Math.max(1,Math.min(16,(planWeek||Math.max(1,currentWeek()))+ +b.dataset.d));render()}
 else if(a==="gowk"){planWeek=+b.dataset.w;sub.plan="semana";render()}
 else if(a==="water"){const ds=todayIso();db.water[ds]=Math.max(0,(db.water[ds]||0)+ +b.dataset.ml);save();render();if(db.water[ds]>=waterTarget(ds)&&+b.dataset.ml>0)toast("Meta de agua cumplida");checkBadges()}
 else if(a==="savecheck"){const box=$("#checkin");const c={sleep:+box.querySelector("#slR").value,energy:+box.querySelector("#enE [aria-pressed=true]").dataset.v,pain:+box.querySelector("#paE [aria-pressed=true]").dataset.v};db.checkins[todayIso()]=c;save();render();checkBadges()}
 else if(a==="recheck"){delete db.checkins[todayIso()];save();render()}
 else if(a==="manual")sheetActivity(null);
 else if(a==="editact")sheetActivity(b.dataset.id);
 else if(a==="delact"){if(confirm("¿Borrar esta actividad?")){db.acts=db.acts.filter(x=>x.id!==b.dataset.id);save();closeTop();render()}}
 else if(a==="addw"){const v=Number(($("#wIn").value||"").replace(",","."));if(!(v>30&&v<200)){toast("Escribe tu peso en kg");return}const ds=todayIso();db.weights=db.weights.filter(x=>x.date!==ds);db.weights.push({date:ds,kg:v});save();render();toast("Peso guardado");checkBadges()}
 else if(a==="delw"){db.weights=db.weights.filter(x=>x.date!==b.dataset.d);save();render()}
 else if(a==="shopreset"){db.shop={};save();render()}
 else if(a==="export"){const t=JSON.stringify(Object.assign({},db,{active:null}));$("#bk").value=t;try{await navigator.clipboard.writeText(t);toast("Respaldo copiado: pégalo en WhatsApp o en una nota")}catch(err){$("#bk").select();toast("Copia el texto de la caja")}}
 else if(a==="import"){try{const o=JSON.parse($("#bk").value);if(!o.settings||!Array.isArray(o.acts))throw 0;if(!confirm("Esto reemplaza tus datos actuales. ¿Seguir?"))return;localStorage.setItem(KEY,JSON.stringify(o));db=load();save();scheduleReminders();toast("Datos importados");closeTop();render()}catch(err){toast("El respaldo no es válido")}}
 else if(a==="wipe"){if(confirm("¿Borrar todo? No se puede deshacer.")){localStorage.removeItem(KEY);db=load();save();closeTop();render()}}
 else if(a==="obnotif"||a==="obdone"){const v=$("#obStart").value;if(v)db.settings.start=iso(mondayOf(parseD(v)));db.settings.onboarded=true;save();closeTop();if(a==="obnotif"){await askNotif();await createAlarms()}else{scheduleReminders();render()}}
});
document.addEventListener("change",e=>{
 const t=e.target;
 if(t.dataset.shop!=null){db.shop[t.dataset.shop]=t.checked;save();render()}
 else if(t.dataset.prep!=null){const k=iso(mondayOf(new Date()));db.prep[k]=db.prep[k]||{};db.prep[k][t.dataset.prep]=t.checked;save();render()}
});
function afterRender(){
 const ci=$("#checkin");
 if(ci){const r=ci.querySelector("#slR");r.addEventListener("input",()=>ci.querySelector("#slV").textContent=r.value.replace(".",","));
  ["#enE","#paE"].forEach(sel=>ci.querySelector(sel).addEventListener("click",e=>{const bb=e.target.closest("button");if(!bb)return;ci.querySelectorAll(sel+" button").forEach(x=>x.setAttribute("aria-pressed",x===bb))}));}
 $$("[data-fig]").forEach(el=>{const ex=EX[el.dataset.fig],f=buildFigure(ex);f.draw(fullPose(ex.poses[ex.poses.length-1]));el.appendChild(f.svg)});
 const hc=$("#hrsChart");if(hc)drawBars(hc);
 const wc=$("#wChart");if(wc)drawWeight(wc);
}
$("#btnSettings").addEventListener("click",sheetSettings);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"){if(P&&P.running){stepTime();if(!$("#player").hidden)renderPlayer()}scheduleReminders();if(!$("#sheet").classList.contains("on"))render()}});

/* ============ ARRANQUE ============ */
(async function boot(){
 render();
 if(!reduceMotion)requestAnimationFrame(tick);
 await notifSetup();
 if(resumeSaved()){render();toast("Tienes un entrenamiento en curso",3000);pLoop=setInterval(stepTime,1000)}
 if(!db.settings.onboarded)sheetOnboard();
 scheduleReminders();
 render();
})();
