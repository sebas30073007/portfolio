# PCB assets — pipeline sostenible

Cómo mantener los renders 3D de las PCBs **livianos y escalables** a medida que
agregues más placas con los años.

## El problema que evita

Poner un `<model-viewer>` en cada tarjeta abre **un contexto WebGL por placa**.
El navegador corta a ~16 contextos (y antes de eso, N modelos girando funden
CPU/GPU/batería). Con `.glb` de CAD de 10–13 MB cada uno, además, la página
descargaría cientos de MB.

## La solución

Por cada placa, la tarjeta muestra un **video de turntable** (giro pre-renderizado,
sin WebGL, ~250 KB) y el **modal** muestra un único modelo 3D interactivo,
comprimido con Draco (~1 MB en vez de 10+). El 3D en vivo se limita a 1 a la vez.

El script `generate-pcb-assets.mjs` produce, para cada carpeta de placa:

| Archivo | Qué es | Se usa en |
|---|---|---|
| `model.glb` | glTF Draco comprimido (~1 MB) | visor interactivo del modal |
| `turntable.webm` | giro 360° (VP9) | video de la tarjeta |
| `turntable.mp4` | fallback H.264 | video de la tarjeta (Safari viejo) |
| `poster.webp` | primer frame | poster del video / cover de la tarjeta |

Compresión típica: **10–13 MB → ~1 MB** el `.glb`, y la tarjeta pasa de 10 MB +
WebGL a ~0.25 MB de video.

## Requisitos (una sola vez)

- Node 18+ y [ffmpeg](https://ffmpeg.org/) en el PATH.
- Chrome o Edge instalado (se detecta solo; o exportá `CHROME_PATH`).
- Instalar dependencias del pipeline:
  ```bash
  cd scripts
  npm install
  ```
  `puppeteer-core` usa el Chrome que ya tenés (no descarga otro navegador).
- Internet la primera corrida (model-viewer baja su decoder Draco de un CDN).

## Agregar una placa nueva

1. Exportá el modelo del CAD a `.glb` y ponelo en `pcbs/<TuPlaca>/`
   (cualquier nombre menos `model.glb`).
2. Corré el pipeline:
   ```bash
   # Balanceo (recomendado): de frente → +45° → frente → -45° → frente, bucle 7s
   node scripts/generate-pcb-assets.mjs pcbs/<TuPlaca> --mode swing

   # Giro 360° completo
   node scripts/generate-pcb-assets.mjs pcbs/<TuPlaca> --mode spin
   ```

   **Modos de movimiento**
   - `--mode swing` (balanceo con easing en los extremos, vía onda seno).
     Ajustes: `--amp 45` (grados a cada lado), `--loop 7` (segundos por bucle),
     `--fps 30`.
   - `--mode spin` (giro 360° continuo). Ajustes: `--frames 60`, `--fps 12`.

   Comunes: `--elev 68` (elevación de cámara; menor = más de frente),
   `--width 800` (px del video). `--all` procesa todas las carpetas de `pcbs/`.
3. Agregá las imágenes de detalle (manufactura, capas, esquemático) a la carpeta.
4. Añadí la entrada en `js/data.js` (sección `pcbs`):
   ```js
   {
     title: "Tu Placa", tag: "PCB · ...",
     desc: "...",
     tools: "KiCad · JLCPCB", github: null, url: null, ctaLabel: "...",
     spin:   "pcbs/TuPlaca/turntable",
     poster: "pcbs/TuPlaca/poster.webp",
     cover:  "pcbs/TuPlaca/poster.webp",
     model:  "pcbs/TuPlaca/model.glb",
     gallery: [],
     renders: [ "pcbs/TuPlaca/manufactura.png", "pcbs/TuPlaca/capas.png" ],
   }
   ```

## Notas

- El `.glb` crudo puede quedar en la carpeta como fuente, pero **no hace falta
  publicarlo** (pesa mucho). Solo se sirven `model.glb` + los 3 assets generados.
- El script usa `--instance false` en la compresión a propósito: el paso de GPU
  instancing de gltf-transform desplazaba vértices y rompía el encuadre del modelo.
- Si el modelo sale chico o descentrado, revisá que el `.glb` no traiga geometría
  fantasma lejana; `model-viewer` encuadra sobre el bounding box completo.
