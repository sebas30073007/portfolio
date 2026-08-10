# Identidad SEBS

**Versión:** 1.1  
**Estado:** Sistema base aprobado — regla de color endurecida  
**Marca:** SEBS  
**Dominio principal:** `sebs.mx`

---

## 1. Esencia de marca

SEBS es una identidad para un estudio de ingeniería enfocado en proyectos, sistemas, herramientas y productos donde convergen ingeniería, diseño, experiencia de usuario y documentación.

La marca debe sentirse:

- Precisa.
- Clara.
- Técnica.
- Experimental.
- Modular.
- Sobria.
- Accesible.
- Profesional.
- Contemporánea.
- Funcional antes que decorativa.

La identidad evita una estética tecnológica estridente. No busca verse “gamer”, futurista por cliché ni corporativa genérica.

### Principios rectores

1. **Precisión** — Cada detalle debe comunicar exactitud, intención y confianza técnica.
2. **Flexibilidad** — El sistema debe adaptarse a software, hardware, documentación, productos físicos y proyectos experimentales.
3. **Coherencia** — Todos los puntos de contacto deben sentirse parte de una misma familia.
4. **Identidad** — El símbolo SEBS debe funcionar como firma visual discreta y reconocible.
5. **Claridad** — La complejidad debe organizarse para ser comprensible.
6. **Modularidad** — Los proyectos pueden tener personalidad propia sin romper el sistema principal.

---

# 2. Sistema de logotipo

## 2.1 Símbolo

El símbolo SEBS es un monograma geométrico circular.

Cada sección del símbolo representa una de las letras de **SEBS**, construida mediante líneas y arcos concéntricos.

El símbolo también puede leerse de forma abstracta como:

- Sistema.
- Capas.
- Integración.
- Módulos.
- Trayectorias.
- Conexión.
- Núcleo.
- Movimiento.
- Arquitectura.

El símbolo no debe interpretarse como un engrane, circuito, robot o mira literal. Su fuerza está en ser abstracto y apropiable.

## 2.2 Wordmark

El wordmark oficial utiliza la palabra **SEBS** con una construcción geométrica propia.

Debe conservarse como pieza de identidad y no sustituirse por Manrope ni por IBM Plex Mono.

## 2.3 Configuraciones oficiales

### Principal — Horizontal
Uso preferente en navegación web, portafolio, documentación, presentaciones, interfaces y material institucional.

Estructura: `[símbolo] [SEBS]`

### Secundaria — Símbolo
Uso preferente en favicon, app icon, avatar, PCB, grabado, serigrafía, sellos, espacios reducidos y productos físicos.

### Alternativa — Vertical
Uso preferente en portadas, splash screens, presentaciones, packaging y composiciones centradas.

### Versión negativa
El símbolo y el wordmark pueden utilizarse en blanco sobre fondos oscuros.

Archivos: `Simbolo invertido.png` y `logo-horizontal-invertido.png`. Este último es derivado del master y viene recortado al área de la marca — el master vive en un lienzo cuadrado donde el lockup ocupa solo la banda central, lo que lo hace inservible en una barra de navegación sin recortar.

Los archivos derivados usan nombres sin espacios ni acentos: el despliegue en Cloudflare Workers sube los assets por ruta y un espacio es una fuente de fallos silenciosos.

## 2.4 Proporción símbolo–wordmark

Medido sobre el master `Horizontal.png` vigente:

**altura visual del símbolo = 1.88 × altura visual del wordmark**

Lockup completo `625 × 177` (ratio 3.53:1) — símbolo `177 × 177`, corredor `32`, wordmark `416 × 94`.

> **Cambio respecto a v1.0.** El master anterior daba 1.61 (lockup `560 × 191`). La revisión del master ensanchó el wordmark. Si el valor correcto sigue siendo 1.61, lo que hay que corregir es el archivo maestro, no este número.

Esta relación debe mantenerse consistente en las composiciones aprobadas. Al escalar el logo, escalar el asset completo — nunca recomponer símbolo y wordmark por separado.

## 2.5 Uso cromático del logotipo

Las versiones maestras del logo son monocromáticas.

### Permitido
- Graphite sobre fondo claro.
- Blanco sobre fondo oscuro.
- SEBS Signal sobre fondo blanco, cuando el contexto lo requiera.
- Blanco sobre SEBS Signal.

