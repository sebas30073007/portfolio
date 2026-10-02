# La cartela y la capa chrome

La cartela es el elemento firma de SEBS: el bloque de título de un dibujo técnico, trasladado a cada pieza del estudio. Un ingeniero reconoce una cartela al instante; nadie más la usa en una web. Es el lugar donde SEBS gasta su audacia.

> Todo lo que hay en una cartela es un **dato real del proyecto**. Si un campo no tiene dato, el campo no existe. Nunca se rellena por simetría.

---

## 1. Anatomía

```
┌──────────────┬───────────────────────────────┬────────────┬────────────┐
│ [símbolo]    │ Máquina de dibujo             │ REV        │ ESTADO     │
│ SEBS         │ Plotter cartesiano · Arduino  │ 0.4        │ ● ACTIVE   │
├──────────────┼───────────────────────────────┼────────────┼────────────┤
│ ID           │ PLOT-01                       │ FECHA      │ 2026-10-02 │
└──────────────┴───────────────────────────────┴────────────┴────────────┘
```

Campos, en este orden de prioridad (los últimos se quitan primero cuando falta espacio):

| Campo | Fuente del dato | Tipografía |
|---|---|---|
| **Firma** | Símbolo SEBS (asset) + nombre del proyecto en Manrope | Manrope 600 |
| **Estado** | dot + palabra: `LIVE` `ACTIVE` `PAUSED` `ARCHIVED` `PAPER` `COURSE` | IBM Plex Mono |
| **REV** | versión del sitio o del firmware/app; si no hay versionado, se omite | IBM Plex Mono |
| **Fecha** | última actualización real, ISO `YYYY-MM-DD` | IBM Plex Mono |
| **ID** | identificador del registro en `subbrands.md` §5 | IBM Plex Mono |
| **Línea** | una línea de qué es el objeto, con sustantivos | Manrope 400, Alloy |

Lo que **nunca** va en la cartela: eslóganes, redes sociales, copyright, íconos decorativos, el wordmark reescrito en fuente.

---

## 2. Dónde vive

| Nivel | Variante | Posición |
|---|---|---|
| Capa 1, todo sitio | **Completa** | Footer. Sustituye al footer convencional. Es el footer. |
| Páginas de documentación | **Completa** | Footer; en portada además una **compacta** bajo el título |
| Apps (GearLab, Máquina de dibujo, Capa 8) | **Compacta** | Barra de estado o esquina inferior del panel de controles |
| Cards de índice en sebs.mx | **Inline** | Última fila de la card: `ID · REV · estado` en mono, sin puntos decorativos: celdas con `gap` |
| PCB, serigrafía, documentos impresos | **Impresa** | Esquina inferior derecha, como en un plano |

La cartela completa aparece **una vez por página**. La compacta puede acompañarla en apps y portadas. Nunca dos completas.

---

## 3. Reglas

1. **Datos reales.** Fecha = última modificación real. REV = versión real. Estado = el de `_INDEX.md` del proyecto. Si no se sabe, se pregunta o se quita.
2. **El rojo es solo el dot de estado**, y solo cuando el estado es `LIVE` o `ACTIVE`. `PAUSED` y `ARCHIVED` llevan dot Alloy. `PAPER` y `COURSE` llevan dot Graphite (sobre light) o blanco (sobre dark). En un proyecto con acento, el dot activo usa el acento.
3. **Celdas, no puntos.** Los campos se separan con borde `1px var(--divider)` o con `gap`, nunca con `·`. La cartela ya es una tabla; no necesita tipografía de metadatos.
4. **Mono solo en los datos.** Las etiquetas de celda (`REV`, `ESTADO`, `ID`, `FECHA`) van en Manrope 500 12px con tracking 0.04em, en Alloy. El valor va en mono.
5. **Hereda la superficie.** La cartela lee `var(--surface)`, `var(--text)`, `var(--divider)`. Sobre dark o light sin CSS extra.
6. **No se anima.** Nada en la cartela se mueve, salvo que el dato cambie en vivo (telemetría), y entonces cambia el dato, no el contenedor.
7. **El símbolo va al tamaño mínimo o mayor**: 32 px. Nunca el lockup horizontal dentro de la cartela; la firma es símbolo + nombre del proyecto en texto.

---

## 4. HTML de referencia

Marcado de la cartela completa. El CSS está en `assets/chrome.css` y no se reescribe por proyecto.

