# Ynera: herbario técnico

Propuesta de tipografía para la página del ZIP de Emi.

## Sistema
- Ynera Bifurca: fuente display original, un peso regular. Sólo marca y títulos.
- Instrument Sans: lectura, navegación y controles. Autoalojada; licencia OFL incluida.
- Piazzolla italic: anotación botánica de la escena y firma del pie.

Se retiró la animación de pesos del titular: una fuente de un solo peso no debe simular variantes. El contenido se conserva; el titular redistribuye sus líneas.

## Referencias consultadas
- Instrument: contraste entre expresividad y utilidad, suite propia. https://www.instrument.com/latest/from-old-to-bold-instrument-rebrand-signals-energetic-shift
- Cohere / Pentagram: naturaleza y tecnología traducidas a una identidad tipográfica. https://www.pentagram.com/work/cohere
- Grilli Type / GT Alpina: formas expresivas con ejecución práctica. https://www.grillitype.com/typeface/gt-alpina

Las referencias orientan criterios; no se usaron sus archivos de fuentes comerciales.

## Crítica adversarial incorporada
- Evitar una serif distinta para todo: separar display y lectura.
- Bifurcación selectiva, sin convertir cada carácter en una rama.
- No llamar fuente a un lettering: se entrega un archivo de fuente real.
- Revisar español, acentos, signos y frases largas.
- Permitir saltos de línea en móvil.

Original previo: index-original.html (copiado antes de la edición).

## Segunda propuesta: foco comercial
Titular: «Menos planillas. Menos riesgo. Tu operación, bajo control.» Introducción reducida y acceso directo a casos desde el hero. Tres espacios reservados para capturas, sin imágenes ni datos simulados. Casos en tres columnas desktop y una en móvil. Revisado a 1117px y 390px sin desbordes de títulos, tarjetas o botones. Versión tipográfica previa: index-tipografia.html.

## Tercera propuesta: presencia internacional
Español internacional e inglés; selector ES/EN explícito. Equipo Argentina/España, atención remota y reuniones coordinadas por zona horaria. La página está orientada a pequeñas y medianas empresas y profesionales; no afirma tener clientes en países nuevos ni certificaciones.

La revisión adversarial retiró el contacto WhatsApp ficticio (se usa la agenda existente), garantías absolutas de seguridad y datos SEO ficticios. El test ofrece orientación, conserva la aclaración después de responder y sólo selecciona lo que confirma el visitante. No se añadieron capturas de los productos.

Comprobación local: `python3 design/verify.py`.

Validación final: ES/EN en navegador, cambio de idioma y selección/desselección de una situación del test; resultado e instrucciones en el idioma elegido. Revisado a 390px; sin desbordes de títulos, botones, navegación ni casos. `verify.py` pasó en ambos idiomas y la fuente cubre todos los titulares.

## Cuarta propuesta: ambiente por hora local
Día: azul mineral, madera iluminada, menos emisión. Atardecer: ámbar y ciruela con resplandor moderado. Noche: conserva la dirección nocturna. El plano de lectura permanece oscuro y no cambia el color del texto.

Se usa el reloj local del visitante, sin ubicación ni servicios. 06–08 transición al día, 08–17 día, 17–19 transición al atardecer, 19–21 transición a la noche; 21–06 noche. Son franjas de diseño, no una simulación del amanecer astronómico. Se calcula una sola vez por visita, para no alterar sesiones largas de lectura.

Una configuración pequeña cambia colores y luz del renderer existente. No se agregan geometrías, texturas, bucles de render ni efectos. Durante el día se omiten estrellas y bloom; en atardecer baja el bloom. No se midió FPS en distintos dispositivos: la revisión de rendimiento es estructural. La primera prueba diurna producía lavado por bloom; se corrigió desactivándolo.

Los agentes solicitados fallaron por límite de uso de cuenta. Implementación y verificación final realizadas por el agente principal, sin afirmar una segunda revisión independiente.

