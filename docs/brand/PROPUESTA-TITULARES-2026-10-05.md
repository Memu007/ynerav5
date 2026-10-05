# Titulares: Cauce aprobada y aplicada

Astra (high), revisión independiente solicitada por Emi, recomienda **Ynera Cauce**, derivada de los dibujos originales de Sistema. La propuesta conserva terminales rectos y curvas tensas, amplía la caja baja y redibuja las minúsculas. El logo aprobado se conserva y Instrument Sans sigue como fuente de lectura.

## Evidencia y alcance

- [Comparación Sistema / Cauce](../../design/propuestas/2026-10-05-cauce/comparison.png): mismo cuerpo de 80 px, fondo y espaciado.
- [Prueba web autocontenida](../../design/propuestas/2026-10-05-cauce/specimen.html): español e inglés a 1124, 390 y 320 px.
- [Constructor, criterio y límites](../../design/propuestas/2026-10-05-cauce/README.md).
- La prueba de navegador verificó familia Cauce y ausencia de desbordes en los seis titulares. Las comprobaciones de fuente y medidas están en verification.json.

La lectura gana presencia; la memorabilidad no está demostrada. Es una propuesta de titulares desde 36 px, con un peso y 118 caracteres, sin hinting manual. Emi aprobó su aplicación el 5 de octubre de 2026. Los archivos del specimen conservan su rótulo histórico de propuesta.

## Aplicación y estado de relevo

Cauce está aplicada al titular principal del hero, títulos de sección, nombres de los proyectos y llamadas grandes en español e inglés. Las frases introductorias pequeñas, párrafos y botones conservan Instrument Sans; el logo SVG aprobado no cambia. El mínimo de títulos de sección/proyecto se ajustó a 36 px, rango previsto para esta fuente. Se sustituyeron el preload y la versión de caché del CSS en ambas páginas.

Se verificaron enlaces y contenido bilingüe con `python3 design/verify.py`, cobertura de todos los caracteres de los títulos y referencias al preload. WOFF2: 9.252 bytes. La revisión visual del sitio aplicado quedó pendiente porque Browser Use bloqueó la interacción con la pestaña de error por su política de URL; no se afirma haber comprobado el sitio final en navegador. El specimen aislado sí había sido revisado en la entrega anterior.

Los tres archivos locales pendientes de la entrega anterior quedaron resueltos: la versión de caché ahora es cauce-d11 y se retiraron las cuatro reglas de microcopy de 14 px ajenas a esta aplicación.