### Evitar
- Degradados dentro del logo.
- Diferentes colores por cuadrante.
- Sombras.
- Contornos.
- Efectos 3D.
- Transparencias decorativas.
- Distorsión vertical u horizontal.
- Rotación arbitraria.
- Alterar la relación símbolo–wordmark.

## 2.6 Área de seguridad

La retícula definitiva de área de seguridad deberá documentarse en el archivo maestro vectorial.

Principio general: ningún texto, borde, imagen o elemento interactivo debe competir visualmente con el logo.

> **Pendiente de cierre técnico:** unidad exacta de clear space.

## 2.7 Tamaño mínimo

**Mínimo del símbolo en pantalla: 32 px.** Verificado por render directo del master a 16/24/32/48 px.

| Tamaño | Resultado |
|---|---|
| 16 px | ❌ Los canales concéntricos desaparecen. Se lee como un anillo moteado, no como el monograma. |
| 24 px | ⚠️ Legible, pero los canales internos ya se cierran. Solo si no hay alternativa. |
| 32 px | ✅ Canales abiertos, monograma reconocible. **Mínimo recomendado.** |
| 48 px | ✅ Limpio. |

En el lockup horizontal el símbolo determina la altura total, así que el mínimo del lockup completo también es 32 px de alto.

Pendiente de validar en físico: 5 mm, 7 mm, 10 mm (serigrafía y PCB, donde el sangrado de tinta cierra canales antes que el píxel).

> **Pendiente de cierre técnico:** micro-logo para 16–24 px. Requiere redibujar el símbolo con canales engrosados — no es un reescalado. Mientras no exista, el favicon se sirve a 32 px y se acepta la degradación en la pestaña.

---

# 3. Sistema cromático

El sistema cromático se basa en **dos colores de superficie** (blanco y grafito), **dos neutros de apoyo** (alloy y mist) y **un único rojo reservado como señal**.

## 3.1 Roles de color

Esta es la decisión estructural del sistema. Cada color tiene un rol y no puede ejercer otro:

| Color | Rol | Puede ser superficie | Puede ser texto | Puede ser señal |
|---|---|:---:|:---:|:---:|
| Technical White | Superficie | ✅ | ✅ (sobre oscuro) | ❌ |
| Graphite | Superficie | ✅ | ✅ | ❌ |
| Alloy | Apoyo | ❌ | ✅ (secundario) | ❌ |
| Mist | Apoyo | ✅ (secundaria) | ❌ | ❌ |
| SEBS Signal | Señal | ❌ | ⚠️ (ver 3.4) | ✅ |

**Blanco y Grafito son un par de superficies, no un par fondo/texto.** Ambos tienen el mismo rango: una sección puede ser blanca con texto grafito o grafito con texto blanco, y ambas son igualmente "SEBS". El negro no es únicamente el color del texto — es la mitad del sistema de superficies.

**SEBS Signal nunca es superficie.** Ver la regla dura en 3.4.

## 3.2 Paleta principal

### Technical White — superficie clara
- HEX: `#FFFFFF`
- RGB: `255, 255, 255`
- Uso: superficie de secciones claras, cards, tablas, paneles, sidebars, documentación. También como **texto y logo sobre superficie grafito**.

### Graphite — superficie oscura
- HEX: `#111317`
- RGB: `17, 19, 23`
- Uso: superficie de secciones oscuras, navegación, hero, bloques de énfasis, interfaces dark. También como **texto principal sobre superficie clara**.

### Alloy — neutro de apoyo
- HEX: `#6B6F76`
- RGB: `107, 111, 118`
- Uso: información secundaria, divisores, íconos secundarios, estados inactivos y metadatos. Nunca como superficie.

### Mist — superficie secundaria
- HEX: `#E5E7EB`
- RGB: `229, 231, 235`
- Uso: superficies secundarias dentro de un contexto claro, separadores, fondos suaves, estados deshabilitados y controles secundarios.

### SEBS Signal — señal
- HEX: `#E30613`
- RGB: `227, 6, 19`
- Uso: **exclusivamente** acción principal, estado activo, indicador, borde de selección, dato destacado en gráfica.

**Principio:** SEBS Signal funciona como señal, no como pintura de fondo.

## 3.3 Sistema de superficies

