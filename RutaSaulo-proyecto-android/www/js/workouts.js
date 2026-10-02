"use strict";
/* ============ SESIONES GUIADAS (segmentos con temporizador) ============
   Segmento: {l: texto, s: segundos (0 = manual, se termina con LISTO), z: zona 0-5, rest, ex: ejercicio, note, test, km} */
const SG=(l,min,z,x)=>Object.assign({l,s:Math.round(min*60),z},x||{});
const RS=(l,min)=>SG(l,min,1,{rest:true});
const MN=(l,z,x)=>Object.assign({l,s:0,z,manual:true},x||{});
function rep(n,arr){const out=[];for(let i=0;i<n;i++)arr.forEach(s=>out.push(Object.assign({},s,{l:s.l+(n>1?` (${i+1}/${n})`:"")})));if(out.length&&out[out.length-1].rest)out.pop();return out}
const testSeg=(km,lbl)=>[MN(`TEST ${lbl}: ritmo máximo y parejo. Toca LISTO al completar los ${lbl}`,5,{test:lbl,km})];
const RUN_SEG={
1:()=>rep(6,[SG("Trote suave Z2",3,2),RS("Caminando",1)]),
2:()=>rep(5,[SG("Trote Z2",5,2),RS("Caminando",1)]).concat([RS("Caminando",1)],rep(4,[SG("Progresivo hasta 80%",.25,4),RS("Caminando",.75)])),
3:()=>rep(3,[SG("Trote Z2",8,2),RS("Caminando",1)]).concat([RS("Caminando",1)],rep(6,[SG("Progresivo",1/3,4),RS("Caminando",2/3)])),
4:()=>testSeg(3,"3 km"),
5:()=>rep(6,[SG("Fuerte Z4",2,4),RS("Trote muy suave",2)]),
6:()=>rep(5,[SG("Fuerte Z4",3,4),RS("Trote muy suave",2)]),
7:()=>rep(2,[SG("Tempo Z3–Z4",10,4),RS("Trote muy suave",3)]),
8:()=>testSeg(5,"5 km"),
9:()=>rep(10,[SG("Muy fuerte Z5",1,5),RS("Trote muy suave",1)]),
10:()=>rep(6,[SG("Fuerte Z4–Z5",3,5),RS("Trote",2)]),
11:()=>rep(3,[SG("Umbral Z4",8,4),RS("Trote",2)]),
12:()=>testSeg(5,"5 km"),
13:()=>rep(5,[MN("1 km a ritmo de 5 km. LISTO al completar",4),RS("Trote",2)]),
14:()=>[SG("Tempo continuo Z3–Z4",20,4),RS("Trote",2)].concat(rep(4,[SG("Muy fuerte Z5",1,5),RS("Trote",1)])),
15:()=>rep(3,[MN("1,6 km a ritmo de 5 km. LISTO al completar",4),RS("Trote",3)]),
16:()=>testSeg(5,"5 km")
};
const BIKE_SEG={
1:()=>rep(6,[SG("Cadencia alta 100–110 rpm",1,2),RS("Z2 normal",2)]),
2:()=>rep(8,[SG("Cadencia alta 100–110 rpm",1,2),RS("Z2 normal",2)]),
3:()=>rep(3,[SG("Z3 sostenido",6,3),RS("Z1 suave",3)]),
4:()=>rep(4,[SG("Cadencia alta",.5,2),RS("Z2 suave",1.5)]),
5:()=>rep(3,[SG("Sweet spot Z3–Z4",8,4),RS("Z1 suave",4)]),
6:()=>rep(4,[SG("Sweet spot Z3–Z4",8,4),RS("Z1 suave",3)]),
7:()=>rep(2,[SG("Sweet spot Z3–Z4",15,4),RS("Z1 suave",5)]),
8:()=>rep(3,[SG("Z4",1,4),RS("Z1 suave",2)]),
9:()=>rep(5,[SG("Z5 en subida",3,5),RS("Bajando suave",3)]),
10:()=>rep(5,[SG("Z5",4,5),RS("Z1 suave",4)]),
11:()=>rep(3,[SG("Umbral Z4 en subida",10,4),RS("Z1 suave",5)]),
12:()=>rep(4,[SG("Sprint sentado",.5,5),RS("Z1 suave",3)]),
13:()=>rep(2,[SG("Z4",15,4),RS("Z1 suave",5)]),
14:()=>rep(8,[SG("Z5",.5,5),RS("Z1",.5)]).concat([RS("Z1 entre bloques",5)],rep(8,[SG("Z5",.5,5),RS("Z1",.5)])),
15:()=>rep(3,[SG("Z4",12,4),RS("Z1 suave",4)]),
16:()=>rep(3,[SG("Z4 para activar",1,4),RS("Z1 suave",2)])
};
const sumS=a=>a.reduce((t,s)=>t+s.s,0);
function parseSets(dose){const m=String(dose).match(/^(\d+)\s*×\s*(.*)$/);return m?{n:+m[1],rest:m[2]}:{n:1,rest:dose}}
function strengthSegs(list,restSec,deload){
 const out=[];
 list.forEach(([id,dose],ei)=>{
  const {n:n0,rest}=parseSets(dose),n=deload?Math.max(1,n0-1):n0;
  const hold=rest.match(/^(\d+)"/),perSide=/por lado/.test(rest);
  for(let i=1;i<=n;i++){
   const sides=perSide&&hold?["lado izquierdo","lado derecho"]:[null];
   sides.forEach(sd=>{
    const lbl=`${EX[id].n}: serie ${i}/${n}${sd?", "+sd:""}`;
    out.push(hold?SG(lbl,+hold[1]/60,1,{ex:id,note:"Mantén la posición"}):MN(lbl,1,{ex:id,note:/^\d+$/.test(rest)?rest+" repeticiones":rest}));
   });
   if(!(ei===list.length-1&&i===n))out.push(SG("Descanso",restSec/60,0,{rest:true,nextEx:id}));
  }
 });
 return out;
}
function buildWorkout(key,w){
 const p=phaseOf(w),dl=DELOAD.includes(w);let segs=[],alerts=[],title="",z=[2];
 if(key==="run"){
  const r=RUN[w];title=r.test?"Test de "+r.test:"Carrera + pliometría";z=r.z;
  segs=(w<=3?[SG("Caminata rápida",7,1),SG("Trote muy suave",5,1)]:[SG("Trote suave Z2",12,2)]);
  segs.push(SG("Movilidad: balanceos de pierna, tobillos y cadera",2,1));
  PLYO[p].forEach(([id,dose])=>segs.push(MN(`${EX[id].n}: ${dose}`,1,{ex:id,note:"60\" de pausa entre series. Toca LISTO al terminar todas."})));
  segs=segs.concat(RUN_SEG[w]());
  segs.push(SG("Vuelta a la calma: trote muy suave o caminata",8,1));
 }else if(key==="bike"){
  title="Bici de calidad";z=BIKE[w].z;
  const main=BIKE_SEG[w](),fill=BIKE[w].d*60-12*60-5*60-sumS(main);
  segs=[SG("Calentamiento: Z1 a Z2, cadencia de 80 a 95",12,2)].concat(main);
  if(fill>60)segs.push(SG("Z2 constante, cadencia 85–95",fill/60,2));
  segs.push(SG("Vuelta a la calma Z1",5,1));
 }else if(key==="str"){
  title=w===16?"Movilidad + core suave":"Fuerza + core en casa";z=[1];
  if(w===16){segs=mobilitySegs().concat(strengthSegs([["plancha","2 × 45\""],["lateral","2 × 30\" por lado"]],30,false))}
  else{
   segs=[MN("Calentamiento: 20 sentadillas sin peso, 10 puentes, 10 balanceos por pierna y 30\" de plancha",1)];
   segs=segs.concat(strengthSegs(STR[p].i,[60,75,90,90][p-1],dl));
   segs.push(SG("Pausa antes del core",1,0,{rest:true}));
   segs=segs.concat(strengthSegs(CORE[p],30,dl));
  }
 }else if(key==="long"){
  const t=SAT[w],tot=t.h*60;title=w===15?"Simulacro de 5 h":"Fondo en bici";z=t.z;
  segs=[SG("Calentamiento Z1–Z2, sin forzar",20,2),SG("Fondo",tot-30,Math.max(...t.z),{note:t.m}),SG("Últimos minutos suaves en Z1",10,1)];
  for(let m=30;m<tot-5;m+=30)alerts.push({t:m*60,msg:`Come y bebe: 1 barrita o 1 plátano y unos tragos de isotónico (${t.g} g/h).`});
 }else if(key==="brick"){
  const u=SUN[w];title="Bici + trote";
  segs=[SG("Bici en Z2, cadencia 85–95",u.b,2),MN("Transición: cámbiate y sal a trotar. Toca LISTO al salir",0),SG("Trote Z2"+(u.x?", "+u.x:""),u.r,2)];
  for(let m=30;m<u.b;m+=30)alerts.push({t:m*60,msg:"Come y bebe: media barrita y unos tragos de isotónico."});
 }else if(key==="mob"){title="Movilidad de 10 minutos";z=[1];segs=mobilitySegs()}
 return {key,w,title,z,segs,alerts};
}
function mobilitySegs(){return MOBILITY.map((m,i)=>SG(m,i===MOBILITY.length-1?1:1.5,1))}
function estMin(wk){return Math.round(wk.segs.reduce((t,s)=>t+(s.s||(s.test?(s.km*330):s.ex?50:90)),0)/60)}

/* ============ PARA QUÉ SIRVE CADA SESIÓN, EJERCICIO Y PASO ============ */
const PURPOSE={
 run:w=>RUN[w].test?"Mide tu progreso y recalcula tus ritmos de entrenamiento.":["","Readapta tendones y articulaciones al impacto, sin lesionarte.","Sube tu umbral: correr más rápido sin ahogarte.","Eleva tu VO2máx, el techo de tu motor aeróbico.","Afina el ritmo exacto de tus 5 km."][phaseOf(w)],
 str:w=>w===16?"Suelta el cuerpo sin cansarlo antes de la prueba final.":"Piernas y tronco más fuertes: más potencia al pedalear y menos lesiones al correr.",
 bike:w=>["","Pedaleo más suelto y eficiente: la base de todo lo demás.","Potencia sostenida para subidas largas.","Más potencia máxima y más aguante cerca del umbral.","Mantiene la chispa sin acumular fatiga."][phaseOf(w)],
 long:w=>w===15?"Ensayo general: ritmo, comida y cabeza para 5 horas con desnivel.":"Construye tu motor aeróbico y enseña al cuerpo a quemar grasa y a comer pedaleando.",
 brick:()=>"Suma fondo y te enseña a correr con las piernas cansadas de la bici.",
 mob:()=>"Devuelve movilidad a cadera y tobillos tras horas sentado: pedaleas y corres más suelto.",
 rest:()=>"Hoy el cuerpo asimila lo entrenado. Descansar también te hace más rápido."
};
const purposeOf=(key,w)=>(PURPOSE[key]||PURPOSE.rest)(Math.max(1,Math.min(16,w||1)));
const EX_APORTA={
 goblet:"Fuerza base de piernas para pedalear y amortiguar al correr.",
 bulgara:"Fuerza de una pierna a la vez: corrige desbalances y protege la rodilla.",
 pmr:"Isquios y glúteos fuertes, y mejor equilibrio sobre un pie.",
 puente:"Despierta el glúteo que se duerme de tanto estar sentado.",
 gemelos:"Blinda el tendón de Aquiles para volver a correr sin lesiones.",
 stepup:"Simula una subida: empujas todo tu peso con una sola pierna.",
 plancha:"Tronco firme que transmite la fuerza de las piernas.",
 lateral:"Pelvis estable al apoyar un pie: menos dolor de rodilla y cadera.",
 deadbug:"Controlas la espalda baja mientras mueves brazos y piernas.",
 pogo:"Pierna más elástica: el mismo ritmo te cuesta menos energía.",
 skipping:"Mejor técnica de zancada: rodilla arriba y pie debajo del cuerpo.",
 sjump:"Convierte la fuerza en potencia para arrancar y atacar.",
 boxjump:"Potencia con poco impacto, ideal mientras bajas de peso.",
 splitjump:"Potencia de una pierna y cambio rápido de apoyo."
};
const SEG_WHY={rest:"Recuperas para que el siguiente esfuerzo sea de calidad.",0:"Recuperas antes de la siguiente serie.",1:"Muy suave: calientas o recuperas.",2:"Suave: construyes el motor aeróbico.",3:"Moderado: aguante a ritmo sostenido.",4:"Fuerte: subes tu umbral.",5:"Muy fuerte: subes tu techo aeróbico."};
