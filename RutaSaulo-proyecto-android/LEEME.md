# Ruta Saulo: app Android de tu plan de 16 semanas

App nativa para Android hecha con Capacitor. Incluye:

- Hoy: qué toca, check-in matutino con semáforo, agenda del día, comidas, agua y resumen de la semana.
- Plan: las 16 semanas, cada día con su sesión, ejercicios animados y horarios tipo.
- Entrenar: sesiones guiadas paso a paso con temporizador, sonido, vibración y notificaciones al cambiar de intervalo (aunque bloquees el teléfono). Avisos de comida cada 30 minutos en los fondos.
- Comida: menú diario y semanal, recetas, lista de compras de S/ 100 y checklist de la prep del domingo.
- Progreso: actividades estilo feed, peso, tests de 3 y 5 km, ritmos calculados y logros.
- Alarmas reales en el Reloj del teléfono (suenan aunque esté en silencio) y aviso sonoro 10 minutos antes de cada sesión.
- Cada sesión, ejercicio y paso del temporizador explica para qué sirve.
- Recordatorios diarios programados: qué toca hoy, qué toca mañana, comida del congelador, compras, prep, pesaje y revisión semanal.

Todos los datos se guardan en el teléfono. En Ajustes puedes copiar un respaldo.

## Cómo obtener el APK (sin instalar nada en tu computadora)

1. Crea una cuenta gratis en https://github.com
2. Crea un repositorio nuevo llamado `ruta-saulo` (puede ser privado).
3. En el repositorio toca "uploading an existing file" y arrastra TODO el contenido de esta carpeta, incluida la carpeta oculta `.github`. Si tu explorador no muestra `.github`, crea el archivo a mano: "Add file > Create new file", nombre `.github/workflows/build-apk.yml`, y pega el contenido.
4. Confirma con "Commit changes". GitHub empieza a compilar solo (pestaña Actions, unos 5 a 8 minutos).
5. Cuando termine en verde, entra a la pestaña Releases desde tu celular y descarga `RutaSaulo.apk`.
6. Ábrelo. Android te pedirá permitir "instalar apps de origen desconocido" para tu navegador o gestor de archivos: acéptalo e instala.
7. Abre Ruta Saulo, elige tu lunes de inicio y toca "Activar recordatorios".

## Alarmas

En Ajustes > Alarmas eliges las horas y tocas "Crear alarmas". Se crean 4 alarmas repetitivas en la app de Reloj de Android. Si luego cambias una hora, borra la alarma antigua desde "Ver en el Reloj".

## Para que los recordatorios lleguen a tiempo

- Ajustes de Android > Apps > Ruta Saulo > Batería: elige "Sin restricciones".
- Si tu teléfono es Xiaomi, Huawei, Oppo o Samsung, revisa también el "inicio automático" o "apps en suspensión" y excluye a Ruta Saulo.
- Durante un entrenamiento la pantalla queda encendida; las notificaciones de intervalos te avisan igual si la bloqueas.

## Cambiar algo del plan

Tipografía: toda la app usa Poppins (licencia SIL OFL, incluida en `www/fonts`), sin depender de internet.

Firma: el APK se firma siempre con `android/app/ruta-saulo.keystore`, así cada versión nueva se instala encima de la anterior y conservas tus datos. No borres ese archivo.

Los datos del plan están en `www/js/data.js` (sesiones, recetas, menú, compras) y `www/js/workouts.js` (los pasos guiados). Al subir un cambio a GitHub, se compila un APK nuevo automáticamente. Al instalarlo encima del anterior, tus datos se conservan.