Toda sección, panel o card declara una superficie. No existen zonas sin superficie declarada.

| Superficie | Fondo | Texto principal | Texto secundario | Divisor |
|---|---|---|---|---|
| `light` | `#FFFFFF` | `#111317` | `#6B6F76` | `#E5E7EB` |
| `mist` | `#E5E7EB` | `#111317` | `#6B6F76` | `#FFFFFF` |
| `dark` | `#111317` | `#FFFFFF` | `#6B6F76` | `#2A2D33` |

Principios:

- **Alternar superficies es el recurso principal de ritmo visual**, no el color. Una página gana jerarquía alternando `light` / `dark`, no añadiendo rojo.
- Una superficie `dark` no es un "modo oscuro": es una decisión de composición dentro del mismo tema.
- El logo se resuelve por superficie: Graphite sobre `light` y `mist`, blanco sobre `dark`.
- Nunca anidar más de dos niveles de superficie (ej. card `light` dentro de sección `dark` está bien; un tercer nivel no).

## 3.4 Regla del rojo (regla dura)

El rojo es lo que más rápido puede hacer que SEBS parezca una variación de una identidad institucional ajena. Por eso su uso no es una preferencia: es una restricción verificable.

### Presupuesto de rojo

**El rojo no debe superar ~1–2% del área visible de cualquier vista.** Si en una captura de pantalla el rojo se lee como "el color de la página" en vez de como "el punto al que hay que mirar", la regla está rota.

### Permitido — el rojo solo aparece como

- Botón primario (**uno** por vista o sección; el resto de acciones son secundarias).
- Estado activo en navegación (ítem actual, subrayado, indicador lateral).
- Indicador o dot de estado.
- Borde de selección o foco (1–3 px).
- Serie o dato destacado en una gráfica.
- Contador o métrica crítica puntual.
- Símbolo SEBS, cuando el contexto lo requiera (ver 2.5).
- Underline o hover de un link dentro de texto corrido.

### Prohibido — el rojo nunca es

- Fondo de barra de navegación o header.
- Fondo de hero o de sección completa.
- Fondo de card, panel, sidebar o footer.
- Bloque o banda de ancho completo.
- Fondo de tabla, fila o encabezado.
- Color de un titular largo (H1/H2 completos).
- Segundo color de superficie del sistema.
- Relleno de formas decorativas grandes.

### Prueba de validación

Una vista pasa la regla si se cumplen las tres:

1. **Prueba de escala de grises** — al desaturar la vista, la jerarquía se mantiene legible. Si al quitar el rojo la composición se desarma, el rojo estaba haciendo el trabajo que le corresponde a la tipografía y al espaciado.
2. **Prueba del entrecerrado** — al entrecerrar los ojos, el rojo aparece como puntos aislados, no como manchas o bandas.
3. **Prueba de conteo** — hay como máximo **un** botón primario rojo y **un** indicador de estado activo por vista.

### Excepción única

Un bloque rojo de superficie está permitido **solo** en aplicaciones de marca fuera de interfaz: portada de presentación, sticker, serigrafía, packaging o splash screen. Nunca en web ni en interfaz de producto.

## 3.5 Acentos de proyecto

- Electric Blue — `#2563EB`
- Cyber Teal — `#00BFA6`
- Engine Yellow — `#FFC107`
- Violet Core — `#7C3AED`
- Copper — `#FF6B35`

Estos colores funcionan como variables de proyecto y no sustituyen la identidad principal.

**Los acentos de proyecto heredan la regla dura de 3.4.** Son señal, no superficie: mismo presupuesto de ~1–2%, mismas prohibiciones. Un proyecto con acento Electric Blue no puede tener un hero azul.

**Un acento de proyecto reemplaza al rojo, no se suma a él.** Dentro de una vista de proyecto, o hay rojo o hay acento de proyecto — nunca los dos compitiendo. La única excepción es la firma SEBS, que puede mantenerse en Graphite o blanco.

## 3.6 Regla de color para sub-marcas

Referencia conceptual:
- **70% SEBS**
- **30% identidad específica del proyecto**

Debe permanecer constante:
- Tipografía.
- Grid.
- Espaciado.
- Neutros.
- Lógica de componentes.
- Lenguaje técnico.
- Firma SEBS.

