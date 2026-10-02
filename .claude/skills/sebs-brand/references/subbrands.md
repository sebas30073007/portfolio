# Sub-marcas y proyectos

> La meta no es que todos los proyectos se vean iguales. La meta es que, aunque sean diferentes, se reconozca que **fueron concebidos dentro del mismo sistema.**

Lo que hace visible el parentesco no es el estilo: es la **cartela** (capa 1, idéntica en todos) y la **capa 0** compartida. Lo que hace visible al proyecto es su acento, su hero y su materia.

---

## 1. La regla 70/30

**70% SEBS · 30% identidad del proyecto.**

| Se hereda — no se toca (capas 0 y 1) | Puede variar (capa 2) |
|---|---|
| Manrope + IBM Plex Mono | Color de acento (uno) |
| Grid y contenedores | Símbolo del proyecto |
| Escala de espaciado | Hero |
| Radios y bordes | Patrón de superficies |
| Neutros y superficies | Motion (una secuencia) |
| Lógica de componentes | Fotografía y renders |
| Cartela y dot de estado | Narrativa visual |
| Firma SEBS | Nombre |

Si un proyecto quiere cambiar tipografía, grid, espaciado o la cartela, ya no es una sub-marca de SEBS — es otra marca. Decirlo explícitamente en vez de romper el sistema.

---

## 2. Color de acento

Paleta autorizada:

| Acento | HEX | Texto sobre el acento | Como texto sobre blanco |
|---|---|---|---|
| Electric Blue | `#2563EB` | blanco | ✅ |
| Cyber Teal | `#00BFA6` | grafito | ❌ solo indicador |
| Engine Yellow | `#FFC107` | grafito | ❌ solo indicador |
| Violet Core | `#7C3AED` | blanco | ✅ |
| Copper | `#FF6B35` | grafito | ⚠️ solo grande |

Tres reglas:

1. **El acento hereda la regla dura del rojo.** Es señal, no superficie: ~1–2% del área, nunca fondo de nav, hero, card o sección.
2. **El acento reemplaza al rojo, no se suma.** Dentro de una vista de proyecto hay rojo **o** acento — nunca los dos. La firma SEBS en la cartela se mantiene en Graphite o blanco; el dot de estado activo toma el acento.
3. **Un acento por proyecto.** No paletas de proyecto. Los colores de contenido (tipos de nodo, capas de CAD, series de gráfica) no son acento: son datos y viven en la capa 3.

Implementación (capa 2): redefinir los tokens de señal en `:root` del `project.css` y nada más de color.

```css
:root {
  --sebs-signal: var(--engine-yellow);
  --sebs-signal-hover: #E0A800;
  --sebs-signal-light: var(--engine-yellow);
  --on-signal: var(--graphite);     /* texto sobre el acento; blanco por defecto */
}
```

---

## 3. Niveles de identidad

```
Nivel 1 — Marca       SEBS
Nivel 2 — Proyecto    Capa 8 · GearLab · Máquina de dibujo · Recicla · Remote Hands · course-docs
Nivel 3 — Producto    Controller v2 · Driver Board · Rev A · Firmware 2.1
```

Nomenclatura: `GearLab — by SEBS`, `Remote Hands — An SEBS project`. En la cartela el nombre va solo; el símbolo ya dice SEBS.

---

## 4. Al dar identidad a un proyecto

1. Darlo de alta en el **registro** (§5): ID, acento, estado.
2. Conectarlo a la jerarquía (`signature.md` §6): capas 0 y 1 por URL, `project.css` con el acento.
3. Decidir el patrón de superficies: qué secciones son `light` y cuáles `dark`. Aquí gana personalidad sin romper nada.
4. Elegir hero y fotografía. El hero de un proyecto SEBS es **demo, no claim**: lo más característico de su materia (la app corriendo, el gemelo, el objeto).
5. Definir la única secuencia de motion, si aplica.
6. Colocar la cartela con los datos del registro.
7. **No tocar** tipografía, grid, espaciado, radios, cartela ni lógica de componentes.

Verificación: poner la página del proyecto junto a la de SEBS. Deben verse distintas pero obviamente emparentadas. Si se ven idénticas, faltó personalidad. Si no se reconoce el parentesco, se rompió el 70%.

---

## 5. Registro de proyectos

Fuente del estado: `E:\30_PROJECTS\_INDEX.md`. Al cambiar un estado allí, cambia aquí y en la cartela.

| ID | Proyecto | Acento | Estado | Stack | Sitio |
|---|---|---|---|---|---|
| `SEBS-00` | sebs.mx (portafolio) | SEBS Signal (rojo) | LIVE | HTML | `E:\20_AREAS\sebs\sitio\portfolio` |
| `CAPA8-01` | Capa 8 | Copper | LIVE | HTML | `E:\30_PROJECTS\capa8\web` |
| `GEAR-01` | GearLab (antes Torke) | Engine Yellow | LIVE | React/Vite | `E:\30_PROJECTS\gear-lab\web` |
| `PLOT-01` | Máquina de dibujo | Electric Blue | ACTIVE | HTML (offline) | `E:\30_PROJECTS\maquina-dibujo\software` |
| `KICAD-01` | Curso KiCad básico (course-docs) | ninguno — hereda el rojo | COURSE | Astro Starlight | `E:\30_PROJECTS\course-docs\web` |
| `RECICLA-01` | Recicla, clasificador de basura | Cyber Teal | ACTIVE | Astro Starlight | `E:\30_PROJECTS\clasifica-basura\web` |
| `TELEOP-01` | Remote Hands / teleop móvil-manipulador | Violet Core | ACTIVE | Jekyll just-the-docs | `E:\30_PROJECTS\teleop-mobile-manipulator\web` |

Acentos decididos el 2026-10-02. Sin asignar todavía: PCBs (`pcbs/`), papers, competitions — llevan cartela con el rojo SEBS y sin acento hasta que se decida.

Estado de herencia al 2026-10-02 (para saber por dónde empezar):

- **course-docs y Recicla**: capa 0 ya vía `sebs-tokens.css` + `starlight-bridge.css`. Falta: capa 0 por URL, cartela, acento.
- **Capa 8 y Máquina de dibujo**: tokens pegados en `:root`. Falta: capa 0 por URL (Máquina: copia offline), cartela. Capa 8 ya usa Copper.
- **GearLab**: tokens SEBS pero tres familias ajenas (Space Grotesk, Inter, JetBrains Mono) y 25 fondos rojos vía alias `--red`. Fuera del sistema.
- **teleop**: tema por defecto de just-the-docs, violeta ajeno. Fuera del sistema.
