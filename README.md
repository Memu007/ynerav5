# Ynera

Web de la consultora Ynera: datos, ciberseguridad e IA aplicada, con alcance internacional. Socios en Argentina y España; atención en español e inglés.

## Abrir localmente

No requiere paquetes ni compilación.

```sh
python3 -m http.server 8765
```

Abrir `http://127.0.0.1:8765/`. `index.html` es español; `en.html`, inglés. El selector cambia textos sin recargar el árbol, conservando scroll y preguntas abiertas. Ambas páginas sirven como entradas directas.

## Archivos

- `index.html`, `en.html`: contenido de la web, sin test de orientación. Los compromisos acompañan las escenas de servicios del árbol; el carrusel inferior termina en la cuarta etapa.
- `typography.css`, `fonts/`: Instrument Sans para lectura y Ynera Rama, la fuente de titulares dibujada a partir del logo (`design/propuestas/2026-10-09-rama/`). Las fuentes anteriores se conservan.
- `tree.js`: escena Three.js; `motion.js`: movimiento y scroll; `lower-motion.js`: controles, poses de cámara del carrusel y entradas de las secciones inferiores. Se carga antes de `motion.js`, que reutiliza su recorrido de scroll para mover las etapas. Sus bibliotecas conservan avisos de licencia.
- `ambience.js`: luz según hora local, sin geolocalización.
- `language.js`, `language-data.js`: traducción dentro de la página.
- `brand/`, `assets/`, `stars.png`: recursos utilizados.
- `design/`: dibujos de fuentes, decisiones y verificaciones.

## Editar y verificar

Modificar los textos de ambas páginas y regenerar las traducciones:

```sh
python3 design/build-translations.py
python3 design/verify.py
node design/check-ambience.cjs
node design/check-lower-motion.cjs
```

Los mensajes interactivos están en `window.YneraUI`, compartidos por ambas páginas. Para reconstruir las fuentes, instalar FontTools y Brotli y ejecutar `design/build-sistema.py` o `design/build-bifurca.py`. Esto es opcional para publicar.

`?scene=day`, `?scene=dusk` y `?scene=night` fuerzan vistas de revisión. Sin parámetro se usa la hora local.

CDI es un producto propio funcional; Agroboeda es un marketplace del agro encargado por un cliente y en desarrollo. Los espacios de capturas siguen vacíos hasta contar con imágenes reales.

El repositorio no confirma un dominio ni un despliegue público activo. Al confirmar el dominio, completar canonical, URLs sociales y sitemap. Ver `HANDOFF.md` y `RAILWAY.md`.
