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
- Personaje en capa independiente con seis cuadros de carrera y seis poses de acción.
- El árbol enfermo permanece como base; el árbol sano se revela de abajo hacia arriba, sin un corte de desaparición.
- Signo de pregunta al detectar, signo de admiración al resolver, rastro de datos, perímetro de seguridad, riego y celebración.
- Cinco hitos comerciales condensan las ocho acciones visuales sin perder la historia.
- Recorrido reducido a `340vh` para evitar fatiga.
- Suavizado independiente de los FPS mediante amortiguación temporal; cámara y personaje mantienen la misma respuesta en pantallas de distinta frecuencia.
- Carrera extendida durante los trayectos completos, con cuadros a 70 ms y desplazamiento continuo de 18 vw.
- Cambios de texto con fundido cruzado y actualizaciones del DOM sólo cuando cambia el hito.
- Los filtros costosos sobre capas móviles fueron reemplazados por gradientes estáticos para evitar tirones.
- Opción visible para saltar el recorrido.
- Manejo básico de `prefers-reduced-motion`.
- HTML, CSS y JavaScript nativos; no hay dependencias externas.

## Estructura comercial posterior

Después del recorrido se explican los problemas que Ynera puede resolver, sus cuatro capacidades y un método de tres pasos. No se muestran clientes, proyectos ni métricas porque todavía no existe evidencia autorizada para publicarlos.

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
- Caché invalidada mediante `styles.css?v=16` y `app.js?v=16`.

## Limitaciones y siguientes prioridades

1. Diseñar una versión móvil nativa más corta; la actual es sólo una adaptación básica.
2. Crear casos únicamente cuando existan trabajos y resultados publicables.
3. Incorporar una agenda real cuando esté definida.
4. Optimizar las imágenes a WebP/AVIF y medir carga en dispositivos reales.
5. Revisar accesibilidad de contraste, teclado y reduced motion antes de producción.
6. Hacer un estudio de marca antes de cambiar la paleta provisional.

## Criterio adversarial

El concepto funciona sólo si la interacción permanece fluida y la propuesta comercial se entiende sin explicación externa. Si el arte se percibe como sprites pegados, si se alarga nuevamente el recorrido o si los textos vuelven a separarse de las acciones, la web pierde credibilidad. La siguiente fase debe priorizar cohesión y rendimiento, no sumar efectos.
