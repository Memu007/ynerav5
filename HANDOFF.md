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
