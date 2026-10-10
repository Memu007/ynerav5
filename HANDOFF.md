# Ynera — estado vigente

Actualizado el 4 de octubre de 2026.

La versión del árbol bifurcado reemplaza el recorrido lateral con sprites. La anterior permanece en el historial de Git. Se retiraron sus imágenes, estilos, script y storyboard de la rama actual.

## Implementado

- Páginas estáticas ES/EN para una consultora con socios en Argentina y España.
- Hero: «Menos hojas de cálculo. Menos riesgo. Tu operación, bajo control.»
- Ynera Sistema: fuente original basada en la dirección C elegida. Adaptación a fuente web, no reproducción exacta de la imagen generada. Titulares y nombres de proyectos; Instrument Sans en lectura y controles.
- Entrada breve del titular y soporte de movimiento reducido.
- Árbol Three.js e iluminación por hora local. Crecimiento inicial de 1,6 s con frecuencia activa hasta terminar; sin bajar resolución, geometría ni efectos.
- Selector ES/EN sin recarga. Conserva escena, luz, scroll, selección del test y FAQ abierta. Traduce metadatos y FAQ estructurada. Historial y entradas directas funcionan.
- CDI: producto propio funcional. Agroboeda: encargo de cliente, marketplace del agro en desarrollo. Dos espacios de capturas sin imágenes.
- Consulta de 30 minutos mediante la agenda existente; sin contacto ficticio.

## Verificado

Escritorio y móvil a 390 px, sin desborde. Test seleccionado y traducido sin perder respuestas ni scroll. FAQ abierta conservada. Atrás restaura idioma. Un canvas, árbol listo y consola sin errores. Verificaciones de enlaces, idiomas, FAQ, scripts y paletas aprobadas. No hay benchmark de FPS/GPU.

## Pendiente

Capturas reales; confirmar alojamiento y dominio; medir rendimiento en dispositivos reales. El idioma inicial automático según navegador todavía no está implementado.

`README.md` explica ejecución y edición; `design/DIRECCION.md` conserva las decisiones.


## Actualización comercial
Oferta y primeras entregas concretas en ES/EN, resumen CDI/Agroboeda junto al hero, espacios de capturas conservados ocultos, consulta inicial sin promesas de evaluación técnica gratuita. Agenda cal.com anterior devuelve 404: enlaces dirigidos a #contacto hasta recibir email/WhatsApp/agenda real. Pendientes apellidos y perfiles públicos de socios. No publicar como canal de captación completo hasta conectar contacto real.


## Recorrido compacto · 4 de octubre de 2026
Se eliminó el árbol SVG que crecía con las respuestas y su código/estilos. El test conserva selección, orientación, cambio de idioma y resultado textual; empieza cerrado y los enlaces Test lo abren. No usa la superposición de láminas para evitar tapar las preguntas cuando está abierto. Servicios y cierre sin párrafos repetidos; cinco FAQ sincronizadas con datos estructurados. Márgenes y tramos de scroll compactados. Árbol principal, materiales, geometría, resolución, iluminación y fuentes sin cambios.

Medición comparable en 633 × 928, ES con test cerrado: altura de 12.990 a 7.650 px, reducción aproximada del 41%. El porcentaje depende del ancho y del estado del test. Revisados 390 px (EN) y 1280 px (ES), sin desbordes; selección conservada al traducir, enlaces Test abren el desplegable. Verificación de contenido/FAQ y paletas aprobada. No se hicieron mediciones de FPS. Sigue pendiente un canal de contacto real.


## Profundidad y carrusel · 4 de octubre de 2026
Tras la revisión visual de Emi, el carrusel con scroll se activa desde 600 px (antes 981 px): el panel de 633 px ya permite recorrer las etapas sin tener que adivinar el gesto lateral. En móvil más angosto conserva scroll-snap y agrega flechas accesibles para avanzar/retroceder. Las flechas también funcionan en el modo con scroll. Controles traducidos sin recargar.

La parte inferior alterna papel, superficies con sombra y un plano verde profundo; entradas breves con IntersectionObserver para socios, FAQ y cierre. Respeta movimiento reducido y no agrega bibliotecas. El test sigue opcional y sin árbol. La escena principal no cambia.

