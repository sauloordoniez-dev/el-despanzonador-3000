"use strict";
/* ============ PLAN ============ */
const ZONES=[
 {z:1,n:"Z1 Recuperación",rpe:"1–2",fc:"< 125 lpm",talk:"Conversas sin esfuerzo",use:"Calentar, enfriar, soltar piernas"},
 {z:2,n:"Z2 Fondo",rpe:"3–4",fc:"125–145 lpm",talk:"Hablas en frases completas",use:"El 80% de tu tiempo. Construye el motor y quema grasa"},
 {z:3,n:"Z3 Tempo",rpe:"5–6",fc:"146–164 lpm",talk:"Frases cortas",use:"Subidas largas, bloques tempo"},
 {z:4,n:"Z4 Umbral",rpe:"7–8",fc:"165–177 lpm",talk:"Solo palabras sueltas",use:"Intervalos de 3 a 15 min"},
 {z:5,n:"Z5 VO2máx",rpe:"9–10",fc:"> 178 lpm",talk:"No puedes hablar",use:"Repeticiones de 30\" a 4'"}
];
const RULES=[
 "El 80% del tiempo es suave (Z1–Z2). La intensidad solo funciona si los días suaves son de verdad suaves.",
 "Lunes y viernes no se entrena. El descanso es parte del plan, no un premio.",
 "Si dormiste menos de 6 h, estás enfermo o el pulso en reposo está 7+ lpm más alto de lo normal: cambia la sesión por 40' en Z2 o descansa.",
 "Si un día no puedes, no lo recuperes amontonando: sigues con lo que toca. Si se cae el miércoles, es la sesión que se sacrifica primero.",
 "Dolor que cambia tu forma de correr o pedalear = alto inmediato.",
 "Come en todo fondo de más de 75 minutos. El déficit para bajar de peso se hace en la cocina, no en la bici.",
 "Semanas 4, 8 y 12 son de descarga: menos volumen a propósito."
];
const PHASES={
 1:{n:"Base y readaptación",c:"var(--z2)",f:"Reconstruir tendones y motor aeróbico. Terminas cada sesión con ganas de más."},
 2:{n:"Construcción",c:"var(--z3)",f:"Entran el tempo y los primeros intervalos. Fondos de 3,5 a 4,5 h. La fuerza ya lleva carga."},
 3:{n:"Desarrollo",c:"var(--z4)",f:"El bloque duro: VO2máx, umbral y fondos de 5 h con desnivel."},
 4:{n:"Afinamiento",c:"var(--z5)",f:"Ritmo específico, simulacro de 5 h con 2000 m de desnivel y prueba final de 5 km."}
};
const phaseOf=w=>w<=4?1:w<=8?2:w<=12?3:4;
const DELOAD=[4,8,12];
/* Martes: carrera + pliometría */
const RUN={
1:{d:50,z:[2],m:["6 × (3' trote suave Z2 + 1' caminando)"],n:"Si el trote se siente pesado, alarga la caminata a 2'. Hoy solo despiertas piernas y tendones."},
2:{d:50,z:[2],m:["5 × (5' trote Z2 + 1' caminando)","4 progresivos de 15\": aceleras de suave a 80% y vuelves caminando"]},
3:{d:55,z:[2],m:["3 × (8' trote Z2 + 1' caminando)","6 progresivos de 20\""]},
4:{d:45,z:[2,4],test:"3 km",m:["TEST 3 km: corre 3 km al máximo ritmo que puedas sostener parejo. Anota tiempo, FC final y sensaciones."],n:"Semana de descarga."},
5:{d:55,z:[2,4],m:["6 × 2' en Z4 (recuperas 2' trotando muy suave)"]},
6:{d:55,z:[2,4],m:["5 × 3' en Z4 (recuperas 2' trotando)"]},
7:{d:60,z:[3,4],m:["2 × 10' tempo Z3 alto–Z4 bajo (recuperas 3' trotando)"]},
8:{d:50,z:[2,5],test:"5 km",m:["TEST 5 km: ritmo parejo, el último km lo vacías. Compara con tu marca de 25:00."],n:"Semana de descarga."},
9:{d:55,z:[5],m:["10 × 1' en Z5 (recuperas 1' trotando)"]},
10:{d:60,z:[4,5],m:["6 × 3' en Z4–Z5 (recuperas 2' trotando)"]},
11:{d:60,z:[4],m:["3 × 8' en umbral Z4 (recuperas 2' trotando)"]},
12:{d:50,z:[2,5],test:"5 km",m:["TEST 5 km. Objetivo: bajar al menos 40\" respecto a la semana 8."],n:"Semana de descarga."},
13:{d:60,z:[4,5],m:["5 × 1 km a ritmo objetivo de 5 km (recuperas 2' trotando)"]},
14:{d:65,z:[3,5],m:["20' tempo continuo Z3–Z4","4 × 1' en Z5 (recuperas 1')"]},
15:{d:65,z:[4,5],m:["3 × 1,6 km a ritmo objetivo de 5 km (recuperas 3')"]},
16:{d:45,z:[5],test:"5 km final",m:["PRUEBA FINAL 5 km. Meta retadora: menos de 24:00."]}
};
/* Miércoles: fuerza + core en casa */
const wedDur=w=>w===16?25:DELOAD.includes(w)?35:45;
/* Jueves: bici de calidad */
const BIKE={
1:{d:60,z:[2],m:["40' en Z2, llano, cadencia 85–95 rpm","Dentro: 6 × 1' a cadencia alta (100–110 rpm) sin subir la fuerza, recuperas 2'"]},
2:{d:60,z:[2],m:["40' en Z2","8 × 1' a cadencia alta (100–110 rpm), recuperas 2'"]},
3:{d:65,z:[2,3],m:["3 × 6' en Z3 (recuperas 3' en Z1)","Resto del tiempo en Z2"]},
4:{d:50,z:[2],m:["35' Z2 relajado","4 × 30\" a cadencia alta"],n:"Descarga."},
5:{d:65,z:[3,4],m:["3 × 8' en Z3 alto–Z4 bajo ('sweet spot'), recuperas 4'"]},
6:{d:70,z:[3,4],m:["4 × 8' sweet spot, recuperas 3'"]},
7:{d:70,z:[3,4],m:["2 × 15' sweet spot, recuperas 5'"]},
8:{d:50,z:[2,4],m:["35' Z2","3 × 1' en Z4, recuperas 2'"],n:"Descarga."},
9:{d:65,z:[5],m:["5 × 3' en Z5 en una subida, recuperas 3' bajando suave"]},
10:{d:70,z:[5],m:["5 × 4' en Z5, recuperas 4'"]},
11:{d:65,z:[4],m:["3 × 10' en umbral Z4, de preferencia en subida, recuperas 5'"]},
12:{d:50,z:[2,5],m:["35' Z2","4 × 30\" sprint sentado, recuperas 3'"],n:"Descarga."},
13:{d:65,z:[4],m:["2 × 15' en Z4, recuperas 5'"]},
14:{d:65,z:[5],m:["2 bloques de 8 × (30\" Z5 / 30\" Z1), 5' entre bloques","Completa con Z2"]},
15:{d:70,z:[4],m:["3 × 12' en Z4, recuperas 4'"]},
16:{d:45,z:[2,4],m:["35' Z2","3 × 1' en Z4 para activar"],n:"Semana de afinamiento."}
};
/* Sábado: fondo (sale 8:30) */
const SAT={
1:{h:2.5,z:[2],m:"2 h 30 en Z2, terreno llano u ondulado. Las cuestas se suben sentado y sin pasar de Z3.",g:"40–60"},
2:{h:3,z:[2,3],m:"3 h en Z2 con 1–2 subidas a ritmo controlado (Z3 como máximo).",g:"50–60"},
3:{h:3.5,z:[2,3],m:"3 h 30 en Z2. Los últimos 30' en Z3 para aprender a apretar cansado.",g:"60"},
4:{h:2.5,z:[2],m:"2 h 30 en Z2 relajado. Descarga.",g:"40–60"},
5:{h:3.5,z:[2,3],m:"3 h 30 en Z2 con 2 × 15' en Z3 en subida.",g:"60–70"},
6:{h:4,z:[2,3],m:"4 h en Z2 con 3 × 15' en Z3.",g:"60–70"},
7:{h:4.5,z:[2,3],m:"4 h 30 en Z2 buscando unos 1200 m de desnivel positivo a ritmo constante.",g:"70"},
8:{h:3,z:[2],m:"3 h en Z2. Descarga.",g:"60"},
9:{h:4.5,z:[2,4],m:"4 h 30 en Z2 con 2 × 20' en Z3 alto–Z4 bajo en subida.",g:"70–80"},
10:{h:5,z:[2,3],m:"5 h en Z2 con unos 1500 m de desnivel positivo.",g:"70–80"},
11:{h:5,z:[2,3],m:"5 h en Z2 con 3 × 20' tempo Z3.",g:"80"},
12:{h:3,z:[2],m:"3 h en Z2. Descarga.",g:"60"},
13:{h:5,z:[2,3],m:"5 h con unos 1800 m de desnivel. Z2 en llano, Z3 en las subidas.",g:"80–90"},
14:{h:5,z:[2,3],m:"5 h en Z2 y la última hora en Z3 sostenido: aprender a terminar fuerte.",g:"80–90"},
15:{h:5,z:[2,4],m:"SIMULACRO: 5 h con 2000 m de desnivel positivo. Ritmo de carrera en las subidas, comida de carrera (70–90 g/h).",g:"70–90"},
16:{h:3,z:[2],m:"3 h en Z2 relajado. Disfruta: llegaste.",g:"60"}
};
/* Domingo: bici + trote (sale 9:00, máx. 3 h) */
const SUN={
1:{b:90,r:10},2:{b:105,r:12},3:{b:120,r:15},4:{b:90,r:10},5:{b:120,r:20},6:{b:135,r:20},7:{b:150,r:25,x:"los últimos 5' de trote en Z3"},8:{b:90,r:15},
9:{b:135,r:25},10:{b:150,r:25},11:{b:140,r:30,x:"los últimos 10' de trote en Z3"},12:{b:90,r:15},13:{b:140,r:35},14:{b:135,r:40,x:"15' del trote en Z3"},15:{b:120,r:30,x:"todo suave: ayer fue el simulacro"},16:{b:120,r:20}
};
const STR={
1:{t:"fuerza base",rest:"60–75\" entre series",i:[["goblet","3 × 12"],["bulgara","2 × 8 por pierna"],["puente","3 × 15"],["pmr","2 × 8 por pierna"],["gemelos","3 × 12, bajando en 3\""]]},
2:{t:"fuerza con carga",rest:"75–90\" entre series",i:[["goblet","3 × 10 con mochila de 8–10 kg"],["bulgara","3 × 8 por pierna"],["stepup","3 × 8 por pierna"],["pmr","3 × 8 por pierna"],["gemelos","3 × 15 a una pierna"]]},
3:{t:"fuerza pesada y potencia",rest:"90–120\" entre series",i:[["bulgara","4 × 6 por pierna, mochila de 12 kg o más, bajada en 3\""],["stepup","3 × 6 por pierna, subida explosiva"],["pmr","3 × 6 por pierna con mochila"],["gemelos","3 × 12 a una pierna con mochila"]]},
4:{t:"mantenimiento",rest:"90\" entre series",i:[["bulgara","2 × 6 por pierna"],["stepup","2 × 6 por pierna"],["pmr","2 × 8 por pierna"],["gemelos","2 × 12 a una pierna"]]}
};
const PLYO={
1:[["pogo","2 × 10"],["skipping","2 × 20 m"]],
2:[["pogo","3 × 15"],["skipping","3 × 20 m"],["sjump","3 × 5"]],
3:[["pogo","3 × 20"],["skipping","2 × 20 m"],["boxjump","3 × 5"],["splitjump","3 × 6 (3 por pierna)"]],
4:[["pogo","2 × 15"],["skipping","2 × 20 m"],["boxjump","2 × 4"]]
};
const CORE={
1:[["plancha","3 × 30\""],["lateral","2 × 20\" por lado"],["deadbug","2 × 8 por lado"]],
2:[["plancha","3 × 45\""],["lateral","3 × 30\" por lado"],["deadbug","3 × 10 por lado"],["puente","3 × 10 a una pierna"]],
3:[["plancha","3 × 60\""],["lateral","3 × 40\" por lado"],["deadbug","3 × 12 por lado, lento"],["puente","2 × 12 a una pierna"]],
4:[["plancha","2 × 60\""],["lateral","2 × 40\" por lado"],["deadbug","2 × 10 por lado"]]
};
const MOBILITY=[
 "Rotaciones de cadera 90/90 sentado en el piso: 8 por lado, despacio.",
 "Estocada de flexor de cadera (rodilla atrás en el piso, glúteo apretado): 45\" por lado.",
 "Gato–camello en cuatro apoyos: 10 repeticiones respirando lento.",
 "Gemelo y sóleo contra la pared (pierna recta y luego rodilla flexionada): 30\" cada uno por pierna.",
 "Apertura torácica de lado (libro abierto): 8 por lado.",
 "Respiración 4-6 (inhalas 4\", exhalas 6\") durante 1 minuto."
];
function weekHours(w){return (RUN[w].d+wedDur(w)+BIKE[w].d+SUN[w].b+SUN[w].r)/60+SAT[w].h}
/* ============ EJERCICIOS (poses para la figura animada) ============
   Claves: h cabeza, s hombro, e/w codo/mano, p cadera, k/a/t rodilla/tobillo/punta.
   1 = lado cercano (oscuro), 2 = lado lejano (claro). Vista lateral, mira a la derecha. Suelo en y=186. */