Puede variar:
- Color de acento.
- Símbolo del proyecto.
- Hero.
- Patrón.
- Motion.
- Recursos gráficos.
- Narrativa visual.

## 3.7 Intensidades de SEBS Signal

| Intensidad | Uso | Cuenta al presupuesto |
|---|---|---|
| 100% | Botón primario, estado activo, indicador | Sí |
| 80% | Hover y estados presionados | Sí |
| 60% | Indicadores secundarios, íconos de estado | Sí |
| 40% | Bordes, subrayados, líneas de foco | Sí |
| 12% | Fondo tintado de callout de error o alerta | Parcial — ver abajo |
| 6% | Fondo tintado muy sutil, fila resaltada en tabla | Parcial — ver abajo |

**Los tintes no son un permiso encubierto para pintar superficies.** Un fondo tintado al 6–12% solo es válido si cumple las tres condiciones:

1. Comunica un **estado** (error, alerta, selección), nunca decoración ni jerarquía.
2. Está **contenido** en un componente delimitado — callout, fila de tabla, campo de formulario — nunca en una sección o bloque de página.
3. Va acompañado de **texto o ícono** que comunica el mismo estado sin depender del color.

Un tinte que ocupe más de un componente cuenta como superficie roja y viola 3.4.

Siempre debe verificarse contraste y legibilidad.

---

# 4. Tipografía

## 4.1 Tipografía principal — Manrope

Uso:
- Interfaz.
- Navegación.
- Títulos.
- Cuerpo.
- Botones.
- Formularios.
- Presentaciones.
- Portafolio.
- Documentación general.
- Comunicación de marca.

## 4.2 Tipografía técnica — IBM Plex Mono

Uso:
- Código.
- Versiones.
- Revisiones.
- Variables.
- Especificaciones.
- Metadatos.
- IDs.
- Timestamps.
- Datos técnicos.
- Nombres de señales.
- Nombres de archivos.
- Información de PCB.

Ejemplos:
`REV 2.1`  
`CTRL-04`  
`STATUS: ACTIVE`  
`2026-05-12T10:30:00Z`

---

# 5. Escala tipográfica

| Estilo | Familia | Peso | Tamaño | Line-height | Tracking |
|---|---|---:|---:|---:|---:|
| H1 | Manrope | ExtraBold | 40px | 48px | -0.02em |
| H2 | Manrope | Bold | 32px | 40px | -0.01em |
| H3 | Manrope | SemiBold | 24px | 32px | 0 |
| H4 | Manrope | SemiBold | 20px | 28px | 0 |
| H5 | Manrope | Medium | 16px | 24px | 0 |
| Body | Manrope | Regular | 16px | 24px | 0 |
| Small | Manrope | Regular | 14px | 20px | 0 |
| Label | Manrope | Medium | 12px | 16px | 0.02em |
| Technical | IBM Plex Mono | Regular | 12px | 16px | 0 |

---

# 6. Sistema de espaciado

Base: **4 px**

| Token | Valor |
|---|---:|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 24px |
| `2xl` | 32px |
| `3xl` | 48px |
| `4xl` | 64px |
| `5xl` | 96px |
| `6xl` | 128px |

Principios:
- Usar tokens antes que valores arbitrarios.
- Mantener ritmo vertical consistente.
- Favorecer aire y claridad.
- Evitar interfaces excesivamente densas.
- La información técnica puede ser compacta, pero nunca apretada.

---

# 7. Grid y layout

## Desktop
- Contenedor máximo: `1280px`
- Columnas: `12`
- Gutter: `24px`
- Margen lateral mínimo: `24px`

## Tablet
Adaptación progresiva manteniendo gutter, jerarquía y ritmo.

## Mobile
- Una columna cuando sea necesario.
- Margen lateral base: `16–24px`.
- Evitar scroll horizontal salvo contenido técnico que realmente lo requiera.

---

# 8. Radios

| Token | Valor |
|---|---:|
| `xs` | 4px |
| `sm` | 6px |
| `md` | 8px |
| `lg` | 12px |
| `xl` | 16px |
| `round` | 9999px |

Uso recomendado:
- `xs` / `sm`: tags, chips, controles pequeños.
- `md`: inputs y botones.
- `lg`: cards.
- `xl`: paneles principales.
- `round`: badges, pills e indicadores circulares.

