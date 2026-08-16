---
description: Principios de animación de interfaz, tiempos, easing y microinteracciones fluidas
---

# Motion Design Skill

## Propósito

Definir principios de animación para Ynera. Cada movimiento debe tener intención, timing correcto y sentirse fluido. Priorizar rendimiento (60fps sostenidos) sobre efectos decorativos.

## Principios fundamentales

### 1. Intención sobre decoración
- Toda animación debe comunicar: cambio de estado, relación espacial, causa-efecto o feedback
- Eliminar motion que sólo "se ve lindo" sin servir a la comprensión

### 2. Timing
| Tipo de animación | Duración | Easing |
|-------------------|----------|--------|
| Microinteracción (hover, tap) | 150–250ms | `ease-out` |
| Transición de estado (panel, card) | 250–350ms | `cubic-bezier(.4,0,.2,1)` |
| Entrada de contenido (fade, slide) | 300–500ms | `cubic-bezier(.16,1,.3,1)` |
| Cambio narrativo (beat, escena) | 200–400ms | `ease-in-out` |
| Scroll-driven continuo | interpolación por frame | amortiguación exponencial |

### 3. Easing
- **Entrar:** `ease-out` o `cubic-bezier(.16,1,.3,1)` — rápido al inicio, suave al final
- **Salir:** `ease-in` o `cubic-bezier(.7,0,.84,0)` — suave al inicio, rápido al final
- **Estado estable:** `ease-in-out` para cambios bidireccionales
- **Nunca** `linear` para movimiento orgánico (sólo para progress bars y loops técnicos)

### 4. Amortiguación de cámara (scroll-driven)
- Fórmula vigente: `damping = 1 - Math.exp(-delta / 72)`
- Esta amortiguación exponencial es framerate-independent
- No cambiar sin medir impacto en fluidez

## Microinteracciones definidas para Ynera

### Hover de cards de proyecto
```css
transition: transform .25s ease, box-shadow .25s ease;
/* hover: translateY(-5px) + shadow suave */
```

### Cambio de beat narrativo
```css
transition: opacity .32s ease, transform .32s ease;
/* beat activo: opacity 1, translateY(0) */
/* beat inactivo: opacity 0, translateY(12px) */
```

### CTA principal
```css
/* Sin animación de entrada; el botón debe estar disponible inmediatamente */
/* Hover: cambio de fondo en 200ms, sin scale */
```

### Scroll cue (nudge)
```css
animation: nudge 1.4s ease-in-out infinite;
/* 50% { transform: translateY(5px) } */
```

## Rendimiento de animación

### Reglas críticas
1. **Sólo animar `transform` y `opacity** — no animar `width`, `height`, `top`, `left`
2. `will-change` en elementos que cambian frame a frame; **removerlo** cuando dejan de cambiar
3. `contain: layout paint` en contenedores aislados
4. Detener `requestAnimationFrame` cuando no hay movimiento pendiente
5. Cachear métricas de layout en carga/resize; leer sólo `scrollY` en scroll handler
6. Usar CSS animations para loops (más barato que rAF)
7. `passive: true` en listeners de scroll

### Sprite animation (caso Ynera)
- Frame rate objetivo: 10–12 fps para ciclo de piernas (CSS `steps()`)
- Posición espacial y cámara: 60 fps vía rAF con amortiguación
- **No usar crossfade** entre frames de carrera (genera ghosting)
- Crossfade sólo para poses narrativas, 120–160ms, únicamente al cambiar de acción

## GSAP / Framer Motion (si se introduce)

### Cuándo migrar de JS nativo a librería
- Sólo si la complejidad de timelines supera lo manejable con CSS + rAF
- Ynera actualmente no usa librerías; mantener ese estándar mientras sea viable

### Si se usa GSAP
```js
// Preferir timelines con etiquetas
const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
tl.to(element, { opacity: 1, y: 0, duration: 0.3 })
  .to(next, { opacity: 1, duration: 0.2 }, "-=0.1");
// Usar gsap.matchMedia() para responsive
// Usar ScrollTrigger sólo si es necesario; medir impacto
```

### Si se usa Framer Motion
```jsx
// Preferir variants sobre animate inline
const variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};
```

## prefers-reduced-motion

- Desactivar todas las animaciones no esenciales
- Mostrar contenido en estado final (sin transición)
- El recorrido narrativo debe tener fallback estático (lista textual)
- Mantener funcionalidad completa sin movimiento

## Checklist de motion

1. ¿La animación comunica algo o sólo decora?
2. ¿El timing está dentro de los rangos definidos?
3. ¿El easing es apropiado para entrar/salir/estable?
4. ¿Sólo se animan transform y opacity?
5. ¿El rAF se detiene cuando no hay movimiento?
6. ¿prefers-reduced-motion está cubierto?
7. ¿Mantiene 55+ fps en Chromium/Brave?