const STAND={h:[100,38],s:[100,58],e1:[102,84],w1:[104,108],e2:[98,84],w2:[96,108],p:[100,110],k1:[102,147],a1:[100,182],k2:[98,147],a2:[98,182]};
const sh=(pose,dx,dy)=>{const o={};for(const k in pose)o[k]=[pose[k][0]+dx,pose[k][1]+dy];return o};
const EX={
goblet:{n:"Sentadilla goblet",cat:"Fuerza",mus:"Cuádriceps, glúteos, core",
 why:"Es la base de la fuerza para pedalear y para frenar el impacto al correr. Con la carga adelante, la espalda queda recta casi sola.",
 how:["Pies al ancho de hombros, puntas un poco abiertas. Abraza la mochila contra el pecho.","Baja sentándote entre los talones: rodillas siguen la línea de los pies, pecho alto.","Llega hasta que el muslo quede paralelo al piso o un poco más abajo.","Sube empujando el piso con todo el pie. Exhala al subir."],
 err:["Talones que se despegan del piso.","Rodillas que se juntan hacia adentro al subir.","Redondear la espalda baja al final de la bajada."],
 easy:"Siéntate y párate de una silla.",hard:"Más peso en la mochila o pausa de 2\" abajo.",
 poses:[{h:[100,38],s:[100,58],e1:[110,80],w1:[113,66],e2:[106,80],w2:[109,66],p:[100,110],k1:[103,147],a1:[100,182],k2:[99,147],a2:[97,182]},
        {h:[107,75],s:[100,93],e1:[117,108],w1:[121,94],e2:[113,108],w2:[117,94],p:[78,140],k1:[115,150],a1:[100,182],k2:[111,151],a2:[97,182]}],
 load:"w1",ms:1400},
bulgara:{n:"Sentadilla búlgara",cat:"Fuerza",mus:"Cuádriceps y glúteo de la pierna de adelante, estabilidad de cadera",
 why:"Trabaja cada pierna por separado, como cuando pedaleas y corres. Corrige desbalances y protege la rodilla.",
 how:["De espaldas a una banca o silla, apoya el empeine del pie de atrás encima.","El pie de adelante va lo bastante lejos para que, abajo, la rodilla quede encima del tobillo.","Baja recto, como un ascensor, hasta que la rodilla de atrás casi toque el piso.","Sube empujando con el talón de adelante. Termina todas las repeticiones y cambia de pierna."],
 err:["Pie de adelante demasiado cerca: la rodilla se va muy adelante.","Cadera que se inclina hacia un lado.","Rebotar abajo."],
 easy:"Zancada estática con los dos pies en el piso.",hard:"Mochila pesada y bajada en 3 segundos.",
 props:[{x:16,y:154,w:42,h:32}],
 poses:[{h:[92,40],s:[91,60],e1:[93,86],w1:[95,110],e2:[89,86],w2:[87,110],p:[90,112],k1:[110,147],a1:[121,182],t1:[133,185],k2:[74,146],a2:[42,152],t2:[30,154]},
        {h:[95,73],s:[92,91],e1:[94,117],w1:[96,141],e2:[90,117],w2:[88,141],p:[86,142],k1:[122,152],a1:[121,182],t1:[133,185],k2:[72,177],a2:[42,152],t2:[30,154]}],ms:1500},
pmr:{n:"Peso muerto rumano a una pierna",cat:"Fuerza",mus:"Isquiotibiales, glúteo, equilibrio del tobillo",
 why:"Fortalece la cadena posterior que usas en cada pedalada y en cada zancada, y mejora el equilibrio sobre un pie.",
 how:["De pie sobre una pierna con la rodilla apenas flexionada. Mochila o botella en la mano contraria.","Lleva la cadera hacia atrás mientras la otra pierna sube estirada detrás de ti.","El cuerpo baja como un balancín: espalda recta, cadera mirando al piso.","Baja hasta sentir el estiramiento atrás del muslo y vuelve apretando el glúteo."],
 err:["Abrir la cadera hacia un costado (gira el ombligo).","Encorvar la espalda para llegar más abajo.","Bloquear la rodilla de apoyo."],
 easy:"Apoya la punta del pie de atrás en el piso o sujétate de una pared.",hard:"Más carga y pausa de 1\" abajo.",
 poses:[{h:[100,38],s:[100,58],e1:[101,84],w1:[101,110],e2:[99,84],w2:[99,110],p:[100,110],k1:[102,147],a1:[100,182],k2:[97,147],a2:[93,178],t2:[104,182]},
        {h:[168,96],s:[150,100],e1:[151,126],w1:[152,150],e2:[148,126],w2:[148,150],p:[100,108],k1:[106,145],a1:[100,182],k2:[63,104],a2:[27,100],t2:[24,111]}],
 load:"w1",ms:1700},
puente:{n:"Puente de glúteo",cat:"Fuerza",mus:"Glúteo mayor, isquiotibiales",
 why:"Activa el glúteo, que suele 'dormirse' después de horas sentado en la oficina. Un glúteo fuerte protege rodillas y espalda baja.",
 how:["Boca arriba, rodillas flexionadas, pies apoyados al ancho de cadera.","Aprieta el glúteo y sube la cadera hasta formar una línea recta de hombros a rodillas.","Sostén 2\" arriba sin arquear la espalda baja.","Baja lento. En la versión a una pierna, la otra queda estirada en el aire."],
 err:["Subir arqueando la zona lumbar en vez de usar el glúteo.","Empujar con las puntas: el peso va en los talones."],
 easy:"Rango corto y más pausa arriba.",hard:"A una pierna o con mochila sobre la cadera.",
 poses:[{h:[30,172],s:[48,180],e1:[72,183],w1:[94,184],e2:[70,183],w2:[92,184],p:[100,180],k1:[126,150],a1:[140,181],t1:[152,184],k2:[124,151],a2:[137,181],t2:[149,184]},
        {h:[30,172],s:[48,180],e1:[72,183],w1:[94,184],e2:[70,183],w2:[92,184],p:[92,150],k1:[130,146],a1:[140,181],t1:[152,184],k2:[128,147],a2:[137,181],t2:[149,184]}],ms:1300},
gemelos:{n:"Elevación de talones en escalón",cat:"Fuerza",mus:"Gemelos, sóleo, tendón de Aquiles",
 why:"El tendón de Aquiles es lo que más sufre al volver a correr con peso extra. Esta es tu póliza de seguro.",
 how:["Parado en el borde de un escalón con la parte delantera del pie. Sujétate de una pared.","Baja el talón por debajo del escalón en 3 segundos.","Sube lo más alto que puedas sobre la punta en 1 segundo.","Haz también series con la rodilla un poco flexionada para trabajar el sóleo."],
 err:["Rebotar abajo.","Rango corto: sube y baja completo."],
 easy:"En el piso y con los dos pies.",hard:"A una pierna con mochila.",
 props:[{x:92,y:168,w:60,h:18}],
 poses:[{h:[92,28],s:[92,48],e1:[94,74],w1:[96,98],e2:[90,74],w2:[88,98],p:[92,100],k1:[93,136],a1:[90,172],t1:[102,168],k2:[91,136],a2:[89,172],t2:[101,168]},
        {h:[96,12],s:[96,32],e1:[98,58],w1:[100,82],e2:[94,58],w2:[92,82],p:[96,84],k1:[97,120],a1:[96,155],t1:[102,168],k2:[95,120],a2:[95,155],t2:[101,168]}],ms:1500},
stepup:{n:"Subida al cajón (step-up)",cat:"Fuerza",mus:"Cuádriceps, glúteo, potencia de cadera",
 why:"Es lo más parecido a una subida en bici o a una cuesta corriendo: empujas tu peso con una sola pierna.",
 how:["Frente a un escalón o banca firme de altura de rodilla. Apoya un pie completo arriba.","Empuja con la pierna de arriba (no te impulses con la de abajo) hasta quedar de pie.","Sube la rodilla libre al frente como en un paso de carrera.","Baja controlado con la misma pierna y repite."],
 err:["Impulsarse con el pie del piso.","Rodilla de apoyo que se va hacia adentro.","Cajón inestable: revisa que no se mueva."],
 easy:"Escalón más bajo.",hard:"Mochila pesada o subida explosiva.",
 props:[{x:118,y:140,w:60,h:46}],
 poses:[{h:[101,38],s:[100,56],e1:[104,82],w1:[110,104],e2:[96,82],w2:[92,104],p:[98,108],k1:[132,100],a1:[132,137],t1:[144,140],k2:[98,145],a2:[96,182]},
        {h:[135,-5],s:[134,13],e1:[150,30],w1:[168,20],e2:[118,32],w2:[110,52],p:[133,65],k1:[134,101],a1:[132,137],t1:[144,140],k2:[166,78],a2:[160,112],t2:[172,114]}],ms:1500},
plancha:{n:"Plancha frontal",cat:"Core",mus:"Abdomen profundo, hombros",
 why:"Un tronco firme transmite la fuerza de las piernas a los pedales y evita que la cadera se mueva de más al correr.",
 how:["Antebrazos en el piso, codos debajo de los hombros.","Cuerpo en línea recta de cabeza a talones.","Aprieta glúteos y lleva el ombligo hacia la columna.","Respira normal. Si la cadera cae, terminó la serie."],
 err:["Cadera muy alta o muy baja.","Aguantar la respiración.","Mirar al frente tensando el cuello."],
 easy:"Rodillas apoyadas.",hard:"Levanta un pie 5\" alternando.",hold:true,
 poses:[{h:[168,140],s:[150,150],e1:[150,178],w1:[172,180],e2:[146,178],w2:[168,180],p:[99,157],k1:[61,165],a1:[24,173],t1:[22,184],k2:[61,166],a2:[24,174],t2:[22,185]},
        {h:[168,139],s:[150,149],e1:[150,178],w1:[172,180],e2:[146,178],w2:[168,180],p:[99,156],k1:[61,165],a1:[24,173],t1:[22,184],k2:[61,166],a2:[24,174],t2:[22,185]}],ms:1800},
lateral:{n:"Plancha lateral",cat:"Core",mus:"Oblicuos, glúteo medio",
 why:"El glúteo medio y los oblicuos estabilizan la pelvis cuando apoyas un solo pie al correr. Menos dolor de rodilla y de cadera.",
 how:["De lado, codo debajo del hombro, piernas estiradas y pies apilados.","Sube la cadera hasta formar una línea recta.","La mano de arriba en la cintura.","Sostén el tiempo indicado y cambia de lado."],
 err:["Dejar caer la cadera.","Rotar el pecho hacia el piso."],
 easy:"Rodillas flexionadas y apoyadas.",hard:"Sube y baja la cadera lento o levanta la pierna de arriba.",
 poses:[{h:[27,152],s:[45,156],e1:[45,184],w1:[68,184],e2:[62,140],w2:[86,156],p:[96,176],k1:[133,180],a1:[170,182],t1:[173,185],k2:[133,179],a2:[170,181],t2:[173,184]},
        {h:[27,152],s:[45,156],e1:[45,184],w1:[68,184],e2:[62,140],w2:[90,152],p:[96,167],k1:[133,174],a1:[170,182],t1:[173,185],k2:[133,173],a2:[170,181],t2:[173,184]}],ms:1600},
deadbug:{n:"Dead bug (bicho muerto)",cat:"Core",mus:"Abdomen profundo, coordinación cruzada",
 why:"Enseña a mover brazos y piernas sin que la zona lumbar se arquee. Es el patrón exacto de correr con el tronco estable.",
 how:["Boca arriba, brazos apuntando al techo, rodillas a 90° encima de la cadera.","Pega la espalda baja al piso y no la despegues.","Extiende el brazo de un lado y la pierna del lado contrario, lento, casi hasta el piso.","Vuelve al centro y cambia de lado. Exhala al extender."],
 err:["Arquear la espalda baja.","Hacerlo rápido."],
 easy:"Mueve solo las piernas.",hard:"Sostén 3\" en la extensión.",
 poses:[{h:[30,170],s:[48,178],e1:[50,152],w1:[52,128],e2:[46,152],w2:[46,128],p:[100,178],k1:[102,140],a1:[138,140],t1:[141,128],k2:[100,141],a2:[136,141],t2:[139,129]},
        {h:[30,170],s:[48,178],e1:[26,168],w1:[5,160],e2:[46,152],w2:[46,128],p:[100,178],k1:[102,140],a1:[138,140],t1:[141,128],k2:[137,170],a2:[173,176],t2:[185,170]}],ms:1700},
pogo:{n:"Saltos de tobillo (pogo)",cat:"Pliometría",mus:"Tendón de Aquiles, pie, rigidez elástica",
 why:"Enseña a tu pierna a rebotar como un resorte. Mejora la economía de carrera: el mismo ritmo te cuesta menos.",
 how:["De pie, piernas casi rectas, peso en la parte delantera del pie.","Salta pequeño y rápido usando solo los tobillos.","Contacto con el piso lo más corto posible, como si quemara.","Brazos relajados acompañando el ritmo."],
 err:["Flexionar mucho las rodillas.","Aterrizar con el talón.","Saltar alto en vez de rápido."],
 easy:"Saltos más bajos y menos repeticiones.",hard:"A una pierna.",
 poses:[{h:[100,38],s:[100,58],e1:[104,82],w1:[112,96],e2:[96,82],w2:[104,96],p:[100,110],k1:[102,146],a1:[100,178],t1:[112,186],k2:[98,146],a2:[98,178],t2:[110,186]},
        {h:[100,20],s:[100,40],e1:[104,64],w1:[112,78],e2:[96,64],w2:[104,78],p:[100,92],k1:[101,129],a1:[100,164],t1:[110,173],k2:[99,129],a2:[98,164],t2:[108,173]}],ms:380},
sjump:{n:"Sentadilla con salto",cat:"Pliometría",mus:"Cuádriceps, glúteos, potencia",
 why:"Convierte la fuerza que ganas en la goblet en potencia: arrancar, atacar una subida, cambiar de ritmo.",
 how:["Baja a media sentadilla con los brazos atrás.","Explota hacia arriba lanzando los brazos al techo.","Aterriza suave sobre la parte delantera del pie y amortigua bajando.","Reinicia cada salto: calidad antes que cantidad."],
 err:["Aterrizar con las piernas rígidas.","Rodillas hacia adentro al caer."],
 easy:"Sin salto: sube rápido a puntas de pie.",hard:"Salto más alto con pausa abajo.",
 poses:[{h:[107,75],s:[100,93],e1:[86,112],w1:[70,124],e2:[84,112],w2:[68,122],p:[78,140],k1:[115,150],a1:[100,182],k2:[111,151],a2:[97,182]},
        {h:[100,14],s:[100,34],e1:[104,10],w1:[108,-12],e2:[96,10],w2:[98,-12],p:[100,86],k1:[101,123],a1:[100,158],t1:[108,168],k2:[99,123],a2:[98,158],t2:[106,168]}],ms:800},
boxjump:{n:"Salto al cajón",cat:"Pliometría",mus:"Potencia de piernas, aterrizaje",
 why:"Potencia con menos impacto que otros saltos, porque aterrizas en alto. Ideal mientras sigues bajando de peso.",
 how:["Frente a un escalón o banca firme de 30–45 cm.","Media sentadilla con brazos atrás.","Salta y aterriza con los dos pies completos, en cuclillas suaves.","Baja caminando, nunca saltando hacia atrás."],
 err:["Cajón demasiado alto.","Caer con las rodillas hacia adentro.","Hacerlo con fatiga: aquí cada salto debe ser fresco."],
 easy:"Escalón bajo.",hard:"Cajón más alto.",
 props:[{x:128,y:146,w:52,h:40}],
 poses:[{h:[89,75],s:[82,93],e1:[68,112],w1:[52,124],e2:[66,112],w2:[50,122],p:[60,140],k1:[97,150],a1:[82,182],k2:[93,151],a2:[79,182]},
        {h:[124,24],s:[118,42],e1:[134,30],w1:[150,14],e2:[130,30],w2:[146,14],p:[100,90],k1:[128,104],a1:[124,138],k2:[124,106],a2:[120,140]},
        {h:[148,35],s:[142,52],e1:[160,70],w1:[180,60],e2:[156,70],w2:[176,60],p:[126,100],k1:[160,112],a1:[150,144],k2:[157,113],a2:[147,144]}],ms:650},
skipping:{n:"Skipping A",cat:"Pliometría",mus:"Flexores de cadera, técnica de zancada",
 why:"Ejercicio técnico de carrera: rodilla arriba, pie que cae debajo del cuerpo y brazos coordinados.",
 how:["Avanza lento mientras subes una rodilla a la altura de la cadera.","El pie cae debajo de la cadera, apoyando la parte delantera.","Brazo contrario adelante, codo a 90°.","Ritmo rápido, avance corto, tronco alto."],
 err:["Inclinarse hacia atrás.","Pies que caen adelante del cuerpo."],
 easy:"Solo marcha con rodilla alta, sin saltito.",hard:"Más rápido.",
 poses:[{h:[100,36],s:[100,56],e1:[86,78],w1:[84,100],e2:[112,78],w2:[130,72],p:[100,108],k1:[134,100],a1:[128,134],t1:[140,136],k2:[101,145],a2:[99,180],t2:[111,185]},
        {h:[100,36],s:[100,56],e1:[112,78],w1:[130,72],e2:[86,78],w2:[84,100],p:[100,108],k1:[101,145],a1:[99,180],t1:[111,185],k2:[134,100],a2:[128,134],t2:[140,136]}],ms:420},
splitjump:{n:"Zancada con salto",cat:"Pliometría",mus:"Cuádriceps, glúteo, coordinación",
 why:"Potencia unilateral y cambio rápido de pierna. Muy exigente: solo en la fase de desarrollo.",
 how:["Empieza en zancada: pierna de adelante a 90°, la de atrás casi tocando el piso.","Salta explosivo hacia arriba.","En el aire cambia las piernas.","Aterriza suave en zancada con la otra pierna adelante."],
 err:["Aterrizar con la rodilla de adelante pasando mucho la punta del pie.","Perder el tronco recto."],
 easy:"Zancada alterna sin salto.",hard:"Más altura y menos contacto con el piso.",
 poses:[{h:[99,70],s:[98,88],e1:[86,112],w1:[80,134],e2:[110,110],w2:[118,92],p:[96,140],k1:[128,148],a1:[126,182],t1:[138,186],k2:[80,170],a2:[52,172],t2:[62,184]},
        {h:[101,26],s:[100,44],e1:[100,70],w1:[102,92],e2:[98,70],w2:[96,92],p:[98,96],k1:[110,128],a1:[104,162],t1:[114,168],k2:[88,128],a2:[86,162],t2:[96,168]},
        {h:[99,70],s:[98,88],e1:[110,110],w1:[118,92],e2:[86,112],w2:[80,134],p:[96,140],k1:[80,170],a1:[52,172],t1:[62,184],k2:[128,148],a2:[126,182],t2:[138,186]}],ms:600}
};
const EX_ORDER=["goblet","bulgara","pmr","puente","gemelos","stepup","plancha","lateral","deadbug","pogo","skipping","sjump","boxjump","splitjump"];
/* ============ COMIDA ============ */
const TARGETS=[
 {k:"Ritmo de bajada",v:"~0,5 kg/sem",d:"El 0,7% de tu peso por semana: protege el músculo. Meta de la semana 16: ~67 kg."},
 {k:"Proteína diaria",v:"120–150 g",d:"Huevo, pollo, sangrecita, lentejas y leche en cada comida principal."},
 {k:"Carbohidrato",v:"según el día",d:"Lunes y viernes: porción chica. Martes a jueves: normal. Viernes noche y fin de semana: grande."},
 {k:"Agua",v:"2,5 L + entreno",d:"Más 500–750 ml por hora de entrenamiento. Orina color paja clara = bien."}
];
const WEIGHT_NOTE="Sobre la meta de 55–60 kg: con 1,71 m, 55 kg es un IMC de 18,8, al borde del bajo peso. Primera meta: ~67 kg en 16 semanas. Ajuste: si dos lunes seguidos no baja, quita ½ taza de arroz en las cenas de lunes y viernes. Si bajas más de 1 kg por semana o te sientes sin fuerza, suma 1 plátano y ½ taza de arroz al día.";
const R={
avena:{n:"Avena de fondo",t:"Desayuno",por:"1 porción",kcal:700,p:31,cost:2.8,
 ing:["70 g de avena (7 cucharadas colmadas); 90 g el sábado","250 ml de leche (o 150 ml de leche + 100 ml de agua)","1 plátano en rodajas","1 cucharadita de panela","Canela","2 huevos sancochados (de la prep del domingo)"],
 st:["Hierve la leche con la canela.","Agrega la avena y mueve 5 minutos a fuego bajo hasta que espese.","Apaga, agrega el plátano y la panela.","Acompaña con los 2 huevos."],
 tip:"El sábado cómela 1 h 15 antes de salir."},
panq:{n:"Panqueques de avena y plátano",t:"Desayuno",por:"1 porción (4 panqueques)",kcal:470,p:22,cost:2.0,
 ing:["60 g de avena","2 huevos","1 plátano bien maduro","Canela y una pizca de sal","Unas gotas de aceite"],
 st:["Licúa la avena en seco hasta que sea harina.","Agrega huevos, plátano, canela y sal; licúa 20 segundos.","Sartén a fuego medio con unas gotas de aceite.","Vierte un cucharón, 2–3 minutos hasta que salgan burbujas, voltea 1 minuto más.","Sirve con fruta picada y 1 huevo."],
 tip:"Desayuno de domingo, sin apuro."},
revuelto:{n:"Revuelto de espinaca y papa",t:"Desayuno",por:"1 porción",kcal:480,p:23,cost:2.4,
 ing:["3 huevos","2 papas sancochadas (de la prep del domingo)","Un puñado grande de espinaca","½ zanahoria rallada","1 cucharadita de aceite, sal, pimienta y orégano"],
 st:["Dora las papas en rodajas con el aceite 4 minutos.","Agrega la zanahoria rallada y la espinaca 1 minuto.","Echa los huevos batidos con sal y orégano y mueve hasta que cuajen."],
 tip:"Listo en 10 minutos."},
lentejas:{n:"Lentejas con arroz y huevo",t:"Almuerzo",por:"3 porciones",kcal:750,p:35,cost:2.0,
 ing:["300 g de lentejas","3 tazas de arroz cocido (de la olla de la semana)","Aderezo: ¼ de cebolla picada muy fina, 3 ajos y 1 cucharada de ají panca","1 zanahoria en cubos","1 cucharada de aceite, comino y sal","1 huevo por porción","Ensalada: lechuga, pepino y zanahoria rallada con limón"],
 st:["Deja las lentejas en remojo desde la mañana.","Aderezo: cebolla, ajo y ají en el aceite 6 minutos, hasta que la cebolla se deshaga.","Agrega la zanahoria y las lentejas con agua que las cubra tres dedos.","Cocina 30–40 minutos a fuego medio hasta que estén suaves. Sal al final.","Reparte en 3 tuppers con arroz. El huevo se fríe o sancocha el mismo día."],
 tip:"Exprime limón encima: ayuda a absorber el hierro."},
dorado:{n:"Pollo dorado con papas",t:"Almuerzo",por:"2 porciones",kcal:620,p:40,cost:4.4,
 ing:["2 piernas enteras de pollo (~600 g)","500 g de papa","2 ajos molidos, comino, jugo de 1 limón, sal y pimienta","1 cucharadita de aceite","Ensalada: lechuga, pepino y zanahoria rallada con limón"],
 st:["Adoba el pollo con ajo, comino, limón, sal y pimienta (desde el sábado en la noche si puedes).","Sancocha las papas con cáscara 15 minutos.","Sartén con el aceite, pollo con la piel abajo, tapa y cocina 25 minutos volteando a la mitad.","Destapa los últimos 5 minutos para dorar.","Dora las papas en la grasa que soltó el pollo."],
 tip:"Se cocina el domingo al mediodía: una porción la comes y la otra es el almuerzo del martes."},
sangrecita:{n:"Sangrecita con camote",t:"Cena",por:"2 porciones",kcal:650,p:30,cost:2.4,
 ing:["500 g de sangrecita de pollo (en el mercado la venden cocida)","Aderezo: ¼ de cebolla picada muy fina, 3 ajos, 1 cucharada de ají amarillo o panca","Hierbabuena o culantro picado","1 cucharada de aceite, sal y limón","400 g de camote sancochado y 1 taza de arroz cocido"],
 st:["Lava la sangrecita, escúrrela y desmenúzala con un tenedor.","Aderezo en el aceite 6 minutos.","Agrega la sangrecita y cocina 8–10 minutos moviendo hasta que se seque.","Termina con hierbabuena y limón.","Sirve con camote y arroz."],
 tip:"De lo más rico en hierro que hay y muy barato. El hierro lleva el oxígeno a tus músculos."},
verde:{n:"Arroz verde con pollo",t:"Almuerzo",por:"2 porciones",kcal:650,p:38,cost:3.6,
 ing:["400 g de pollo en presas","160 g de arroz","1 atado de culantro + un puñado de espinaca","Aderezo: ¼ de cebolla muy fina y 2 ajos","1 zanahoria en cubos","1 cucharada de aceite, comino y sal"],
 st:["Licúa el culantro y la espinaca con ½ taza de agua.","Dora las presas 5 minutos por lado y retíralas.","Aderezo en la misma olla; agrega el licuado verde 3 minutos.","Vuelve el pollo, 2½ tazas de agua y hierve 15 minutos.","Agrega arroz lavado y zanahoria, tapa y cocina 20–25 minutos a fuego bajo."],
 tip:"Congela las 2 porciones: son el almuerzo de jueves y viernes."},
salteado:{n:"Salteado de pollo con vainita",t:"Almuerzo",por:"1 porción",kcal:560,p:35,cost:3.0,
 ing:["150 g de pollo deshuesado en tiras","1 taza de vainita en trozos","1 zanahoria en tiras","1 ajo y un trocito de kion rallado","1 cucharadita de aceite, sillao (opcional) y sal","1 taza de arroz cocido"],
 st:["Sancocha la vainita 4 minutos.","Sartén muy caliente: dora el pollo con ajo, kion y sal 4 minutos.","Agrega zanahoria y vainita 2 minutos a fuego fuerte.","Un chorrito de sillao y sirve sobre el arroz."],
 tip:"15 minutos, perfecto al volver del fondo del sábado."},
sopa:{n:"Sopa de pollo y verduras",t:"Cena",por:"2 porciones",kcal:400,p:26,cost:2.4,
 ing:["300 g de pollo (1 presa + huesitos)","2 papas, 1 zanahoria y 200 g de zapallo en trozos","90 g de fideo cabello de ángel","Culantro o hierbabuena, 1 ajo y sal","1,5 L de agua"],
 st:["Hierve el pollo con el ajo 25 minutos y retira la espuma.","Agrega papa, zanahoria y zapallo 15 minutos.","Suma el fideo 8 minutos.","Desmenuza el pollo y termina con culantro."],
 tip:"Cena del lunes y del miércoles."},
tortilla:{n:"Tortilla de espinaca y zanahoria",t:"Cena",por:"1 porción",kcal:480,p:22,cost:2.0,
 ing:["3 huevos","Un puñado grande de espinaca","½ zanahoria rallada","1 papa sancochada en cubitos","1 cucharadita de aceite, sal y pimienta","200 g de camote sancochado"],
 st:["Saltea zanahoria y papa 3 minutos; agrega la espinaca 1 minuto.","Vierte los huevos batidos con sal, tapa y cocina 5–6 minutos a fuego bajo.","Voltéala con un plato y cocina 1 minuto más.","Sirve con el camote."],
 tip:"10 minutos. Para las noches en que llegas tarde."},
iso:{n:"Isotónico casero",t:"En la bici",por:"1 bidón de 750 ml",kcal:180,p:0,cost:0.25,
 ing:["750 ml de agua","3 cucharadas (45 g) de azúcar rubia o panela","¼ de cucharadita de sal","Jugo de ½ limón"],
 st:["Disuelve azúcar y sal en un poco de agua tibia.","Completa con agua fría y limón. Agita."],
 tip:"45 g de carbohidrato y el sodio que pierdes al sudar."},
barritas:{n:"Barritas de avena y plátano",t:"En la bici",por:"8 barritas",kcal:170,p:4,cost:0.35,
 ing:["250 g de avena","3 plátanos muy maduros","4 cucharadas de panela o miel","1 huevo","Canela y una pizca de sal"],
 st:["Aplasta los plátanos y mezcla con huevo, panela, canela y sal.","Agrega la avena hasta tener una masa pegajosa.","Con horno: fuente de 2 cm de alto, 25 minutos a 180 °C.","Sin horno: sartén tapada a fuego bajo, 10 minutos por lado.","Corta en 8 en frío, envuelve cada una en aluminio y congélalas."],
 tip:"~30 g de carbohidrato cada una. Las sacas del congelador el viernes en la noche."},
batido:{n:"Batido de recuperación",t:"Al volver del fondo",por:"1 porción",kcal:600,p:29,cost:2.2,
 ing:["300 ml de leche fría","1 plátano","30 g de avena","Canela","2 huevos sancochados"],
 st:["Licúa todo 30 segundos.","Tómalo en los primeros 30 minutos al llegar, con los 2 huevos."],
 tip:"Recarga y repara. Después, ducha y almuerzo."}
};
/* Menú por día (0 = lunes) */
const MENU=[
 {pre:null,d:"revuelto",a:"lentejas",mt:"Plátano + 1 huevo",c:"sopa"},
 {pre:"½ plátano + vaso de agua",d:"avena",a:"dorado",mt:"Fruta + vaso de leche",c:"tortilla"},
 {pre:"½ plátano + vaso de agua",d:"avena",a:"lentejas",mt:"Fruta + vaso de leche",c:"sopa"},
 {pre:"½ plátano + vaso de agua",d:"avena",a:"verde",mt:"Fruta + vaso de leche",c:"sangrecita"},
 {pre:null,d:"revuelto",a:"verde",mt:"Plátano + vaso de leche",c:"sangrecita",cn:"porción grande: mañana es el fondo"},
 {pre:null,d:"avena",dn:"con 90 g de avena y 2 huevos",post:"batido",a:"salteado",mt:"Fruta",c:"lentejas"},
 {pre:null,d:"panq",a:"dorado",an:"cocinas 2 porciones",mt:"Fruta",c:"tortilla"}
];
const FROZEN={3:["verde","sangrecita"],4:["verde","sangrecita"],5:["lentejas"]};
const SHOP=[
 ["Huevos (30 unidades)",15.0],["Pollo: piernas y encuentro (1,5 kg)",17.5],["Sangrecita de pollo (500 g)",3.0],
 ["Lentejas (500 g; sobra para la otra semana)",3.5],["Avena (1 kg)",6.0],["Arroz (1 kg)",4.0],["Papa (2 kg)",4.0],["Camote (1 kg)",2.5],
 ["Plátano (~15 unidades)",8.0],["Fruta de estación: mandarina o naranja",4.5],["Leche fresca o evaporada (2 L)",9.0],
 ["Verduras: espinaca (3 atados), zanahoria (1 kg), zapallo, vainita, pepino, lechuga, ajo, kion, culantro, hierbabuena, limón y ¼ kg de cebolla para aderezos",15.0],
 ["Azúcar rubia o panela (500 g)",2.5],["Fideo (250 g)",1.5],["Aceite (prorrateado)",2.5],["Sal, comino, canela, orégano, ají panca (prorrateado)",1.0]
];
const PREP=[
 "En la mañana, antes de salir en bici: lentejas en remojo.",
 "15:30 – Olla 1: lentejas (3 porciones). Olla 2: sopa de pollo (2). En una tercera: arroz para 3 días.",
 "Mientras hierven: sancocha 10 huevos, 1,5 kg de papa y el camote.",
 "16:15 – Arroz verde con pollo (2) y, al final, la sangrecita (2) en sartén.",
 "Mientras el arroz verde cocina: mezcla y cocina las barritas.",
 "17:15 – Reparte en tuppers. A la refri: comidas de lunes a miércoles. Al congelador: arroz verde y sangrecita (jueves y viernes), lentejas del sábado y las barritas.",
 "Cada noche a las 22:00 pasas a la refri lo congelado del día siguiente. Está marcado en el horario."
];
const FUEL=[
 "Hasta 75 min: solo agua.",
 "De 1 a 2,5 h: 30–60 g de carbohidrato por hora.",
 "Más de 2,5 h: 60–90 g por hora, cada 20–30 minutos desde el minuto 30.",
 "1 bidón isotónico = 45 g, 1 barrita = 30 g, 1 plátano = 25 g.",
 "Sábado de 5 h: 4 bidones (rellenas 2 en ruta), 4 barritas y 2 plátanos.",
 "Domingo: 2 bidones y 1 barrita."
];
const TIPS=[
 ["Decide la noche anterior","Ropa, bidón y desayuno listos a las 22:00. A las 6:00 no se decide nada: solo se ejecuta."],
 ["Una alarma, lejos de la cama","Te obliga a pararte. Posponer la alarma te deja más cansado, no menos."],
 ["Trabajo difícil primero","Tus primeras 2 horas en la oficina son las más lúcidas. Ahí va lo más difícil, con el celular en no molestar."],
 ["Pausas activas","Cada 60–90 minutos, 2 minutos de pie o caminando. Diez horas sentado endurecen la cadera."],
 ["Sueño de atleta","Cuarto oscuro y fresco, pantallas fuera desde las 22:00. Café solo antes de las 14:00."],
 ["Agua a la vista","Botella de 1 L en el escritorio; rellénala dos veces antes de las 19:00."],
 ["Seguridad en la bici","Casco, ropa visible, cámara, parches, bombín, multiherramienta, DNI, S/ 20 y celular cargado."],
 ["Chequeo antes de la semana 9","Presión, hemoglobina y ferritina: te dice si tu hierro aguanta el bloque duro."]
];
function sessionFor(w,wd){
 if(w<1||w>16)return null;
 if(wd===1){const r=RUN[w];return {key:"run",wd,title:r.test?"Test de "+r.test:"Carrera + pliometría",dur:r.d,z:r.z,start:"06:15"}}
 if(wd===2)return {key:"str",wd,title:w===16?"Movilidad + core suave":"Fuerza + core en casa",dur:wedDur(w),z:[1],start:"06:15"};
 if(wd===3)return {key:"bike",wd,title:"Bici de calidad",dur:BIKE[w].d,z:BIKE[w].z,start:"06:15"};
 if(wd===5)return {key:"long",wd,title:w===15?"Simulacro de 5 h":"Fondo en bici",dur:SAT[w].h*60,z:SAT[w].z,start:"08:30"};
 if(wd===6){const u=SUN[w];return {key:"brick",wd,title:"Bici + trote",dur:u.b+u.r,z:[2],start:"09:00"}}
 return null;
}
const exBtn=(id,label)=>`<button class="exlink" data-ex="${id}">${esc(label||EX[id].n)}</button>`;
const recBtn=(id,label)=>`<button class="exlink" data-rec="${id}">${esc(label||R[id].n)}</button>`;
const zchips=zs=>zs.map(z=>`<span class="chip z${z}">Z${z}</span>`).join(" ");
const listItems=arr=>arr.map(([id,dose])=>`<li>${exBtn(id)}: ${esc(dose)}</li>`).join("");
function sessionBody(s,w){
 const p=phaseOf(w),dl=DELOAD.includes(w),rows=[];
 const row=(l,h)=>rows.push(`<div class="phase-row"><div class="lbl">${l}</div><div>${h}</div></div>`);
 if(s.key==="run"){
  const r=RUN[w];
  row("Objetivo",r.test?"Medir tu estado de forma. Al terminar, la app guarda tu tiempo.":p===1?"Readaptar tendones y articulaciones al impacto, cómodo.":p===2?"Subir el umbral: aguantar más rápido por más tiempo.":p===3?"Elevar tu techo aeróbico (VO2máx).":"Afinar el ritmo exacto de tus 5 km.");
  row("1. Calentamiento (12')",(w<=3?"7' de caminata rápida + 5' de trote muy suave":"12' de trote suave en Z1–Z2")+", luego balanceos de pierna y círculos de tobillo y cadera.");
  row("2. Pliometría (8')",`<ul class="dots">${listItems(PLYO[p])}</ul><small>60" entre series. Cada salto rápido y limpio.</small>`);
  row("3. Bloque principal",`<ul class="dots">${r.m.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`);
  row("4. Vuelta a la calma","8' de trote muy suave o caminata, y estiramiento suave de gemelos y cadera.");
  if(r.n)row("Ojo",esc(r.n));
 }else if(s.key==="str"){
  if(w===16){row("Sesión","Movilidad de 10' (pestaña Ejercicios) + plancha 2 × 45\" y plancha lateral 2 × 30\" por lado. Nada más: el martes fue la prueba final.")}
  else{
   row("1. Calentamiento (5')","20 sentadillas sin peso, 10 puentes de glúteo, 10 balanceos de pierna por lado, 30\" de plancha.");
   row("2. Fuerza (25')",`<ul class="dots">${listItems(STR[p].i)}</ul><small>Bloque de ${STR[p].t}, ${STR[p].rest}. Termina todas las series de un ejercicio antes de pasar al siguiente. Las últimas 2 repeticiones deben costar.${dl?" Semana de descarga: 1 serie menos en todo.":""}</small>`);
   row("3. Core (10')",`<ul class="dots">${listItems(CORE[p])}</ul><small>30" entre ejercicios.</small>`);
  }
  row("Dónde","En casa. Material: mochila con peso, una silla o banca firme y un escalón.");
 }else if(s.key==="bike"){
  const b=BIKE[w];
  row("Objetivo",p===1?"Soltura de pedaleo y base aeróbica.":p===2?"Construir potencia sostenida (sweet spot).":p===3?"Intervalos de VO2máx y umbral.":"Mantener la chispa sin acumular fatiga.");
  row("1. Calentamiento","12' en Z1 subiendo a Z2, cadencia de 80 a 95 rpm.");
  row("2. Bloque principal",`<ul class="dots">${b.m.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`);
  row("3. Vuelta a la calma","5' en Z1 con cadencia suelta.");
  row("Ruta","Circuito conocido y con poco tráfico. Para intervalos, una subida constante de 3 a 10 minutos.");
  if(b.n)row("Ojo",esc(b.n));
 }else if(s.key==="long"){
  const t=SAT[w];
  row("Sesión",esc(t.m));
  row("Cómo llevarla","Primeros 20' en Z1–Z2. En llano cadencia 85–95; en subida sentado a 75–85 y de pie solo en rampas cortas. Ritmo parejo.");
  row("Comida en la bici",`${t.g} g de carbohidrato por hora desde el minuto 30. ${t.h>=4.5?"Kit completo: 4 bidones, 4 barritas, 2 plátanos.":"1 bidón isotónico + 1 barrita o 1 plátano por hora."} Bebe 500–750 ml por hora.`);
  row("Al volver",`${recBtn("batido","Batido de recuperación")} + 2 huevos en los primeros 30'.`);
  row("Seguridad","Avisa tu ruta y tu hora de regreso. Kit de reparación, DNI, S/ 20 y celular cargado.");
 }else{
  const u=SUN[w];
  row("1. Bici",`${hm(u.b)} en Z2, cadencia 85–95. Si el sábado fue duro, quédate en Z1–Z2 bajo.`);
  row("2. Transición","Zapatillas, gorra y agua listas en la puerta. Cámbiate en menos de 5'. Los primeros minutos de trote se sienten raros: pasos cortos y rápidos.");
  row("3. Trote",`${u.r}' en Z2${u.x?", "+u.x:""}.`);
  row("Comida en la bici","2 bidones isotónicos y 1 barrita.");
 }
 return rows.join("");
}

