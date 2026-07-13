/* ===================================================================
   Datos del portafolio (edita solo este archivo para actualizar contenido)
   =================================================================== */

/* --- Carrusel del círculo de las apps destacadas (index) ---
   Las imágenes rotan con crossfade cada ~2.6s. */
const FEATURE_SLIDES = {
  gearlab: {
    images: [
      "projects/gear-lab/simple-gear.png",
      "projects/gear-lab/planetary-gear.png",
      "projects/gear-lab/bevel-gear.png",
      "projects/gear-lab/worm-gear.png",
      "projects/gear-lab/rack-pinion-gear.png",
      "projects/gear-lab/internal-gear.png",
    ],
  },
  remotehands: {
    images: [
      "projects/remote-hands/Full-body.jpg",
      "projects/remote-hands/Gripper.jpg",
      "projects/remote-hands/depth-cam.jpg",
      "projects/remote-hands/lidar.jpg",
      "projects/remote-hands/PCB.jpg",
    ],
  },
  capa8: {
    images: [
      "projects/capa-8/simple_net.png",
      "projects/capa-8/home_net.png",
      "projects/capa-8/university_net.png",
      "projects/capa-8/industrial_net.png",
      "projects/capa-8/nodes.png",
    ],
  },
};

/* --- Fotos casuales de la sección About me (rotan con crossfade) ---
   Los espacios del nombre van como %20 en la ruta. */
const ABOUT_PHOTOS = [
  "assets/img/About%20me%201.png",
  "assets/img/About%20me%202.png",
  "assets/img/About%20me%203.png",
];

/* --- Catálogo de la página de proyectos ---
   Organizado por categoría → años (descendente) → items.
   Cada item se pinta como tarjeta clicable que abre un modal con su galería.
   Campos de item:
     - title, tag, desc, repo
     - gallery: [{ src, caption }]  (las imágenes con prefijo "#" van aquí)
       OJO: el "#" del nombre se escribe como "%23" en la ruta (URL-encode),
       si no, el navegador lo toma como fragmento y no carga la imagen.
       Edita los "caption" con el pie de imagen real de cada captura. */
const CATALOG = {
  projects: {
    label: "Projects",
    years: {
      2026: [
        {
          title: "Teleop Mobile-Manipulator",
          tag: "Robotics · XR",
          desc: "Teleoperated mobile-manipulator for inclusive logistics, with mixed-reality (Meta Quest) interface and ZMQ communication.",
          tools: "ROS 2 · ZMQ · MicroPython",
          repo: "https://github.com/sebas30073007/teleop-mobile-manipulator",
          cover: "projects/remote-hands/main.png",
          gallery: [
            { src: "projects/remote-hands/%231.png", caption: "System overview" },
            { src: "projects/remote-hands/%232.png", caption: "XR teleoperation interface" },
            { src: "projects/remote-hands/%233.png", caption: "Mobile base + manipulator" },
            { src: "projects/remote-hands/%234.png", caption: "Control architecture" },
            { src: "projects/remote-hands/%235.png", caption: "Field test" },
          ],
          renders: [],
        },
        {
          title: "Mecatronica Gear Designer",
          tag: "Web tool · CAD",
          desc: "Parametric web tool to design, visualize and export gear systems (STL/STEP/OBJ) for laser cutting and 3D printing.",
          tools: "TypeScript · Three.js",
          repo: "https://github.com/sebas30073007/mecatronica-gear-designer",
          cover: "projects/gear-lab/main.png",
          gallery: [
            { src: "projects/gear-lab/%231.png", caption: "Parametric gear design" },
            { src: "projects/gear-lab/%232.png", caption: "3D preview" },
            { src: "projects/gear-lab/%233.png", caption: "Gear catalog" },
            { src: "projects/gear-lab/%234.png", caption: "Export options" },
            { src: "projects/gear-lab/%235.png", caption: "CAD panel" },
          ],
          renders: [],
        },
        {
          title: "Structural Mapping in Mixed Reality",
          tag: "Mixed Reality",
          desc: "Structural mapping supported by mixed reality for inspection and environment registration.",
          tools: "Unity · AR Foundation",
          repo: "https://github.com/sebas30073007/mapeo-estructural-en-realidad-mixta",
          cover: "",
          gallery: [],
          renders: [],
        },
        {
          title: "Capa 8 — Network AI",
          tag: "Artificial Intelligence",
          desc: "AI applied to computer networks — the 'layer 8', the human factor — generating OSI topology diagrams.",
          tools: "PyTorch · Scapy",
          repo: "https://github.com/sebas30073007/IA_mecatronica_Capa8",
          cover: "projects/capa-8/main.png",
          gallery: [
            { src: "projects/capa-8/%231.png", caption: "Topology overview" },
            { src: "projects/capa-8/%232.png", caption: "Home network" },
            { src: "projects/capa-8/%233.png", caption: "University network" },
            { src: "projects/capa-8/%234.png", caption: "Industrial network" },
            { src: "projects/capa-8/%235.png", caption: "Node library" },
          ],
          renders: [],
        },
      ],
      2025: [
        {
          title: "Waste Sorting Robot",
          tag: "Cyber-Physical Systems",
          desc: "Mobile robot that collects and classifies waste (glass, cans, Tetra Pak) using computer vision and a monitoring UI.",
          tools: "OpenCV · Python",
          repo: "https://github.com/sebas30073007/Sistemas_Ciberfisicos_Proyecto",
          cover: "",
          gallery: [],
          renders: [],
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