Verificados: 633 px con carrusel activo, 390 px sin desborde y flecha que avanza a Paso 2; etiquetas de controles en inglés; consola sin errores. Check runnable de avance/retroceso/límites y móvil en design/check-lower-motion.cjs; contenido/FAQ y sintaxis aprobados. Altura ES, test cerrado, 633 × 928: 8.986 px frente a 12.990 de la versión larga (aproximadamente 31% menos); el carrusel recupera parte del recorrido para mostrar las etapas. No hay benchmark GPU/FPS. Contacto real pendiente.

Durante la revisión se corrigió una etiqueta fija en la entrada EN: la barra móvil vuelve a usar YneraUI según el idioma activo, igual que la entrada ES.


## Cámara del proceso · 4 de octubre de 2026
A pedido de Emi, el carrusel simula una cámara entre etapas mediante perspectiva CSS. Reutiliza el scroll y las pausas existentes: cada etapa queda frontal y completamente opaca al detenerse; las vecinas retroceden hasta 220 px y giran como máximo 12°. La luz de fondo acompaña discretamente el avance. Sin nuevas bibliotecas, segundo motor 3D ni bucle de animación. Árbol principal intacto.

`lower-motion.js` expone la pose, y debe cargarse antes de `motion.js`. En anchos menores de 600 px se mantiene el deslizamiento con flechas, sin poses 3D. Movimiento reducido conserva lectura y controles sin transformaciones.

Verificados en navegador: 633 y 1280 px con perspectiva y parada frontal legible; 390 px sin transformaciones residuales ni desborde, flecha avanzando a la segunda etapa, controles y barra de contacto traducidos. Consola sin errores. Pruebas de poses (reposo, transición, límites y simetría), controles y contenido ES/EN aprobadas. Movimiento reducido revisado en código, sin emulación específica en navegador. No hay benchmark GPU/FPS ni medición de conversión.

Criterio adversarial: el recorte durante la transición es parte del desplazamiento; no aumentar el giro o la duración, porque compite con la lectura. El canal real de contacto sigue pendiente y tiene mayor impacto comercial que esta animación.


## Retiro de la orientación · 4 de octubre de 2026
Emi pidió retirar completa la sección «Por dónde empezar». Eliminados el test, resultados, cálculo, estilos y enlaces de navegación en ES/EN. Los enlaces contextuales de servicios ahora invitan a conversar y apuntan a #contacto. La barra móvil queda dedicada a la consulta. Traducciones regeneradas. El carrusel y el árbol principal se conservan. Canal real de contacto pendiente.


## Equilibrio del equipo · 4 de octubre de 2026
Emi aprobó igualar las tarjetas y alinear ambos perfiles a izquierda. La grilla estira las tarjetas a igual altura en escritorio y reparte filas iguales en móvil; conserva el símbolo central cuando hay espacio. El título del equipo recibe 32 px de aire adicionales bajo la altura real del menú. Sin cambio de copy, hero ni carrusel.

Verificación visual: 997 px ES con tarjetas de 312 px y título separado 34 px del menú; 390 px EN con tarjetas de 239 px, sin desborde. Verificación de enlaces, idiomas y FAQ aprobada.


## Compromisos dentro del árbol · 4 de octubre de 2026
Emi aprobó trasladar parte del contenido inferior a la animación del árbol. Se distribuyeron tres frases breves en los capítulos de datos, seguridad e IA: primera entrega con alcance/costo acordados, trabajo directo con socios y aviso si el proyecto no conviene. Se mantienen cinco capítulos, sin agregar pantallas ni modificar `tree.js`. Socios, proceso, FAQ y contacto quedan abajo.

Eliminado el panel final de compromisos del carrusel y sus estilos. El recorrido y las flechas ahora usan cuatro etapas y tres transiciones; el paso 4 queda como límite final. Etiquetas/traducciones regeneradas en ES/EN. Verificados 997 px ES/EN y 390 px ES: frases legibles, sin desborde, un canvas; avanzar desde Paso 4 conserva Paso 4 y su pose frontal. Consola sin errores. Checks de controles/cámara, contenido, traducciones y sintaxis aprobados. Sin benchmark de rendimiento ni medición de conversión. Contacto real pendiente.


## Marca única · 4 de octubre de 2026
Emi confirmó que la marca es Ynera. Retirado el nombre botánico adicional de la firma junto al árbol y del pie en ES/EN. Ambas firmas usan ahora la letra de marca, sin cursiva botánica. Mantener Ynera como único nombre visible; los nombres internos de las fuentes no representan una submarca.