/* ============ HORARIO DEL DÍA ============ */
/* Bloque: [inicio, fin, tipo, título, detalle, extra] */
function dayBlocks(date){
 const wd=wdIdx(date),w=weekOfDate(iso(date)),s=sessionFor(w,wd),M=MENU[wd],B=[];
 const add=(a,b,k,t,d,x)=>B.push({a,b,k,t,d:d||"",x:x||{}});
 const food=(a,b,label,id,note)=>add(a,b,"food",label,"",{rec:id,note});
 const thaw=FROZEN[(wd+1)%7];
 const closeTxt=()=>{let t="Ropa y desayuno de mañana listos. Pantallas fuera.";if(thaw)t+=" Pasa a la refri lo congelado de mañana: "+thaw.map(r=>R[r].n.toLowerCase()).join(" y ")+(wd===4?" y 4 barritas":"")+".";if(wd===4)t+=" Revisa la bici: presión, cadena y frenos.";if(wd===6)t+=" Lunes: pésate al despertar.";return t};
 const workDay=()=>{
  add(525,540,"self","Traslado al trabajo");
  add(540,780,"work","Trabajo","Lo más difícil en las 2 primeras horas. Pausa activa cada 60–90 minutos.");
  food(780,840,"Almuerzo",M.a);
  add(840,990,"work","Trabajo");
  add(990,1005,"food","Media tarde",M.mt);
  add(1005,1140,"work","Trabajo");
  add(1140,1290,"act","Tus actividades");
  food(1290,1320,"Cena",M.c,M.cn);
  add(1320,1350,"self","Cerrar el día",closeTxt());
  add(1350,1380,"sleep","Dormir","Hasta las "+(wd===4?"7:00 (sábado)":"6:00: 7 h 30 de sueño")+".");
 };
 if(wd===0||wd===4){ /* lunes y viernes: descanso */
  add(360,420,"sleep","Duermes 1 hora más","Hoy no se entrena.");
  add(420,430,"self","Despertar","Agua.");
  add(430,445,"self","Movilidad 10'","Rutina guiada con temporizador.",{mob:true});
  add(445,465,"self","Ducha");
  food(465,490,"Desayuno",M.d);
  add(490,525,"self","Arreglarte y armar la mochila","Tupper, botella de 1 L.");
  workDay();
 }else if(wd>=1&&wd<=3){ /* mar, mié, jue */
  add(360,375,"self","Despertar","Un vaso de agua y ½ plátano. La ropa ya está lista desde anoche.");
  if(s){const e=375+s.dur;add(375,e,"train",s.title,hm(s.dur),{sess:s,w});add(e,e+20,"self","Ducha");food(e+20,e+45,"Desayuno",M.d);if(e+45<525)add(e+45,525,"self","Arreglarte y armar la mochila",(525-e-45)>45?"Te sobra tiempo: lectura, estudio o simplemente sin apuro. Tupper y botella de 1 L.":"Tupper, botella de 1 L.")}
  else{add(375,445,"self","Tiempo libre","Fuera del plan: puedes dormir más.");food(445,490,"Desayuno",M.d);add(490,525,"self","Arreglarte y armar la mochila")}
  workDay();
 }else if(wd===5){ /* sábado */
  add(360,420,"sleep","Duermes hasta las 7:00");
  add(420,435,"self","Despertar","Agua.");
  food(435,465,"Desayuno grande",M.d,M.dn);
  add(465,510,"prep","Preparar el fondo","Bidones con isotónico, barritas, plátanos, kit de reparación, DNI, S/ 20 y celular. Avisa tu ruta.");
  const e=s?510+s.dur:510;
  if(s)add(510,e,"train",s.title,hm(s.dur),{sess:s,w});
  food(e,e+15,"Al llegar",M.post,"más 2 huevos");
  add(e+15,e+45,"self","Ducha");
  const la=Math.max(e+45,750);
  if(la>e+45)add(e+45,la,"self","Tiempo libre");
  food(la,la+45,"Almuerzo",M.a);
  add(la+45,la+75,"sleep","Siesta de 30'");
  if(la+75<990)add(la+75,990,"self","Tiempo libre");
  add(990,1050,"prep","Compras en el mercado","Con la lista de Comida, Compras. Adoba el pollo del domingo al volver.");
  add(1050,1230,"self","Tiempo libre","Familia, amigos, descanso.");
  food(1230,1260,"Cena",M.c,"del congelador");
  add(1260,1350,"self","Libre y cerrar el día",closeTxt());
  add(1350,1380,"sleep","Dormir","Hasta las 7:30.");
 }else{ /* domingo */
  add(360,450,"sleep","Duermes hasta las 7:30");
  add(450,465,"self","Despertar","Agua. Pon las lentejas en remojo.");
  food(465,495,"Desayuno",M.d);
  add(495,540,"self","Preparar la salida","Bidones y barrita. Zapatillas listas en la puerta para la transición.");
  const e=s?540+s.dur:540;
  if(s)add(540,e,"train",s.title,hm(s.dur),{sess:s,w});
  add(e,e+20,"self","Ducha");
  if(e+20<750)add(e+20,750,"self","Tiempo libre");
  food(750,810,"Almuerzo",M.a,M.an);
  add(810,930,"self","Descanso libre");
  add(930,1050,"prep","Prep de comida de la semana","2 horas: los pasos están en Comida, Prep.",{prep:true});
  add(1050,1065,"self","Revisión semanal","En Progreso: cómo te fue y qué ajustar.");
  add(1065,1230,"self","Tiempo libre");
  food(1230,1260,"Cena",M.c);
  add(1260,1350,"self","Libre y cerrar el día",closeTxt());
  add(1350,1380,"sleep","Dormir","Hasta las 6:00.");
 }
 return B;
}
/* ============ FIGURA ANIMADA ============ */
const SEGS_FAR=[["s","e2"],["e2","w2"],["p","k2"],["k2","a2"],["a2","t2"]];
const SEGS_NEAR=[["p","k1"],["k1","a1"],["a1","t1"],["s","e1"],["e1","w1"]];
function fullPose(pz){const o={};for(const k in pz)o[k]=pz[k].slice();if(!o.t1)o.t1=[o.a1[0]+12,o.a1[1]+4];if(!o.t2)o.t2=[o.a2[0]+12,o.a2[1]+4];return o}
function lerpPose(A,B,f){const o={};for(const k in A)o[k]=[A[k][0]+(B[k][0]-A[k][0])*f,A[k][1]+(B[k][1]-A[k][1])*f];return o}
function buildFigure(ex){
 const svg=sv("svg",{viewBox:"0 -22 200 214",role:"img","aria-label":"Animación: "+ex.n});
 (ex.props||[]).forEach(r=>svg.appendChild(sv("rect",{x:r.x,y:r.y,width:r.w,height:r.h,rx:3,fill:"var(--prop)"})));
 svg.appendChild(sv("line",{x1:0,x2:200,y1:186.5,y2:186.5,stroke:"var(--ink3)","stroke-width":1.5}));
 const mk=(cls,w,col)=>{const l=sv("line",{"stroke-width":w,stroke:col,"stroke-linecap":"round"});svg.appendChild(l);return l};
 const far=SEGS_FAR.map(s=>mk("far",s[0]==="a2"?5:7,"var(--figure-far)"));
 const neck=mk("t",6,"var(--figure)");const torso=mk("t",10,"var(--figure)");
 const near=SEGS_NEAR.map(s=>mk("near",s[0]==="a1"?5:7,"var(--figure)"));
 const head=sv("circle",{r:11,fill:"var(--figure)"});svg.appendChild(head);
 let load=null;if(ex.load){load=sv("rect",{width:18,height:14,rx:3,fill:"var(--z3)",stroke:"var(--figure)","stroke-width":1.5});svg.appendChild(load)}
 const set=(l,a,b)=>{l.setAttribute("x1",a[0]);l.setAttribute("y1",a[1]);l.setAttribute("x2",b[0]);l.setAttribute("y2",b[1])};
 function draw(P){
  SEGS_FAR.forEach((s,i)=>set(far[i],P[s[0]],P[s[1]]));
  SEGS_NEAR.forEach((s,i)=>set(near[i],P[s[0]],P[s[1]]));
  set(neck,P.s,P.h);set(torso,P.s,P.p);
  head.setAttribute("cx",P.h[0]);head.setAttribute("cy",P.h[1]);
  if(load){const w=P[ex.load];load.setAttribute("x",w[0]-9);load.setAttribute("y",w[1]-4)}
 }
 return {svg,draw};
}
const ANIMS=[];
function addAnimated(container,id){
 const ex=EX[id],poses=ex.poses.map(fullPose);
 if(reduceMotion){
  const wrap=document.createElement("div");wrap.className="static-poses";
  [poses[0],poses[poses.length-1]].forEach(P=>{const f=buildFigure(ex);f.draw(P);wrap.appendChild(f.svg)});
  container.appendChild(wrap);
  const c=document.createElement("div");c.className="figcap";c.textContent="Izquierda: inicio. Derecha: final del movimiento.";container.appendChild(c);
  return;
 }
 const f=buildFigure(ex);f.draw(poses[0]);container.appendChild(f.svg);
 const cap=document.createElement("div");cap.className="figcap";cap.textContent=ex.hold?"Isométrico: mantén la posición. Toca para pausar.":"Toca para pausar";container.appendChild(cap);
 const path=[];for(let i=0;i<poses.length;i++)path.push(i);for(let i=poses.length-2;i>0;i--)path.push(i);
 const a={f,poses,path,ms:ex.ms||1400,visible:false,paused:false,t0:performance.now(),cap,hold:ex.hold};
 container.addEventListener("click",()=>{a.paused=!a.paused;cap.textContent=a.paused?"En pausa: toca para continuar":(ex.hold?"Isométrico: mantén la posición. Toca para pausar.":"Toca para pausar")});
 ANIMS.push(a);
 if("IntersectionObserver" in window){new IntersectionObserver(es=>es.forEach(e=>a.visible=e.isIntersecting),{rootMargin:"60px"}).observe(container)}else a.visible=true;
}
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function tick(now){
 for(const a of ANIMS){
  if(!a.visible||a.paused)continue;
  const n=a.path.length,total=n*a.ms,t=((Math.abs(now-a.t0))%total)/a.ms,i=Math.min(n-1,Math.floor(t));
  let fr=t-i;fr=Math.min(1,Math.max(0,(fr-0.12)/0.76));
  a.f.draw(lerpPose(a.poses[a.path[i]],a.poses[a.path[(i+1)%n]],ease(fr)));
 }
 requestAnimationFrame(tick);
}

