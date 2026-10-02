---
name: sebs-brand
description: Sistema de identidad de marca SEBS (sebs.mx) — estudio de ingeniería de Sebastián Méndez. Usar al diseñar, construir o revisar cualquier interfaz, página, componente, documento o aplicación física de SEBS o de sus proyectos (Capa 8, GearLab/Torke, Máquina de dibujo, Recicla, Remote Hands/teleop, course-docs, PCBs, papers). Cubre la cartela (elemento firma), la jerarquía de herencia tokens → chrome → proyecto → app, color, superficies, tipografía, espaciado, componentes, logo, sub-marcas y la blocklist anti look-IA. Invocar cuando se mencione SEBS, sebs.mx, marca, identidad, branding, paleta, "el rojo", cartela, tokens de diseño, o al escribir HTML/CSS para cualquier sitio de SEBS.
---

# Identidad SEBS

Sistema de diseño de SEBS, estudio de ingeniería donde convergen hardware, software, UX y documentación.

**Fuente canónica:** `Identidad SEBS.md` v1.1, en `E:\20_AREAS\sebs\sitio\portfolio\`. Esta skill es su forma operativa y añade lo que el documento aún no tiene (cartela, jerarquía de herencia, blocklist). Si hay conflicto en lo que ambos cubren, gana el documento — y actualiza esta skill.

Assets de marca (logo, favicons): `E:\20_AREAS\sebs\sitio\portfolio\assets\img\`. Al trabajar en otro proyecto, copiarlos, no enlazarlos.

---

## La idea que gobierna

> Lo genérico es una decisión tomada por default; la identidad es una decisión tomada por el tema.

Cada recurso visual de SEBS **codifica información real** o no existe. Un borde, una numeración, un color, un mono: solo si dicen algo. SEBS no decora. Un diseño SEBS se ve igual de limpio que uno genérico; la diferencia es que cada cosa que se ve significa algo.

---

## Las dos reglas que más importan

### 1. El rojo es señal, no superficie

SEBS usa un rojo casi idéntico al de muchas identidades institucionales mexicanas. Lo único que separa a SEBS de parecer una universidad es **cuánto rojo hay y dónde está**.

> **~1–2% del área visible. Nunca un fondo. En SEBS el rojo significa *estado*: live, activo, paro, foco, la acción primaria.**

El ritmo visual se construye alternando blanco y grafito como superficies, no añadiendo color. Si algo se siente plano, la respuesta es contraste de superficie, tipografía y espaciado — nunca más rojo. Las tres pruebas (grises, entrecerrado, conteo) están en `references/color.md`.

### 2. La cartela es la firma

Toda pieza SEBS lleva una **cartela**: el bloque de título del dibujo técnico, con ID, revisión, fecha y estado del proyecto, en datos reales. Es el único lugar donde la marca gasta audacia; el resto es disciplinado. Es lo que alguien recuerda cinco minutos después. Especificación en `references/signature.md`.

Una cartela sin datos reales no es cartela, es decoración. Si falta un dato, se quita el campo. Nunca se inventa.

---

## Jerarquía de herencia

Un sitio SEBS no "reutiliza componentes"; **hereda capas**. Cada capa solo puede sobrescribir lo que su nivel permite.

| Capa | Qué contiene | Quién la escribe | Fuente |
|---|---|---|---|
| **0 · Tokens** | Paleta, tipografía, espaciado, radios, motion, superficies | SEBS | `https://sebs.mx/brand/tokens.css` |
| **1 · Chrome SEBS** | Cartela, firma, foco, patrón de estado | SEBS | `https://sebs.mx/brand/chrome.css` |
| **2 · Proyecto** | Acento (uno), hero, símbolo, patrón de superficies, narrativa | el proyecto | `project.css` del repo |
| **3 · App** | Lo propio de la herramienta: cinta, visor 3D, colores de contenido | la app | el resto del CSS |

Reglas:

