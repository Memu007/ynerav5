---
description: Selección avanzada de contrastes, jerarquías y espacios de color alineados a estándares de accesibilidad
---

# Color & Typography Expert Skill

## Propósito

Definir estándares de color, contraste, tipografía y jerarquía para Ynera. Asegurar accesibilidad WCAG AA+ sin sacrificar la estética premium.

## Sistema de color

### Paleta vigente

| Token | Hex | Uso | Contraste sobre paper (#f4f0e7) |
|-------|-----|-----|-------------------------------|
| `--ink` | `#173c3b` | Texto principal | **11.2:1** AAA |
| `--muted` | `#52706d` | Texto secundario | **4.8:1** AA |
| `--teal` | `#0b7771` | Acentos, kickers, links | **4.6:1** AA |
| `--amber` | `#dca84c` | CTAs, highlights | **2.1:1** ⚠️ sólo sobre fondos oscuros |
| `--paper` | `#f4f0e7` | Fondo base | — |
| `--mint` | `#dcece1` | Fondo suave alternativo | — |

### Sobre fondos oscuros (story, closing)

| Token | Hex | Contraste sobre `#0c2526` |
|-------|-----|---------------------------|
| Blanco `#fff` | — | **15.9:1** AAA |
| Marfil `#f8f3e9` | — | **14.2:1** AAA |
| `--amber` | `#dca84c` | **7.8:1** AAA |
| `--teal` claro `#7ff4e9` | — | **12.1:1** AAA |

### Reglas de color

1. **Texto cuerpo:** siempre `--ink` sobre fondos claros, blanco/marfil sobre oscuros
2. **Texto secundario:** `--muted` (mínimo 4.5:1)
3. **Links interactivos:** `--teal` (mínimo 4.5:1)
4. **CTAs:** `--amber` sólo sobre fondos oscuros o como fondo con texto `--ink`
5. **No usar `--amber` como texto sobre `--paper`** (falla contraste)
6. **Estados focus:** outline `3px solid #e8c36f` con `offset: 4px`
7. **Bordes:** `--line` (rgba sutil), nunca colores sólidos para separadores

### Espacios de color
- Trabajar en **sRGB** (espacio por defecto del navegador)
- Si se introduce `color-mix()` o `oklch`, validar soporte en target browsers
- No usar `hsl()` con valores fuera de gama sRGB

## Sistema tipográfico

### Fuentes

| Rol | Familia | Pesos | Uso |
|-----|---------|-------|-----|
| Titulares | Georgia, serif | 400 | h1, h2, h3, titulares de beats |
| UI / cuerpo | Inter, system-ui, sans | 400, 650, 700, 750 | Texto base, navegación, botones |
| Eyebrows / kickers | Inter | 700 | Labels pequeños en mayúsculas |

### Escala tipográfica (fluida con clamp)

| Nivel | Desktop | Mobile | Clamp |
|-------|---------|--------|-------|
| H1 hero | 72px | 48px | `clamp(40px, 4.7vw, 72px)` |
| H2 sección | 82px | 52px | `clamp(40px, 6vw, 82px)` |
| H2 closing | 82px | 56px | `clamp(38px, 12vw, 56px)` |
| H3 card | 34px | 28px | `clamp(24px, 2.5vw, 36px)` |
| Beat strong | 36px | 31px | `clamp(24px, 2.35vw, 36px)` |
| Cuerpo | 16px | 16px | fijo |
| Cuerpo small | 13px | 12px | fijo |
| Eyebrow | 11px | 11px | fijo |

### Propiedades

| Propiedad | Titulares | Cuerpo |
|-----------|-----------|--------|
| `line-height` | 0.92–1.08 | 1.35–1.6 |
| `letter-spacing` | -0.045em a -0.055em | normal |
| `font-weight` | 400 (serif no bold) | 400 / 650 / 700 |
| `text-transform` | none | none (eyebrows: uppercase) |

### Jerarquía visual

1. **H1 hero** — serif, grande, peso 400, letter-spacing ajustado
2. **Eyebrow** — sans, 11px, 700, uppercase, letter-spacing amplio (color teal o blanco)
3. **H2 sección** — serif, muy grande, peso 400
4. **H3 card** — serif, mediano, peso 400
5. **Kicker** — sans, 11px, 700, uppercase, teal
6. **Cuerpo** — sans, 16px, 400, muted
7. **Small / meta** — sans, 12-13px, 400, muted

### Reglas tipográficas

1. **Nunca usar bold en serif** — Georgia se ve pesada; usar peso 400 y tamaño para jerarquía
2. **Máximo 3 niveles jerárquicos visibles simultáneamente** por sección
3. **Eyebrows siempre encima de titulares** para anclar contexto
4. **Line-height bajo en titulares** (0.92–1.08) para densidad editorial
5. **Line-height alto en cuerpo** (1.5–1.6) para legibilidad
6. **Letter-spacing negativo en titulares grandes** para cohesión visual
7. **Letter-spacing positivo en eyebrows** (0.15–0.18em) para separación

## Accesibilidad (WCAG AA+)

### Contraste mínimo
- **Texto normal:** 4.5:1 (AA)
- **Texto grande (≥24px o ≥18.66px bold):** 3:1 (AA)
- **Componentes UI (bordes, iconos):** 3:1 (AA)
- **Objetivo Ynera:** AAA donde sea viable (7:1)

### Legibilidad
- Tamaño mínimo cuerpo: 13px (móvil 12px en casos excepcionales)
- Ancho de línea: 45–75 caracteres para cuerpo
- `text-align: left` por defecto; `center` sólo en secciones cortas
- Evitar `justify` (crea ríos y espacios irregulares)

### Focus y navegación por teclado
- `:focus-visible` con outline visible (3px, alto contraste)
- `skip-link` al inicio del DOM
- Orden de tabulación lógico (no usar `tabindex` positivo)
- `aria-labelledby` en secciones con títulos

## Checklist de color y tipografía

1. ¿Todos los textos cumplen contraste AA mínimo?
2. ¿Los CTAs son perceptibles sobre su fondo?
3. ¿La escala tipográfica usa clamp para fluidez?
4. ¿Los titulares serif no usan bold?
5. ¿Los eyebrows anclan cada sección?
6. ¿El focus-visible es visible en todos los interactive elements?
7. ¿El ancho de línea está entre 45–75 caracteres?
8. ¿Hay skip-link y orden de tabulación lógico?
