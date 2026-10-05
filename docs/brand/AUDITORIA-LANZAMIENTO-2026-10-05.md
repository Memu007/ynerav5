# Auditoría final de Ynera · 5 de octubre de 2026

Base: e59894e. Auditoría visual y funcional local; no es una auditoría de seguridad ni una verificación de producción.

## Dictamen

El diseño está en condiciones de salir como primera versión. No conviene seguir cambiando la identidad antes de recibir consultas reales. **Todavía no está lista para captar clientes:** la sección de contacto sólo muestra «Canal de contacto pendiente de confirmar» y no ofrece email, formulario, WhatsApp ni reserva.

## Comprobaciones realizadas

- Hero de escritorio y móvil: Cauce aplicada, logo legible, árbol visible y texto con jerarquía clara.
- Español e inglés: el selector actualiza contenido y conserva la escena day. No se observó reinicio visible del árbol.
- A 390 y 320 px: sin desborde horizontal ni desborde de los encabezados.
- Carrusel: los controles avanzaron entre etapas en pantalla de 320 px.
- FAQ: apertura y contenido confirmados en navegador.
- Consola local: sin errores registrados en la consulta realizada.
- `design/verify.py`: enlaces locales, contenido bilingüe y FAQ consistentes.
- `design/check-ambience.cjs` y `design/check-lower-motion.cjs`: pasaron en el checkout antes de su recuperación; HEAD es el mismo e59894e.
- Evidencia: [escritorio](evidencia-2026-10-05/escritorio.png) y [móvil](evidencia-2026-10-05/movil.png).

## Bloqueos para lanzamiento

1. Confirmar un canal comercial real y conectarlo al cierre de contacto en los dos idiomas. Después probar que el clic llega al destino correcto. No inventar datos ni enviar mensajes de prueba sin autorización.
2. Confirmar alojamiento o dominio y verificar el sitio desde su URL pública. GitHub API devuelve has_pages=false y homepage=null para Memu007/ynerav5 el 5 de octubre; esto descarta Pages configurado en ese repo, pero no descarta un despliegue externo. Los documentos locales tampoco confirman uno.

## Mejoras posteriores, no bloqueantes

La oferta todavía es amplia y faltan demostraciones visuales reales de los productos. Para vender, eso pesa más que seguir retocando letras. Las capturas pendientes pueden incorporarse cuando existan; no presentar resultados de clientes que aún no se midieron. Completar canonical, sitemap y metadatos sociales cuando se confirme el dominio.

## Relevo

Se pidió a Emi email/enlace de agenda y URL pública; siguen sin respuesta. No se lanzó un alojamiento ni se afirmó que la web pública esté operativa. Para continuar: obtener esos dos datos, conectar contacto, regenerar traducciones, verificar y publicar; no reiniciar el diseño.