- **Ningún proyecto pega hex.** Importa la capa 0 por URL. Si no puede depender de red, copia el archivo íntegro con cabecera de fecha de copia (`references/signature.md` §6). Si no está en tokens, no es un color de marca.
- **La capa 1 no se sobrescribe.** La cartela y la firma se ven igual en todos los sitios; eso es lo que hace visible el parentesco.
- **La capa 2 redefine `--sebs-signal`** al acento del proyecto y nada más de color. Un acento por proyecto, registrado en `references/subbrands.md`.
- **Los colores de contenido no son marca.** La paleta de tipos de nodo de Capa 8 o el color del CAD en Recicla son datos, como una fotografía. Viven en la capa 3 y no pasan por la auditoría de paleta.

El master de las capas 0 y 1 son `assets/tokens.css` y `assets/chrome.css` de esta skill. `scripts/publish.py` los copia a `brand/` del portafolio, que es lo que sirve sebs.mx.

---

## No negociables

| | Regla |
|---|---|
| **Rojo** | `#E30613`. Solo botón primario (uno por vista), estado activo, dot de estado, borde de foco, dato en gráfica, paro. Nunca fondo de nav, hero, card, sección, footer o banda. Nunca hover decorativo. |
| **Superficies** | Toda sección declara `light`, `mist` o `dark`. Blanco y Grafito tienen el mismo rango. |
| **Tipografía** | Manrope para todo lo que se lee como lenguaje. IBM Plex Mono **solo** para lo que se lee como dato: revisiones, IDs, timestamps, señales, archivos, código. Nunca mono en labels sueltos ni en prosa. |
| **Estructura** | Un borde, una numeración, un callout, un tinte o un ícono existen **solo si codifican información**. Numeración solo si hay secuencia. Callout solo si hay advertencia real. Borde de color solo si es estado o selección. |
| **Copy** | Cada texto hace exactamente un trabajo. El label de un botón dice lo que pasa al presionarlo. Sin subtítulo que explica el botón, sin eyebrow que repite la sección, sin adjetivos donde cabe un dato. Sustantivos, números, fechas. |
| **Espaciado y radios** | Tokens siempre. Radios: `xs/sm` controles, `md` botones e inputs, `lg` cards, `xl` paneles. Un solo radio para todo es un tell. |
| **Color como única señal** | Prohibido. Todo estado lleva texto o ícono además del color. |
| **Wordmark** | Asset, no texto. Nunca reescribirlo con fuente. |
| **Motion** | Una sola secuencia orquestada por página (la carga del hero o del demo). Nada de fade-up por sección ni hover-lift en cada card. `prefers-reduced-motion` siempre. |

---

## Blocklist

Si aparece, se quita sin discusión.

**Estética ajena a SEBS:** RGB, neón, gamer, hexágonos tecnológicos, engranes como recurso de marca, circuitos decorativos, degradados tecnológicos, glitch, glassmorphism, sombras pesadas.

**Look de IA (template chrome):**
- Eyebrow en MAYÚSCULAS o en mono sobre cada heading.
- Metadatos unidos con `·` como decoración. En la cartela los campos van en celdas, no en línea con puntos.
- Flecha `→` pegada a cada link o CTA.
- Callout con borde izquierdo de color; caja tintada del mismo color que su borde.
- Kit de cards idénticas con el mismo radio y la misma sombra; layouts bento.
- Gradientes morado-rosa o azul-morado; `bg-indigo` en botones.
- Fade-in por sección, scroll-jacking, hover-lift en cada card.
- Emojis como íconos; palomita y tache como muleta de sí/no.
- H1 con em dash + enumeración de categorías. El H1 de un ingeniero dice qué construye.
- Prosa de LinkedIn: "turning ideas into systems", "more capable and more human". Si la frase sirve para cualquier ingeniero, no sirve para SEBS.
- Inter, y una tercera familia tipográfica cualquiera.

---

## Rutas por tarea