## Paleta del carrusel · 4 de octubre de 2026
Emi aprobó acercar el plano verde al hero. Fondo del proceso cambiado a verde carbón (#252e2a → #18211e), con sombra violeta tenue y luz móvil menos saturada. Texto secundario neutralizado; línea/nodos ámbar y texto principal claro conservados. Sólo CSS: sin cambios de geometría, cámara ni animación del árbol.

Revisado visualmente en el carrusel a 997 px: fondo carbón con transición violeta tenue, texto claro y acento ámbar. Verificación de contenido/enlaces ES/EN y diff sin errores.

## Identidad D aprobada · 4 de octubre de 2026

Emi eligió el símbolo circular con Y en negativo seguido del nombre completo Ynera, para reforzar reconocimiento. Aplicado a cabecera, firma del árbol y pie en ES/EN; favicon y assets actualizados. Firma principal: brand/ynera-lockup.svg; nombre solo guardado como alternativa. Tinta clara sobre escena y violeta #51406A sobre papel. Detalles: brand/LOGO-D.md.

Cabecera de 148 px en escritorio, 126 px en móvil, 100 px hasta 360 px. La fuente Ynera Sistema anterior sigue en los títulos; la prueba más redonda fue rechazada y revertida. Párrafos y controles conservan Instrument Sans. Eliminados guiones automáticos en móvil.

Para recuperar visibilidad del árbol en móvil, el plano oscuro se desplaza debajo de la zona del árbol; contenido inicial de 28svh a 32svh, audiencia más clara. tree.js y la calidad de animación permanecen iguales.

Verificados escritorio, móviles 390/320 px, ES/EN, día/noche y cambio de idioma en vivo: sin desborde ni superposición, ocho paths de marca y un canvas preservados. Checks de contenido/enlaces/FAQ/idiomas aprobados. Emi pidió subir esta versión al repositorio. Canal real de contacto sigue pendiente; no se configuró ni se publicaron datos ficticios.

## Auditoría Astra · 4 de octubre de 2026

Emi pidió revisión independiente con Astra y guardar los resultados en GitHub. Informe y capturas: docs/brand/REVISION-ASTRA-2026-10-04.md. Veredicto: conservar símbolo + Ynera completo y la jerarquía tipográfica; no se observó defecto que justifique rediseño. Único hallazgo P3: texto comercial secundario pequeño/tenue; propuesta de comparar 14 px y medir contraste, todavía no implementada. Memorabilidad y conversión no comprobadas. Ningún cambio en web, fuentes o árbol por esta auditoría.

## Lectura secundaria aplicada · 4 de octubre de 2026

Emi aprobó aplicar la mejora de Astra. Condiciones de consulta, ubicación y resúmenes de proyectos pasan a 14 px y tinta clara. Se evita que el hero desvanezca esos textos antes de leerlos al bajar en móvil. En escritorio, noche usa el mismo plano de lectura de día/atardecer. Logo, fuentes de títulos y calidad del árbol conservados.

Revisados ES/EN a 390/320 px sin desborde; contraste de fondo muestreado entre 7,92:1 y 11,79:1 en vistas de día/atardecer/noche y móvil. No es certificación de toda la escena animada. Resultados y captura en docs/brand/REVISION-ASTRA-2026-10-04.md. Checks existentes aprobados.

## Estilo secundario restaurado · 4 de octubre de 2026

Emi rechazó el aspecto del texto bajo el hero tras la mejora de Astra y pidió volver al anterior. Retiradas las reglas nuevas de 14 px/tinta clara: condiciones, ubicación y resúmenes de proyectos recuperan tamaños, interlínea y colores anteriores. No se había cambiado su familia tipográfica; permanece Instrument Sans. Logo y titulares sin cambios. Se conservan las correcciones de visibilidad durante el desplazamiento móvil y plano de lectura nocturno. Los resultados de contraste del informe describen la prueba D8, no el estilo secundario restaurado D9.


## Hero corto, árbol nombrado y SEO · 9 de octubre de 2026
A pedido de Emi. Hero reducido a etiqueta de público, titular, una línea y un botón: se quitaron el segundo botón, la nota de 30 minutos y el resumen CDI/Agroboeda junto al hero (los proyectos siguen en su sección). Cada capítulo del árbol lleva ahora una etiqueta visible sobre el título que nombra la metáfora: Raíces, Corteza, Copa y Bosque, con una frase breve. Sirve también en móvil, donde el pie de figura está oculto. Los títulos h2 no cambian. ES/EN editados en espejo y traducciones regeneradas; versión de `language-data.js` y `language.js` actualizada para evitar caché.

SEO y lectura por asistentes de IA, sin depender del dominio: título y descripción dicen «consultora» y «pymes»; el pie define a Ynera en una frase; datos estructurados ampliados (ProfessionalService, países, temas, oferta de los tres servicios, rol de cada socio) dentro del mismo `@graph`; `og:locale:alternate`; `llms.txt` con resumen en texto plano; `assets/og.png` (1200 × 630) lista pero sin enlazar.

Pendiente al confirmar el dominio: canonical, hreflang ES/EN/x-default, `og:url`, `og:image` y `twitter:image` apuntando a `assets/og.png` con URL absoluta, `sitemap.xml` y su línea en `robots.txt`, `url` y `logo` en los datos estructurados. No se agregaron URLs supuestas. Sigue pendiente el canal de contacto real.

Verificados 1440 y 390 px en ES y EN: sin desborde, consola sin errores; `verify.py`, `check-ambience` y `check-lower-motion` aprobados. Despliegue de Railway no verificado: falta la URL pública.


## Alcance internacional · 9 de octubre de 2026
Emi aclaró que Ynera no se dirige a pymes: es una consultora internacional. Retiradas todas las menciones a pequeñas y medianas empresas en ES/EN (título, descripción, etiqueta del hero, pie, datos estructurados, `llms.txt`, README y perfil). La etiqueta del hero dice «Consultora internacional · Datos, ciberseguridad e IA»; el pie y los datos estructurados indican trabajo remoto con clientes de cualquier país. Se quitó `areaServed` limitado a Argentina y España. No volver a escribir «pymes».

La palabra de cada etiqueta del árbol (Raíces, Corteza, Copa, Bosque) usa ahora Ynera Cauce en minúsculas y color del área, en lugar de mayúsculas espaciadas. `assets/og.png` regenerada. Traducciones regeneradas y versión de scripts de idioma actualizada. Verificados 1440 y 390 px, ES/EN, sin desborde ni errores.


## Ynera Rama · 9 de octubre de 2026
Emi pidió revisar las tipografías y hacer una propia acorde a la web; la anterior (Cauce) le resultaba genérica. Nueva fuente de titulares **Ynera Rama**, construida a partir de las cinco letras del logo aprobado: mismas medidas, curvas redondas, terminales a 45° y entrada inclinada en las astas. Detalle, método y límites en `design/propuestas/2026-10-09-rama/README.md`; constructor `build-rama.py`; muestra `specimen.png`.

Aplicada a titulares, nombres de proyectos y socios, pasos del proceso, encabezados de la bifurcación, etiquetas del árbol y rótulos «Primera entrega posible» / «Paso n». Se retiraron las mayúsculas espaciadas de esos rótulos, de la etiqueta del hero y del sector de cada proyecto. Párrafos, botones y navegación siguen en Instrument Sans. Logo sin cambios. `assets/og.png` regenerada.

Volver atrás: en `typography.css`, cambiar «Ynera Rama» por «Ynera Cauce» en las reglas de titulares y quitar el bloque final; los archivos de Cauce siguen en `fonts/`.

Verificado en navegador: ES/EN a 1440, 390 y 320 px sin desborde, la fuente carga y cubre todos los caracteres que la usan, cambio de idioma en página correcto, consola sin errores. Es más ancha y pesada que Cauce: revisar cualquier titular nuevo largo. Un solo peso, sin hinting manual. Despliegue de Railway no verificado: falta la URL pública.


## Árbol siempre visible en móvil · 9 de octubre de 2026
Emi notó que en el celular el árbol se perdía. Causa: el texto y sus velos oscuros cubrían la escena casi todo el recorrido. Hasta 980 px de ancho, la escena queda ahora por encima del texto y sólo se ve nítida en una ventana superior (31% del alto, fundido hasta 41%); el texto pasa por debajo y se desvanece al entrar en esa franja. Se quitaron los velos y sombras de texto del móvil y se acortaron los vacíos entre capítulos. En pantallas de menos de 620 px de alto la ventana baja a 26%. Barra inferior con texto más chico hasta 360 px. Sólo CSS, al final de `typography.css`; `tree.js` y `motion.js` sin cambios. Escritorio sin cambios.

Verificado en navegador a 390×844, 390×664, 375×553, 360×640, 320×568 y 768×1024, ES/EN, noche, día y atardecer: árbol visible en todos los capítulos y escena sincronizada con el capítulo en lectura. No probado en un teléfono real ni medido el rendimiento.
