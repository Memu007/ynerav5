# Ynera 5 — Handoff completo

Actualizado: 2 de agosto de 2026.

## Estado entregado

Este repositorio contiene una web funcional, no una maqueta estática. La experiencia principal es un Scroll World lateral controlado por scroll vertical, seguida por problemas, servicios, método y CTA. No depende de frameworks, paquetes ni compilación.

Para verla localmente:

```bash
python3 -m http.server 4175
```

Abrir `http://127.0.0.1:4175/`.

## Objetivo de producto

Explicar a compradores no técnicos cómo Ynera transforma un problema real en una solución operativa mediante Datos, Inteligencia Artificial, Sistemas y Ciberseguridad. La experiencia debe sentirse creativa y premium, pero siempre vender soluciones, no un videojuego.

Promesa visible desde el primer segundo: **“Convertimos problemas reales en sistemas que funcionan.”**

CTA final: **“Escribir a Ynera.”** No se promete una agenda que todavía no existe.

## Recorrido implementado

1. **Detectar / Diagnóstico:** el cliente observa un árbol Y marchito y reconoce el problema.
2. **Entender / Datos:** captura y ordena señales útiles.
3. **Conectar / Ingeniería:** corre hacia el laboratorio mientras las fuentes empiezan a integrarse.
4. **Analizar / IA aplicada:** opera una computadora y encuentra una respuesta.
5. **Resolver / Producto:** vuelve con una acción concreta.
6. **Proteger / Ciberseguridad:** despliega un perímetro tecnológico.
7. **Implementar / Sistemas:** aplica la solución y la lleva a operación.
8. **Crecer / Impacto:** el árbol se recupera de abajo hacia arriba y el personaje celebra.

Cada hito integra tres capas en la misma escena: acción narrativa, capacidad comercial y explicación breve. Esto evita separar “juego” y “sitio”.

## Comportamiento visual y técnico

- Cámara lateral en un único mundo continuo con jardín, corredor y laboratorio.
- El fondo, el árbol y la computadora comparten coordenadas de mundo: no se difuminan ni teletransportan; salen del encuadre cuando la cámara viaja.
- Personaje en capa independiente con seis cuadros de carrera y seis poses de acción. La implementación v24 usa dos capas con crossfade, pero queda **rechazada como solución final** por ghosting y cadencia irregular.
- El árbol enfermo permanece como base; el árbol sano se revela de abajo hacia arriba, sin un corte de desaparición.
- Signo de pregunta al detectar, signo de admiración al resolver, rastro de datos, perímetro de seguridad, riego y celebración.
- Cinco hitos comerciales condensan las ocho acciones visuales sin perder la historia.
- Recorrido reducido a `340vh` para evitar fatiga.
- Suavizado de cámara mediante amortiguación temporal y desplazamiento continuo de 18 vw.
- La posición espacial se interpola a la frecuencia de pantalla, pero el ciclo corporal vigente cambia imágenes cada 70 ms; esa combinación todavía se percibe trabada en Brave/Chromium.
- Cambios de texto con fundido cruzado y actualizaciones del DOM sólo cuando cambia el hito.
- Los filtros costosos sobre capas móviles fueron reemplazados por gradientes estáticos para evitar tirones.
- Opción visible para saltar el recorrido.
- Manejo básico de `prefers-reduced-motion`.
- HTML, CSS y JavaScript nativos; no hay dependencias externas.

## Estructura comercial posterior

Después del recorrido se explican los problemas que Ynera puede resolver, sus cuatro capacidades, tres productos desarrollados y un método de tres pasos. Aira, CDI y ReservaYá se presentan como productos de Ynera, no como clientes. CDI y ReservaYá enlazan sus despliegues documentados; Aira permanece sin enlace ni captura hasta contar con ambos.

## Base de posicionamiento y Google

- Título, descripción, canonical y metadatos sociales describen explícitamente sistemas de datos e inteligencia artificial.
- Datos estructurados `Organization` y `WebSite` sin domicilios, perfiles ni credenciales inventadas.
- `robots.txt`, `sitemap.xml` y favicon incluidos.
- Todos los enlaces `#` falsos fueron eliminados.
- Una única página honesta es preferible a páginas de servicios delgadas; crear URLs específicas cuando haya contenido propio suficiente para desarrollarlas.

## Dirección de arte vigente

- C2: arquitectura futurista lateral, luminosa y biotecnológica.
- Tratamiento 2.5D premium con pixelado sutil; no 8-bit tosco.
- Paleta marfil, verdes botánicos, teal y acentos oro suave.
- Protagonista neutral con traje de exploración futurista.
- Árbol Y orgánico y legible como símbolo de marca.
- La Y gigante del fondo está atenuada y desenfocada para no competir con el árbol narrativo.
- Evitar anime/JRPG, cyberpunk oscuro, estética infantil y dashboards genéricos.

## Recursos utilizados

- `world-master-v2.webp`: mundo maestro continuo.
- `dying-y-tree.webp` y `healthy-y-tree.webp`: estados del árbol.
- `analysis-computer.webp`: estación del laboratorio.
- `run-frame-0.webp` a `run-frame-5.webp`: carrera.
- `action-frame-0.webp` a `action-frame-5.webp`: observar, medir, analizar, proteger, regar y festejar.

No se incluyen láminas fuente, cromas ni variantes descartadas.

