---
description: Guías de arquitectura CSS, tokens de diseño y layouts responsivos de alta gama
---

# Frontend Designer Skill

## Propósito

Establecer estándares de arquitectura CSS, design tokens y layouts responsivos para Ynera. Mantener el código limpio, escalable y performante sin frameworks.

## Design Tokens vigentes

```css
:root {
  /* Colores */
  --ink: #173c3b;        /* Texto principal */
  --muted: #52706d;      /* Texto secundario */
  --paper: #f4f0e7;      /* Fondo base marfil */
  --mint: #dcece1;       /* Fondo suave */
  --teal: #0b7771;       /* Acento principal */
  --lime: #b5d06f;       /* Acento botánico */
  --amber: #dca84c;      /* Acento cálido */
  --line: rgba(23,60,59,.18); /* Bordes sutiles */

  /* Tipografía */
  --font-serif: Georgia, serif;
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;

  /* Espaciado */
  --pad-section: 96px 6vw;
  --pad-section-mobile: 64px 5vw;
  --gap-grid: 18px;

  /* Radios */
  --radius-card: 18px;
  --radius-pill: 99px;
  --radius-sm: 3px;

  /* Z-index */
  --z-header: 50;
  --z-overlay: 100;
  --z-world: 1;
  --z-character: 8;
  --z-beats: 12;
  --z-intro: 15;
}
```

## Reglas de arquitectura CSS

### Organización
- Un único archivo `styles.css` mientras el proyecto no exceda ~600 líneas
- Si crece, dividir en: `base.css`, `layout.css`, `components.css`, `story.css`, `responsive.css`
- Comentarios de sección con `/* === Sección === */`
- Orden dentro de cada sección: layout → tipografía → color → efectos → responsive

### Selectores
- Preferir clases sobre etiquetas o IDs para estilos
- BEM-lite: `.block__element--modifier` sólo cuando la complejidad lo justifique
- Evitar `!important`; si se necesita, refactorizar la especificidad
- Máximo 3 niveles de anidación

### Performance CSS
- Usar `transform` y `opacity` para animaciones (GPU-accelerated)
- `will-change` sólo en elementos que realmente cambian frame a frame
- `contain: layout paint` en contenedores aislados (como `.world`)
- Evitar `backdrop-filter` en capas móviles; usar gradientes estáticos como fallback
- `content-visibility: auto` en secciones fuera del viewport inicial

### Layout responsivo
- Mobile-first con breakpoints en `800px`
- Usar `clamp()` para tipografía fluida: `clamp(min, preferred, max)`
- Grid para layouts estructurales, flex para alineación puntual
- `scroll-snap` en carruseles móviles nativos (sin librerías)
- `aspect-ratio` para mantener proporciones de imágenes y videos
- Evitar `position: absolute` para contenido principal; reservarlo para decoración

### Imágenes
- Formato `.webp` preferido
- `loading="lazy"` en todo below-the-fold
- `width` y `height` explícitos para evitar layout shift
- `aspect-ratio` en placeholders
- `fetchpriority="high"` sólo en LCP

## Estructura HTML semántica

```html
<header class="site-header">      <!-- Navegación fija -->
<main>
  <section class="story">          <!-- Recorrido narrativo -->
  <section class="problems">       <!-- Problemas -->
  <section class="capabilities">   <!-- Servicios -->
  <section class="projects">       <!-- Portafolio -->
  <section class="method">         <!-- Método -->
  <section class="closing">        <!-- CTA / contacto -->
</main>
```

## Checklist de calidad CSS

1. ¿Los tokens están centralizados en `:root`?
2. ¿No hay valores mágicos (colores hex sueltos, px hardcoded)?
3. ¿El layout se mantiene sin scroll horizontal en móvil?
4. ¿Las imágenes tienen dimensiones explícitas?
5. ¿Los breakpoints cubren 320px, 768px, 1440px?
6. ¿`prefers-reduced-motion` está cubierto?
7. ¿Los focus-visible tienen contraste suficiente?