Previsualizaciones: `index.html?scene=day`, `index.html?scene=dusk`, `index.html?scene=night`. El selector de idioma vuelve al ambiente automático de la hora local. Comprobación horaria: `node design/check-ambience.cjs`.


## Entrada del titular
Las dos líneas principales del hero entran una vez con opacidad y desplazamiento de 7 px, durante 600 ms y con 150 ms de separación. Se comparte entre ES y EN; no depende de JavaScript. Con movimiento reducido se muestran estáticas. La flecha del enlace secundario responde a hover y foco sin interferir con el movimiento existente del botón principal. Revisión de esta iteración realizada por el agente principal; no se atribuye una segunda revisión independiente.


## Portfolio confirmado
CDI es producto propio funcional. Agroboeda es un marketplace del agro encargado por un cliente y en desarrollo. La sección, el hero, las etiquetas de la escena y las FAQ usan estos dos proyectos en ES y EN; se conservan dos espacios sin capturas. La tipografía propia sigue pendiente de revisión por legibilidad y preferencia de Emi.


## Tipografía revisada
Se reemplaza Ynera Bifurca en titulares y texto destacado por Instrument Sans variable, con peso 550 y espaciado moderado. La fuente dibujada queda en la marca. No se presenta esta versión como una tipografía original. Se comprobó hero en ES y EN a 390 px sin desborde horizontal y vista desktop. La animación breve existente se conserva.


## Dirección C elegida e implementada
Emi eligió C (Sistemas) tras ver una comparación de lettering generada sobre el hero. La web usa Ynera Sistema, una adaptación original en fuente real basada en esa dirección, no una reproducción exacta de la imagen. 118 caracteres, archivo WOFF2 de 8640 bytes, trazos uniformes y curvas cuadradas. Uso: hero, h2, nombres de proyectos y encabezado de oferta. Párrafos, botones, navegación y subtítulos quedan con Instrument Sans. Fuente previa Bifurca reservada a marca. Se comprobaron cobertura de caracteres de titulares ES/EN, carga efectiva y ausencia de desborde a 390 px. Fuente editable: design/build-sistema.py; requiere FontTools y Brotli para reconstruir.


## Fondo entre idiomas y entrada del árbol
Un cambio ES/EN conserva scene=day|dusk|night cuando está seleccionado como vista de prueba. Sin vista forzada se sigue usando la hora local. Se verificó navegación ES día → EN día → ES día. Entrada del árbol pasa de 2,6 a 1,6 segundos y mantiene la frecuencia de dibujo activa hasta acabar el crecimiento. Se precarga el mismo script que se ejecuta luego, sin duplicarlo. Sin cambios de resolución, geometría, materiales o efectos en esta iteración. No se dispone de medición de FPS/tiempos GPU; mejora estructural de inicio y ritmo, no benchmark de rendimiento.


## Cambio de idioma sin reiniciar la escena
El selector ES/EN actualiza texto, etiquetas accesibles, metadatos y datos estructurados en los nodos existentes. No reconstruye el canvas, no recarga la página ni ejecuta otra vez el renderer. Mantiene la vista de iluminación y scroll. Las dos páginas estáticas siguen disponibles para enlaces directos y sin JavaScript; el historial se actualiza a index.html o en.html para que recargar mantenga el idioma. Las traducciones estáticas se generan desde ambas páginas con design/build-translations.py (196 bindings); los textos interactivos se localizan según html.lang. Se comparte motion.js, con indicadores del proceso dinámicos.
Validación en navegador: ES→EN→ES; 1 respuesta del test conservada y resultado traducido, mismo scroll (5659 px); Atrás restaura ES y selección; FAQ abierta sigue abierta y cambia de texto; móvil a 390 px sin desborde; árbol sigue marcado listo y un único canvas; sin errores de consola. Verificaciones estáticas de ambas páginas, scripts y paletas aprobadas. No hay benchmark de FPS.