## Validación realizada

- Sintaxis de `app.js` verificada.
- Integridad del diff verificada.
- Recorrido probado desde una visita nueva con desplazamientos grandes y normales.
- Se comprobó la secuencia visual completa, los cinco mensajes, el laboratorio, el regreso del árbol y la transformación final.
- Consola del navegador sin errores.
- Piso visual elevado a 16 vh para alinear árbol, personaje y laboratorio por encima del panel narrativo.
- El sprite usa altura automática para que sus pies, y no una caja transparente de 512 px, queden anclados al piso.
- El carril del personaje comienza a 53 vw para que el panel narrativo no tape su cuerpo al apoyarlo en el piso.
- Tarjetas de proyectos compactas, sin altura forzada y con imágenes 16:9.
- Ejes horizontales del encabezado y las secciones unificados a 6 vw; anclas compensadas para el header fijo.
- En móvil, problemas, capacidades, proyectos y método usan carruseles nativos con `scroll-snap`; el recorrido baja a 240 vh y se compactan tipografía, espacios y cierre.
- Los cuatro carruseles móviles muestran una barra de avance que refleja la porción visible y progresa hasta el último slide.
- La pausa de análisis ocupa el bloque completo 03; la vuelta conserva cuadros de carrera y se detiene en un cuadro estable cuando cesa el scroll.
- La computadora de análisis fue reducida y desplazada para que el personaje quede frente al teclado sin atravesar el pedestal.
- La v24 precarga los sprites y usa dos capas con crossfade de 75 ms. La prueba real demostró que no resuelve el problema: el fundido dura más que cada cuadro de 70 ms, superpone poses incompatibles y genera ghosting.
- Caché invalidada mediante `styles.css?v=28` y `app.js?v=28`.
- Preparación Railway documentada en `RAILWAY.md`; el hosting estático vigente funciona sin build ni servidor propio.

## Diagnóstico multiagente de fluidez (pendiente crítico)

Tres revisiones independientes —motion, rendimiento Chromium y diseño premium— coincidieron en que el cuello de botella no es Brave:

1. Los seis sprites tienen encuadres y apoyos diferentes; al cambiar de cuadro el cuerpo y los pies saltan.
2. El crossfade dura `75 ms` y el cuadro sólo `70 ms`, por lo que una transición comienza antes de terminar la anterior.
3. `draw()` continúa solicitando frames mientras el personaje está dentro de una zona de carrera, aunque el usuario haya detenido el scroll. Esto mantiene CPU/GPU activas y degrada la cadencia.
4. Cada evento de scroll lee `getBoundingClientRect()` y `offsetHeight`; conviene cachear inicio y distancia en carga/resize y durante scroll leer únicamente `scrollY`.
5. El árbol sano se revela con `clip-path` sobre una imagen grande y varias capas móviles conservan `drop-shadow`; pueden producir picos de pintura al final del recorrido.

### Orden exacto recomendado para continuar

1. **Eliminar el crossfade del ciclo de carrera.** Mantener fundidos sólo para poses narrativas, con 120–160 ms y únicamente al cambiar de acción.
2. **Crear una sola sprite sheet de carrera** con los seis cuadros normalizados al mismo canvas, escala y punto de apoyo. Animarla con CSS `steps(6)` a 10–12 fps; la posición del personaje y la cámara continúan a 60 fps.
3. **Quitar el `bob` rápido actual** o sustituirlo por 1–2 px en un ciclo de 320–380 ms. El sprite ya comunica el movimiento vertical.
4. **Detener el rAF al terminar el suavizado.** El ciclo de piernas puede seguir en CSS; JavaScript no debe permanecer activo sólo porque el scroll quedó dentro de un tramo de carrera.
5. **Cachear métricas del recorrido** en carga y resize para evitar lecturas de layout en cada scroll.
6. Después, si todavía hay tirones, reemplazar el `clip-path` del árbol por opacidad/transform y agrupar las capas del mundo para aplicar una sola transformación.

Objetivo de validación: movimiento espacial estable a 60 fps, al menos 55 fps sostenidos en Chromium/Brave, ningún frame largo mayor a 50 ms y CPU en reposo aproximadamente 250 ms después de detener el scroll.

## Limitaciones y siguientes prioridades

1. Resolver y validar la fluidez según el plan anterior antes de sumar cualquier efecto.
2. Agregar enlace y captura de Aira cuando estén confirmados.
3. Incorporar una agenda real cuando esté definida.
4. Optimizar las imágenes y medir carga en dispositivos reales.
5. Revisar accesibilidad de contraste, teclado y reduced motion antes de producción.
6. Hacer un estudio de marca antes de cambiar la paleta provisional.

## Nota Railway

Si Railpack muestra una ruta como `snapshot-target-unpack/https:/github.com/Memu007/ynerav5`, el campo **Root Directory** está mal configurado. Debe quedar vacío o como `/`; la URL del repositorio se selecciona en **Source**, no como directorio.

## Criterio adversarial

El concepto funciona sólo si la interacción permanece fluida y la propuesta comercial se entiende sin explicación externa. Si el arte se percibe como sprites pegados, si se alarga nuevamente el recorrido o si los textos vuelven a separarse de las acciones, la web pierde credibilidad. La siguiente fase debe priorizar cohesión y rendimiento, no sumar efectos.
