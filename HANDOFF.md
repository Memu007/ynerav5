# Ynera — estado vigente

Actualizado el 3 de octubre de 2026.

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
