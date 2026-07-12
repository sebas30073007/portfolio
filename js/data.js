/* ===================================================================
   Datos del portafolio (edita solo este archivo para actualizar contenido)
   =================================================================== */

/* --- Carrusel del círculo de las apps destacadas (index) ---
   Empieza en el avatar y va rotando las capturas cada ~1.75s. */
const FEATURE_SLIDES = {
  gearlab: {
    avatar: "assets/svg/avatar-gear.svg",
    images: [
      "projects/gear-lab/simple-gear.png",
      "projects/gear-lab/planetary-gear.png",
      "projects/gear-lab/bevel-gear.png",
      "projects/gear-lab/worm-gear.png",
      "projects/gear-lab/rack-pinion-gear.png",
      "projects/gear-lab/internal-gear.png",
    ],
  },
  capa8: {
    avatar: "assets/svg/avatar-capa8.svg",
    images: [
      "projects/capa-8/simple_net.png",
      "projects/capa-8/home_net.png",
      "projects/capa-8/university_net.png",
      "projects/capa-8/industrial_net.png",
      "projects/capa-8/nodes.png",
    ],
  },
};

/* --- Línea de tiempo del index (About me) ---
   Cada nodo es un punto en el tiempo. "month" es opcional. */
const TIMELINE = [
  { year: "2021", month: "" },
  { year: "2022", month: "Jan" },
];

/* --- Catálogo de la página de proyectos ---
   Organizado por categoría → años (descendente) → items.
   Cada item se pinta como tarjeta. Deja el arreglo vacío para
   mostrar un estado "próximamente".
   Campos de item: title, tag, desc, repo, demo */
const CATALOG = {
  projects: {
    label: "Projects",
    years: {
      2026: [
        {
          title: "Teleop Mobile-Manipulator",
          tag: "Robotics · XR",
          desc: "Teleoperated mobile-manipulator for inclusive logistics, with mixed-reality (Meta Quest) interface and ZMQ communication.",
          repo: "https://github.com/sebas30073007/teleop-mobile-manipulator",
          demo: "",
        },
        {
          title: "Mecatronica Gear Designer",
          tag: "Web tool · CAD",
          desc: "Parametric web tool to design, visualize and export gear systems (STL/STEP/OBJ) for laser cutting and 3D printing.",
          repo: "https://github.com/sebas30073007/mecatronica-gear-designer",
          demo: "",
        },
      ],
      2025: [
        {
          title: "Structural Mapping in Mixed Reality",
          tag: "Mixed Reality",
          desc: "Structural mapping supported by mixed reality for inspection and environment registration.",
          repo: "https://github.com/sebas30073007/mapeo-estructural-en-realidad-mixta",
          demo: "",
        },
        {
          title: "Capa 8 — Network AI",
          tag: "Artificial Intelligence",
          desc: "AI applied to computer networks — the 'layer 8', the human factor — generating OSI topology diagrams.",
          repo: "https://github.com/sebas30073007/IA_mecatronica_Capa8",
          demo: "",
        },
      ],
      2024: [
        {
          title: "Waste Sorting Robot",
          tag: "Cyber-Physical Systems",
          desc: "Mobile robot that collects and classifies waste (glass, cans, Tetra Pak) using computer vision and a monitoring UI.",
          repo: "https://github.com/sebas30073007/Sistemas_Ciberfisicos_Proyecto",
          demo: "",
        },
      ],
    },
  },

  papers: {
    label: "Papers",
    years: {}, // por documentar
  },

  competitions: {
    label: "Competitions",
    years: {}, // por documentar
  },

  pcbs: {
    label: "PCB's",
    years: {}, // sección aún no habilitada
    disabled: true,
    note: "PCB assembly viewer (bare board vs. populated, 3D) coming soon.",
  },
};
