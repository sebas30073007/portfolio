# Portafolio — Sebastián Méndez Villegas (SMV)

Portafolio personal de proyectos de ingeniería mecatrónica y sistemas
ciberfísicos. Hecho con **HTML, CSS y JavaScript** (sin frameworks), listo para
publicar en **GitHub Pages**. Diseño base tomado de `assets/docs/portfolio SMV.pdf`.

## Estructura

```
portfolio/
├── index.html              # Home: feed de proyectos (búsqueda + filtro), sin hero
├── featured-projects.html  # Catálogo premium: Torque, Remote Hands, Capa8
├── css/
│   └── styles.css          # Sistema de diseño (colores/tipografía en :root)
├── js/
│   ├── data.js              # TODO el contenido editable (catálogo)
│   └── main.js               # Render del feed, modal, filtros y paneles About/Contact
├── assets/
│   ├── img/                # Coloca aquí profile.jpg (foto del hero)
│   └── docs/                # PDF de diseño base
└── README.md
```

About y Contact ya no son páginas propias: viven como paneles tipo acordeón
que se despliegan desde los botones del navbar (`js/main.js` → `initRevealPanels`),
disponibles en cualquier página.

## Editar contenido

Todo el contenido vive en **`js/data.js`**:

- `TIMELINE` — nodos (año + mes opcional) de la línea de tiempo del index.
- `CATALOG` — categorías de la página de proyectos. Cada una tiene `years`, y
  cada año un arreglo de tarjetas `{ title, tag, desc, repo, demo }`.
  Deja `years: {}` para mostrar el estado "próximamente".

## Foto de perfil

Coloca tu foto en `assets/img/profile.jpg`. Si no existe, el hero muestra las
iniciales "SMV" como respaldo (no rompe nada).

## Ver localmente

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python -m http.server 8000   # luego http://localhost:8000
```

## Publicar en GitHub Pages

1. Sube esta carpeta a un repositorio en GitHub.
2. Settings → Pages → Source: `main` / carpeta raíz (`/`).

## Estado (esta iteración)

Base del diseño replicada. Pendiente para siguientes iteraciones:
- Páginas/modales de detalle por proyecto, paper y competición.
- Visor 3D de ensamble de PCBs (KiCAD → Inventor → STEP/GLB).
- Tarjeta de presentación tipo PCB transparente interactiva en Contact.
- Foto real, textos definitivos y datos de papers/competiciones.

## Enlaces

- GitHub: https://github.com/sebas30073007
- Torke (app en vivo): https://torke.sebs.mx/
- Capa 8 (app en vivo): https://capa8.sebs.mx/
- Capa 8 (open source): https://github.com/sebas30073007/IA_mecatronica_Capa8

> Nota: se corrigieron typos del PDF ("Proyects"→"Projects",
> "arquitectures"→"architectures", etc.) por tratarse de un portafolio público.
> Torke es de código cerrado (sin repo público).