Leer solo lo que corresponde. No cargar todo.

| Tarea | Leer |
|---|---|
| Colocar la cartela, la firma, la capa chrome; conectar un sitio a la jerarquía | `references/signature.md` |
| Colores, superficies, tintes, contraste | `references/color.md` |
| Tipografía, escala, jerarquía, uso de mono | `references/typography.md` |
| Botones, cards, tags, badges, tablas, formularios, nav | `references/components.md` |
| Logo: variante, clear space, tamaño mínimo | `references/logo.md` |
| Acento y personalidad de un proyecto; registro de acentos e IDs | `references/subbrands.md` |
| Motion, iconografía, fotografía, PCB, documentación, grid | `references/applications.md` |

**Capas listas:** `assets/tokens.css` (capa 0) y `assets/chrome.css` (capa 1).

---

## Flujo: construir algo nuevo

1. **Plan antes de código.** Escribir en markdown: superficie de cada sección, qué dato va en la cartela, dónde está el único rojo, cuál es la única secuencia de motion, y un wireframe ASCII. Sin esto no se abre el editor.
2. **Prueba de unicidad.** Preguntar: *si me dieran un brief parecido para otro ingeniero, ¿llegaría a lo mismo?* Si sí, cambiar esa parte y decir qué se cambió. La respuesta suele estar en la materia del proyecto (su dato, su objeto, su proceso), no en más estilo.
3. **Declarar la superficie** de cada sección: `light`, `mist` o `dark`.
4. **Construir en gris.** Jerarquía con tipografía, espaciado y contraste de superficie. Cero rojo.
5. **Colocar la cartela** con datos reales (capa 1, sin modificar).
6. **Añadir el rojo al final**, en un solo lugar: acción primaria o estado activo. En un proyecto con acento, el acento ocupa ese lugar.
7. **Verificar:** tres pruebas de color, blocklist, checklist de componente, y `scripts/audit.py`.

Este orden no es opcional. Es lo que impide que el rojo o la decoración terminen sosteniendo la jerarquía.

---

## Flujo: auditar una página existente

1. Correr el script — detecta lo verificable por regex:

   ```bash
   python ~/.claude/skills/sebs-brand/scripts/audit.py <archivo-o-directorio>
   ```

   Reporta: hex fuera de paleta, rojo como `background`, tipografías no oficiales, spacing y radios fuera de escala, presupuesto de rojo.

2. Pasar la **blocklist** a ojo: eyebrows, `·`, `→`, callouts con borde lateral, cards idénticas, motion por sección, copy genérico.
3. Verificar que exista la **cartela** con datos reales y que la capa 0 venga de la fuente única, no de hex pegados.
4. Tres pruebas de color (`references/color.md`) y contraste WCAG.
5. Reportar por gravedad: **crítico** (rojo como superficie, wordmark reescrito, tercera tipografía, sin cartela), **mayor** (fuera de paleta, tells de la blocklist, contraste bajo, hex pegados en vez de capa 0), **menor** (spacing/radio arbitrario).

Corregir solo si se pidió. Auditar ≠ arreglar.

### Convención `sebs-allow`

Un uso de rojo autorizado se marca en la línea para que el auditor no lo reporte:

```css
background: var(--sebs-signal); /* sebs-allow: boton primario */
```

Solo para los casos que `color.md` §3 permite, diciendo cuál. No es un silenciador general.

---

## Pendientes del sistema

Al topar con estos, señalarlo en vez de inventar el valor:

- Área de seguridad exacta del logo.
- Micro-logo para 16–24 px (requiere redibujar, no reescalar).
- Masters SVG del logo validados (hoy `SEBS.svg` y `simbolo vector.svg` en el portafolio, sin verificar contra el PNG master).
- Validación WCAG completa de los acentos de proyecto sobre las tres superficies.
- Manrope como display: se mantiene. Cambiarla sería un cambio de marca, no un retoque.