---

# 9. Bordes y divisores

## Bordes

| Token | Grosor |
|---|---:|
| `hairline` | 1px |
| `thin` | 1px |
| `medium` | 2px |
| `thick` | 3px |

## Divisores
- Fondos claros: `#E5E7EB`
- Fondos oscuros: `#2A2D33`

Uso:
- Separar sin sobrecargar.
- Evitar bordes negros pesados en interfaces claras.
- Reservar 2–3 px para selección o estados destacados.

---

# 10. Componentes

## 10.1 Botón primario
- Fondo: SEBS Signal.
- Texto: blanco.
- Tipografía: Manrope Medium / SemiBold.
- Radio recomendado: `md`.
- Uso: acción principal por pantalla o sección.

> **Uno por vista.** El botón primario es el consumo de rojo más grande permitido en interfaz (ver 3.4). Si una vista necesita dos acciones, la segunda es un botón secundario.

Estados:
- Normal.
- Hover.
- Active.
- Disabled.
- Loading.

## 10.2 Botón secundario
- Fondo neutro o transparente.
- Borde Graphite / Mist según tema.
- Texto Graphite o blanco.
- Menor jerarquía que el primario.

## 10.3 Botón terciario / texto
Uso en links, acciones inline y navegación contextual.

---

# 11. Tags y etiquetas

Categorías de referencia:
- Default.
- Info.
- Success.
- Warning.
- Error.
- Neutral.

No utilizar color como única señal; acompañar con texto, ícono o contexto.

---

# 12. Badges y estados

Ejemplos:
- Nuevo.
- En proceso.
- En revisión.
- Completado.
- Cancelado.

El color puede diferenciar estados, pero siempre debe acompañarse de una etiqueta textual.

---

# 13. Cards

Las cards deben ser:
- Claras.
- Modulares.
- Con jerarquía tipográfica fuerte.
- Con bordes suaves.
- Sin sombras exageradas.
- Con espaciado consistente.
- Preparadas para fondos claros y oscuros.

Estructura típica:
1. Categoría / metadata.
2. Título.
3. Descripción.
4. Contenido principal.
5. Acción o metadata secundaria.

---

# 14. Formularios

## Inputs
- Radio: `md`.
- Borde neutro.
- Fondo blanco o Graphite según tema.
- Label visible.
- Texto de ayuda cuando aplique.

Estados:
- Normal.
- Focus.
- Error.
- Disabled.

## Focus
SEBS Signal puede utilizarse como indicador de foco.

## Error
- Borde o indicador rojo.
- Mensaje descriptivo.
- No depender únicamente del color.

---

# 15. Tablas

Recomendaciones:
- Encabezados en Manrope Medium.
- Datos técnicos en IBM Plex Mono cuando corresponda.
- Estados mediante badge + texto.
- Acciones compactas.
- Divisores ligeros.

---

# 16. Código y datos

IBM Plex Mono es obligatorio en bloques de código, revisiones, IDs, variables, versiones, fechas técnicas, logs, direcciones, nombres de señales y especificaciones.

```txt
project_id: RH-001
revision: 2.1
status: ACTIVE
updated: 2026-05-12T10:30:00Z
```

---

# 17. Iconografía

Debe ser:
- Simple.
- Geométrica.
- Consistente en grosor.
- Legible en tamaños pequeños.
- Preferentemente lineal.

Evitar:
- Íconos excesivamente ilustrativos.
- Detalle innecesario.
- Brillos.
- Sombras.
- 3D decorativo.
- Estética gamer.

---

# 18. Motion

Debe sentirse:
- Preciso.
- Breve.
- Funcional.
- Deliberado.

Puede inspirarse en:
- Ensamble de módulos.
- Aparición de capas.
- Rotación controlada.
- Convergencia.
- Trayectorias.
- Cambios de estado.

Evitar:
- Glitches.
- Cyberpunk.
- Rebotes exagerados.
- Motion puramente decorativo.

---

# 19. Fotografía y renders

Preferencias:
- Producto como protagonista.
- Fondos sobrios.
- Iluminación limpia.
- Contexto técnico real.
- Detalles de materiales.
- Componentes.
- Procesos.
- Prototipos.
- Ensamble.

Evitar stock genérico y tecnología abstracta de neón.

---

