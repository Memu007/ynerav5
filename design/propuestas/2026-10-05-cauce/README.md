# Ynera Cauce — propuesta de Astra, sin aplicar

Recomiendo **Cauce**, una revisión real de Sistema para titulares: conserva tensión geométrica y gana una voz más humana y una lectura más clara en móvil. No recomiendo conservar Sistema sin cambios: su caja baja de 478 frente a mayúsculas de 700 y sus arcos muy comprimidos producen una apariencia débil y excesivamente técnica.

**Formas concretas.** La caja baja pasa a 530. Las minúsculas principales son más anchas; las verticales pesan algo más que las horizontales. Se redibujaron todas las minúsculas: «a» con dos pisos y unión curva, «e» de apertura visible y barra apenas ascendente, «r» con hombro abierto, «t» de pie asimétrico y «y» descendente continua. Las «o» conservan lados tensos y remates rectos; los puntos de «i/j» siguen cuadrados. El resultado mantiene relación con el logo aprobado sin copiarlo ni cambiarlo.

**Por qué ésta.** La marca necesita precisión sin sonar impersonal. Mi elección combina o/e tensas con a/r/t menos mecánicas. Busca carácter en palabras reales; la comparación no demuestra memorabilidad, que sigue siendo un juicio de marca. Instrument Sans conserva el cuerpo de texto.

**Prueba.** `specimen.html` es autocontenido: fuente web real, logo aprobado y ES/EN en desktop de 1124 px y móviles de 390/320 px. `specimen.svg` y `specimen.png` muestran los contornos exactos. Inspeccioné el PNG; la primera suavización se descartó por demasiado convencional. La dirección final recupera la tensión. Verifiqué los caracteres de ambas frases, los acentos, el recorrido TTF→WOFF2 y los márgenes laterales. A 320 px, la línea inglesa más larga mide 220,79 px dentro de 284 px útiles, a 36 px de fuente.

**Límite.** Frente a Sistema pierde algo de extrañeza angular; gana regularidad de lectura. La «r» conserva una anchura menor que la «a», una decisión convencional que puede merecer revisión óptica tras elegir la dirección. Prototipo de titulares desde 36 px, 118 caracteres, un peso, sin hinting manual. Requiere revisar nuevas palabras y navegadores antes de publicarse; no es una familia tipográfica terminada ni una propuesta aprobada.

## Archivos y reconstrucción

- `build-cauce.py`: fuente editable y constructor independiente.
- `fonts/ynera-cauce.ttf`, `fonts/ynera-cauce.woff2`: salidas reales.
- `verification.json`: comprobaciones y medidas.
- `comparison.svg`, `comparison.png`: Sistema y Cauce a 80 px, mismo fondo e interlineado, sin escala horizontal.
- `make-specimen.py`: regenera pruebas con `YNERA_SITE_PATH` apuntando al sitio original para obtener el logo aprobado y el cuerpo Instrument Sans; el HTML entregado no depende de ese sitio.

Con Python 3.12+, `fonttools` y `brotli` instalados: `python3 build-cauce.py`. Para una instalación externa puede usarse la variable opcional `YNERA_FONTTOOLS_PATH`.
