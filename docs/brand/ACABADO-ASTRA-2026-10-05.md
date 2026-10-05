# Acabado visual de Ynera — revisión independiente

La base ya se siente cuidada y tiene identidad propia. El logo, Cauce y el árbol construyen una firma reconocible; no hace falta agregar otro recurso protagonista. Haría dos ajustes, en este orden:

1. **Dar una misma lógica material a la parte inferior.** En `typography.css:173–193`, Para quién, Dupla, FAQ y Contacto reciben degradados distintos; Dupla agrega tarjetas translúcidas con sombra, y Proceso introduce verde oscuro y dorado. Cada decisión es razonable aislada, pero la suma puede hacer que el recorrido parezca una colección de tratamientos. Cambio mínimo: conservar el papel actual como superficie común de las secciones claras, retirar las sombras de las tarjetas de socios y del cierre, y reutilizar un acento violeta existente para la línea y los nodos de Proceso. Se mantiene la alternancia claro/oscuro y la estructura. El efecto buscado es continuidad y una dirección de arte más deliberada. Esto es una recomendación desde el código: las capturas recibidas no muestran esas secciones completas.

2. **Cerrar la alineación de los botones en móvil.** En la captura móvil, los dos CTA quedan apilados con anchos diferentes; el borde derecho forma un escalón que no responde a otra alineación del bloque. El origen es el ancho determinado por el contenido en `.cta-row` (`index.html:201`). Cambio mínimo: cuando se apilan, darles un ancho común ajustado al botón más largo y limitado al contenedor. Conservar relleno para el principal y contorno para el secundario. No necesitan ocupar toda la pantalla ni cambiar el texto. Es un detalle pequeño, pero comprobable y visible en la primera interacción.

No sumaría brillos, otra textura ni más animaciones. `lower-motion.js` y el CSS ya aportan entradas, perspectiva y profundidad; una captura fija no permite juzgar su fluidez. Tampoco veo motivo para cambiar la fuente, reorganizar el hero o achicar el árbol móvil.

Revisión de escritorio/móvil y lectura de `typography.css`, `index.html` y `lower-motion.js`. Sin cambios aplicados, navegación, medición de contraste ni pruebas de movimiento.


## Criterio de PM

Revisión de Astra (high) solicitada por Emi; ninguna recomendación se aplicó.

Priorizar la alineación de CTA apilados: está sustentada en captura real y es un cambio acotado de composición. Usar el ancho del mayor botón, respetando el ancho disponible, sin cambiar jerarquía ni texto.

La unificación de superficies inferiores queda como hipótesis: Astra la evaluó por código, sin captura de esas secciones. El volumen y la paleta verde/dorado fueron decisiones anteriores explícitas. No eliminarlos ni sustituirlos por violeta sin comparar la sección renderizada; simplificar sólo donde exista ruido perceptible.

Conservar logo, Cauce, árbol, estructura y movimiento actual. No añadir efectos para justificar la etiqueta premium.


## Aplicación aprobada

Emi aprobó el acabado con «dale». Se aplicó lo acotado después de revisar las secciones inferiores en navegador:

- CTA del hero apilados con igual ancho hasta 480 px, usando el ancho del contenido mayor y respetando el espacio disponible. Verificados en ES a 390 px (217,75 px cada uno) y EN a 320 px (179,52 px cada uno), sin desborde horizontal.
- Sombras de tarjetas de socios más suaves; sombras de separadores reducidas de 28 a 16 px.
- FAQ con el mismo papel base. Se conserva el volumen de las tarjetas, los fondos del equipo/contacto y la paleta verde/dorado del carrusel; no se cambió su animación.
- Cache del CSS actualizado a finish-d12 en ambas páginas. `design/verify.py` pasó.

[Evidencia móvil](evidencia-2026-10-05/acabado-movil.png). Ningún cambio de copy, logo, fuente o árbol. Railway sigue sin verificación desde su URL pública.