# 20. PCB y hardware

SEBS debe funcionar como firma discreta.

Aplicaciones:
- Serigrafía.
- Esquina de PCB.
- Reverso.
- Placa de identificación.
- Carcasa.
- Etiqueta técnica.

Ejemplo:

`SEBS · CTRL-01`  
`REV A`

La marca no debe dominar visualmente el producto.

---

# 21. Documentación

Debe compartir:
- Manrope.
- IBM Plex Mono.
- Grid.
- Espaciado.
- Neutros.
- SEBS Signal.
- Estilo de tablas.
- Diagramas.
- Callouts.
- Versionado.
- Portadas.

La documentación debe sentirse clara, replicable y profesional.

---

# 22. Portfolio SEBS

Dominio principal: `sebs.mx`

Arquitectura recomendada:
- Selected Work.
- Archive.
- About.
- Contact.

## Archive
Vista completa de proyectos por año.

Puede incluir:
- Proyectos.
- Concursos.
- Papers.
- PCBs.
- Web.
- Investigación.
- Herramientas.

## Selected Work
Proyectos curados con:
- Video.
- Contexto.
- Proceso.
- Arquitectura.
- Resultado.
- Documentación.

---

# 23. Arquitectura de proyectos

SEBS funciona como marca principal.

Ejemplos:
- `Torke — by SEBS`
- `Remote Hands — An SEBS project`

El nombre SEBS no necesita dominar todas las aplicaciones.

---

# 24. Comportamiento de sub-marcas

## Elementos heredados de SEBS
- Manrope.
- IBM Plex Mono.
- Grid.
- Espaciado.
- Radios.
- Bordes.
- Neutros.
- Sistema de componentes.
- Lógica documental.
- Firma SEBS.

## Elementos variables
- Color de acento.
- Nombre.
- Símbolo.
- Patrón.
- Hero.
- Fotografía.
- Motion.
- Narrativa.

---

# 25. Tono visual

SEBS debe sentirse:

> Experimental, pero no caótico.  
> Técnico, pero no frío.  
> Accesible, pero no básico.  
> Sobrio, pero no genérico.  
> Profesional, pero no corporativo.  
> Visualmente cuidado, pero nunca decorativo por sí mismo.

---

# 26. Antipatrones

Evitar:
- RGB.
- Neón.
- Estética gamer.
- Hexágonos tecnológicos genéricos.
- Engranes como recurso de marca.
- Circuitos literales como decoración principal.
- Degradados tecnológicos genéricos.
- Glitch.
- Tipografías excesivamente futuristas.
- Interfaces sobrecargadas.
- Sombras pesadas.
- Glassmorphism decorativo.
- Componentes inconsistentes entre proyectos.

## Antipatrones de color (críticos)

Estos son los que rompen la identidad más rápido que cualquier otro error:

- **Rojo como superficie** — nav roja, hero rojo, card roja, banda roja de ancho completo. Ver 3.4.
- **Rojo como color institucional** — usar el rojo con la lógica de un escudo universitario o corporativo: en el header, en el footer, en cada título. SEBS es un estudio, no una institución.
- **Más de un botón primario rojo por vista** — si todo es acción principal, nada lo es.
- **Blanco tratado solo como fondo** — desperdicia la mitad del sistema de superficies. El blanco es un color que se usa, incluyendo texto y logo sobre grafito.
- **Negro tratado solo como texto** — Graphite es superficie con el mismo rango que el blanco.
- **Tintes rojos como relleno decorativo** — el tinte comunica estado, no jerarquía. Ver 3.7.
- **Rojo y acento de proyecto compitiendo en la misma vista** — ver 3.5.
- **Jerarquía sostenida por color** — si al desaturar la vista la composición se desarma, el trabajo lo debía hacer la tipografía y el espaciado.

---

# 27. Tokens CSS de referencia