```html
<footer class="cartela surface-dark" aria-label="Ficha del proyecto">
  <div class="cartela__firma">
    <img src="assets/img/Simbolo invertido.png" alt="SEBS" width="32" height="32" />
    <div>
      <p class="cartela__nombre">Máquina de dibujo</p>
      <p class="cartela__linea">Plotter cartesiano · Arduino UNO + CNC Shield</p>
    </div>
  </div>
  <dl class="cartela__campos">
    <div class="cartela__campo"><dt>ID</dt><dd>PLOT-01</dd></div>
    <div class="cartela__campo"><dt>REV</dt><dd>0.4</dd></div>
    <div class="cartela__campo"><dt>Fecha</dt><dd><time datetime="2026-10-02">2026-10-02</time></dd></div>
    <div class="cartela__campo cartela__campo--estado">
      <dt>Estado</dt>
      <dd><i class="dot dot--active" aria-hidden="true"></i>ACTIVE</dd>
    </div>
  </dl>
</footer>
```

La `cartela__linea` admite un `·` **solo** cuando une dos sustantivos de una misma descripción (es prosa corta, no metadatos). Si dudas, usa coma.

Compacta:

```html
<div class="cartela cartela--compacta" aria-label="Ficha del proyecto">
  <span class="cartela__nombre">GearLab</span>
  <dl class="cartela__campos">
    <div class="cartela__campo"><dt>REV</dt><dd>2.3.0</dd></div>
    <div class="cartela__campo cartela__campo--estado"><dt>Estado</dt><dd><i class="dot dot--active"></i>LIVE</dd></div>
  </dl>
</div>
```

Inline en card:

```html
<dl class="cartela cartela--inline">
  <div class="cartela__campo"><dt class="sr-only">ID</dt><dd>GEAR-01</dd></div>
  <div class="cartela__campo"><dt class="sr-only">Año</dt><dd>2026</dd></div>
  <div class="cartela__campo cartela__campo--estado"><dt class="sr-only">Estado</dt><dd><i class="dot dot--active"></i>LIVE</dd></div>
</dl>
```

---

## 5. Qué más contiene la capa chrome

`assets/chrome.css` lleva, además de la cartela, lo que todo sitio SEBS comparte y ningún proyecto redefine:

- **Foco visible**: `:focus-visible { outline: 2px solid var(--sebs-signal); outline-offset: 2px }`.
- **Dot de estado**: `.dot`, `.dot--active`, `.dot--idle`, `.dot--neutral`.
- **Clases de superficie** `.surface-light/mist/dark` (vienen de tokens, chrome las asume).
- **`.sr-only`**.
- **`prefers-reduced-motion`** global.

No lleva botones, cards, nav ni tablas: esos son componentes de `components.md` que cada proyecto implementa con los tokens, porque cada stack (HTML plano, Astro, React, Jekyll) los construye distinto.

---

## 6. Conectar un sitio a la jerarquía

Orden de carga, siempre el mismo:

```html
<link rel="stylesheet" href="https://sebs.mx/brand/tokens.css" />   <!-- capa 0 -->
<link rel="stylesheet" href="https://sebs.mx/brand/chrome.css" />   <!-- capa 1 -->
<link rel="stylesheet" href="css/project.css" />                     <!-- capa 2: acento, hero -->
<link rel="stylesheet" href="css/app.css" />                         <!-- capa 3 -->
```

Por stack:

| Stack | Cómo |
|---|---|
| HTML plano (portafolio, Capa 8, Máquina de dibujo) | `<link>` directo, en ese orden |
| Astro / Starlight (course-docs, Recicla) | `customCss` en `astro.config`: tokens, chrome, `starlight-bridge.css`, luego lo del proyecto. El puente Starlight es capa 2. |
| React / Vite (GearLab) | `<link>` en `index.html` antes del bundle; `tokens.css` local del repo se retira |
| Jekyll / just-the-docs (teleop) | `<link>` en `_includes/head_custom.html`; `custom.scss` mapea las variables del tema a tokens (es el "puente" de ese stack) |

**Sin red** (app que debe funcionar offline, como la Máquina de dibujo por Web Serial): copiar `tokens.css` y `chrome.css` íntegros al repo, con esta cabecera en la primera línea y sin editar nada más:

```css
/* COPIA de https://sebs.mx/brand/tokens.css · 2026-10-02 · no editar aquí, actualizar con scripts/publish.py */
```

**Capa 2 mínima** de un proyecto con acento:

```css
/* project.css — GearLab */
:root {
  --sebs-signal: var(--engine-yellow);
  --sebs-signal-hover: #E0A800;
  --sebs-signal-light: var(--engine-yellow);
  --on-signal: var(--graphite);        /* el amarillo exige texto grafito */
}
```

Nada más de color. Hero, símbolo y patrón de superficies van en el mismo archivo.

---

## 7. Publicar las capas 0 y 1

```bash
python ~/.claude/skills/sebs-brand/scripts/publish.py
```

Copia `assets/tokens.css` y `assets/chrome.css` a `E:\20_AREAS\sebs\sitio\portfolio\brand\`. Al hacer push del portafolio quedan servidos en `sebs.mx/brand/`. El master es la skill; el portafolio es el espejo publicado. Nunca editar `brand/` a mano.
