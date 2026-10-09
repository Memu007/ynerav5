# Ynera Rama — tipografía de titulares nacida del logo

Aplicada el 9 de octubre de 2026 a pedido de Emi, que encontró genérica la letra anterior (Cauce).

**Idea.** El logo aprobado es el único lettering propio de la marca. Rama toma sus cinco letras (Y, n, e, r, a) tal como están en `brand/ynera-lockup.svg` y dibuja el resto del alfabeto con sus medidas: asta de 105, altura de x de 518 sobre mayúsculas de 700, curvas redondas, terminales cortados a 45° y entrada inclinada en las astas. Esas cinco letras son las del logo; al escribir «Ynera» el espaciado puede diferir levemente del logo, que tiene ajuste óptico propio.

**Método.** Contornos con curvas reales (no polilíneas), uniones booleanas con skia-pathops, horizontales más finas que verticales, hombros que se afinan al nacer del asta, rebase de las redondas, espaciado por tipo de borde y kerning calculado por perfiles de cada par. 142 glifos: español e inglés completos, cifras, puntuación y acentos frecuentes de otras lenguas latinas.

**Uso.** Titulares, nombres de proyectos y socios, pasos del proceso y rótulos cortos. Los párrafos, botones y navegación siguen en Instrument Sans: una fuente de lectura es un trabajo mucho mayor.

**Límites.** Un solo peso, sin hinting manual, pensada desde 16 px en rótulos y desde 30 px en titulares. No es una familia terminada. Cauce, Sistema y Bifurca siguen en `fonts/` para volver atrás cambiando el nombre de familia en `typography.css`.

**Reconstruir.** `python3 -m pip install fonttools brotli skia-pathops` y `python3 design/propuestas/2026-10-09-rama/build-rama.py`. Muestra: `specimen.png`.

Referencias de método: HT Letterspacer (espaciado por áreas), correcciones ópticas y rebase en diseño de tipos.