```css
:root {
  /* --- Paleta base --- */
  --technical-white: #FFFFFF;
  --graphite: #111317;
  --alloy: #6B6F76;
  --alloy-light: #8E939B;         /* alloy para superficie dark: 6.02:1 sobre grafito */
  --mist: #E5E7EB;
  --divider-dark: #2A2D33;

  /* --- Señal (ver 3.4: nunca superficie) --- */
  --sebs-signal: #E30613;
  --sebs-signal-hover: #B80510;   /* 80% */
  --sebs-signal-light: #FF3B47;   /* señal sobre superficie dark: 5.28:1 */
  --sebs-signal-border: #E30613;
  --sebs-signal-tint: rgba(227, 6, 19, 0.12);  /* solo estados, ver 3.7 */
  --sebs-signal-tint-soft: rgba(227, 6, 19, 0.06);

  /* --- Acentos de proyecto (heredan la regla de señal) --- */
  --electric-blue: #2563EB;
  --cyber-teal: #00BFA6;
  --engine-yellow: #FFC107;
  --violet-core: #7C3AED;
  --copper: #FF6B35;

  /* --- Superficies semánticas (ver 3.3) --- */
  --surface: var(--technical-white);
  --surface-secondary: var(--mist);
  --text: var(--graphite);
  --text-secondary: var(--alloy);
  --divider: var(--mist);

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --space-4xl: 64px;
  --space-5xl: 96px;
  --space-6xl: 128px;

  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-round: 9999px;
}

/* Superficies como contexto: cualquier sección, panel o card declara la suya
   y sus hijos heredan los tokens correctos. Ver 3.3. */
.surface-light {
  --surface: var(--technical-white);
  --surface-secondary: var(--mist);
  --text: var(--graphite);
  --text-secondary: var(--alloy);
  --divider: var(--mist);
}

.surface-mist {
  --surface: var(--mist);
  --surface-secondary: var(--technical-white);
  --text: var(--graphite);
  --text-secondary: var(--alloy);
  --divider: var(--technical-white);
}

.surface-dark {
  --surface: var(--graphite);
  --surface-secondary: #1A1D22;
  --text: var(--technical-white);
  --text-secondary: var(--alloy-light);  /* alloy normal falla WCAG aquí */
  --divider: var(--divider-dark);
  --signal-text: var(--sebs-signal-light);
}

.surface-light,
.surface-mist,
.surface-dark {
  background: var(--surface);
  color: var(--text);
}
```

---

# 28. Fuentes CSS de referencia

```css
body {
  font-family: "Manrope", sans-serif;
}

code,
pre,
.mono,
.tech-data {
  font-family: "IBM Plex Mono", monospace;
}
```

---

# 29. Jerarquía de identidad

## Nivel 1 — Marca
SEBS.

## Nivel 2 — Proyecto
Torke, Capa 8, Remote Hands, etc.

## Nivel 3 — Producto / módulo / versión
Ejemplos:
- Controller v2.
- Driver Board.
- Rev A.
- Firmware 2.1.
- Module 03.

---

# 30. Próximos puntos a cerrar

1. Área de seguridad exacta del logotipo.
2. ~~Tamaño mínimo definitivo~~ — cerrado: 32 px en pantalla (§2.7). Falta validar en físico (5/7/10 mm).
3. Micro-logo para 16–24 px. Confirmado como necesario: a 16 px el símbolo actual es ilegible.
4. Archivos maestros SVG. Los PNG actuales son negro puro (`#000000`), no Graphite (`#111317`) — corregir al vectorizar.
5. Validación WCAG definitiva de todas las combinaciones.
6. Migración del portafolio `sebs.mx` al sistema: tipografía (Zilla Slab + Hanken Grotesk → Manrope + IBM Plex Mono), rojo (`#e00034` → `#E30613`) y regla dura de color 3.4.
7. Sistema documental definitivo.
8. Brand book visual final.

---

# 31. Resumen ejecutivo

La identidad SEBS se construye sobre cinco decisiones:

1. **Símbolo + wordmark geométrico** — firma visual propia.
2. **Manrope** — lenguaje principal de interfaz y comunicación.
3. **IBM Plex Mono** — lenguaje técnico y de datos.
4. **Blanco y Grafito como par de superficies** — el ritmo visual se construye alternando superficies, no añadiendo color.
5. **SEBS Signal como señal estricta** — un solo rojo, ~1–2% del área, nunca superficie. Es lo que separa a SEBS de una identidad institucional.
6. **Modularidad** — SEBS proporciona estructura; cada proyecto puede construir una personalidad secundaria.

La meta no es que todos los proyectos se vean iguales.

La meta es que, aunque sean diferentes, se reconozca que:

> **fueron concebidos dentro del mismo sistema.**
