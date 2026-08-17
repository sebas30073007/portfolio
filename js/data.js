/* ===================================================================
   Datos del portafolio (edita solo este archivo para actualizar contenido)
   =================================================================== */

/* --- Carrusel del círculo de las apps destacadas (index) ---
   Las imágenes rotan con crossfade cada ~2.6s. */
const FEATURE_SLIDES = {
  torke: {
    images: [
      "projects/torke/simple-gear.png",
      "projects/torke/planetary-gear.png",
      "projects/torke/bevel-gear.png",
      "projects/torke/worm-gear.png",
      "projects/torke/rack-pinion-gear.png",
      "projects/torke/internal-gear.png",
    ],
  },
  remotehands: {
    images: [
      "projects/teleop-mobile-manipulator/Full-body.jpg",
      "projects/teleop-mobile-manipulator/Gripper.jpg",
      "projects/teleop-mobile-manipulator/depth-cam.jpg",
      "projects/teleop-mobile-manipulator/lidar.jpg",
      "projects/teleop-mobile-manipulator/PCB.jpg",
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
     - title, tag, desc, tools
     - subtype: "hardware" | "software" — solo en la categoría "projects";
                alimenta el filtro de la página (Hardware projects / Software
                projects). El resto de categorías usa su propia clave
                (papers, competitions, pcbs) como tipo de filtro.
     - github: URL del repo (si es open-source → muestra el icono de GitHub).
               Pon null si es de código cerrado (no se muestra el icono).
     - url + ctaLabel: destino y texto del botón del modal.
     - cover: imagen de portada de la tarjeta.
     - gallery: [{ src, caption }] imágenes ("#" va como "%23" en la ruta),
                o { type: "video", id: "<youtubeId>", caption } para un video.
     - renders: [] (imágenes de render 3D, opcional).
     - model: ruta a un .glb para mostrar un visor 3D interactivo en el modal
              (los espacios de la carpeta van como %20 en la ruta).
     - modelBg: opcional, override del fondo del visor 3D (CSS background).
                Sin esto usa el fondo oscuro por defecto de .modal__model.
     - locked: true → tarjeta bloqueada ("Coming soon"): portada atenuada,
               sin acciones (More info / enlace externo) y sin abrir el
               modal al hacer clic. Para módulos de un curso aún no listos.
     - date: opcional, "Mon YYYY" (mes abreviado en inglés). La tarjeta sigue
             mostrando solo el año (la clave del bucket `years`); este campo
             es el detalle de mes que se ve dentro del modal. Si el mes real
             cae en un año distinto al de siempre mostrado, la tarjeta se
             reubica en el bucket `years` de ese año. Las PCB's no llevan
             `date` todavía — se quedan solo con el año. */
const CATALOG = {
  projects: {
    label: "Projects",
    years: {
      2026: [
        {
          // Antes "Remote Hands". El prototipo se documenta en dos fichas
          // separadas: aquí el desarrollo de hardware, y en competitions →
          // "James Dyson Award" el material de la convocatoria. Misma máquina,
          // documentación distinta, carpetas distintas.
          title: "Teleop Mobile Manipulator",
          subtype: "hardware",
          tag: "Robotics · Teleoperation",
          date: "May 2026",
          desc: "Teleoperated mobile manipulator for inclusive logistics: tracked base, belt-driven arm with a custom gripper, depth camera and LiDAR onboard, and an in-house ESP32-C3 control board. ROS 2 + ZMQ link the machine to the operator station.",
          tools: "ROS 2 · ZMQ · MicroPython",
          github: "https://github.com/sebas30073007/teleop-mobile-manipulator",
          url: "https://sebas30073007.github.io/teleop-mobile-manipulator/",
          ctaLabel: "Visit site",
          // Tarjeta: video turntable (spin) + poster. Modal: model.glb (Draco)
          // como primer elemento de la galería + imágenes seleccionables.
          // Generado con scripts/generate-pcb-assets.mjs (mismo pipeline que las PCBs).
          spin: "projects/teleop-mobile-manipulator/turntable",
          poster: "projects/teleop-mobile-manipulator/poster.webp",
          cover: "projects/teleop-mobile-manipulator/poster.webp",
          model: "projects/teleop-mobile-manipulator/model.glb",
          // Fondo más claro solo en este visor 3D (el resto de proyectos/PCBs
          // usa el fondo oscuro por defecto de .modal__model).
          modelBg: "radial-gradient(circle at 50% 42%, #f4f5f7, #dcdfe4 82%)",
          gallery: [
            { src: "projects/teleop-mobile-manipulator/main.png", caption: "Manipulator render" },
            { src: "projects/teleop-mobile-manipulator/Full-body.jpg", caption: "Assembled platform" },
            { src: "projects/teleop-mobile-manipulator/Gripper.jpg", caption: "Custom gripper" },
            { src: "projects/teleop-mobile-manipulator/depth-cam.jpg", caption: "Intel i435 depth camera" },
            { src: "projects/teleop-mobile-manipulator/lidar.jpg", caption: "RPLidar C1" },
            { src: "projects/teleop-mobile-manipulator/PCB.jpg", caption: "Custom ESP32-C3 control board" },
          ],
          renders: [],
        },
        {
          title: "Torke",
          subtype: "software",
          tag: "Web tool · CAD",
          date: "Oct 2026",
          desc: "Parametric web tool to design, visualize and export gear systems (STL/STEP/OBJ) for laser cutting and 3D printing.",
          tools: "TypeScript · Three.js",
          github: null,
          url: "https://torke.sebs.mx/",
          ctaLabel: "Visit site",
          cover: "projects/torke/main.png",
          gallery: [
            { src: "projects/torke/%231.png", caption: "Parametric gear design" },
            { src: "projects/torke/%232.png", caption: "3D preview" },
            { src: "projects/torke/%233.png", caption: "Gear catalog" },
            { src: "projects/torke/%234.png", caption: "Export options" },
            { src: "projects/torke/%235.png", caption: "CAD panel" },
          ],
          renders: [],
        },
        {
          title: "Structural Mapping in Mixed Reality",
          subtype: "software",
          tag: "Mixed Reality",
          desc: "Structural mapping supported by mixed reality for inspection and environment registration.",
          tools: "Unity · AR Foundation",
          github: "https://github.com/sebas30073007/mapeo-estructural-en-realidad-mixta",
          url: "https://github.com/sebas30073007/mapeo-estructural-en-realidad-mixta",
          ctaLabel: "View repository",
          cover: "",
          gallery: [],
          renders: [],
        },
        {
          title: "Capa 8 — Network AI",
          subtype: "software",
          tag: "Artificial Intelligence",
          date: "May 2026",
          desc: "AI applied to computer networks — the 'layer 8', the human factor — generating OSI topology diagrams.",
          tools: "PyTorch · Scapy",
          github: "https://github.com/sebas30073007/IA_mecatronica_Capa8",
          url: "https://capa8.sebs.mx/",
          ctaLabel: "Visit site",
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
          subtype: "hardware",
          tag: "Cyber-Physical Systems",
          date: "Dec 2025",
          desc: "UR3 robotic arm cell that identifies and sorts glass, cans and Tetra Pak using computer vision, with an RFID-gated HMI, cloud APIs and a monitoring dashboard.",
          tools: "UR3 · Computer Vision · Jetson · Firebase",
          github: "https://github.com/sebas30073007/Sistemas_Ciberfisicos_Proyecto",
          url: "https://sebas30073007.github.io/Sistemas_Ciberfisicos_Proyecto/",
          ctaLabel: "View documentation",
          // Tarjeta: foto fija (sin turntable por ahora). Modal: model.glb
          // (Draco, comprimido con el mismo pipeline que las PCBs, sin video)
          // como primer elemento de la galería.
          cover: "projects/clasifica-basura/Robot.jpg",
          model: "projects/clasifica-basura/model.glb",
          // Mismo fondo claro que el visor 3D de Teleop Mobile Manipulator.
          modelBg: "radial-gradient(circle at 50% 42%, #f4f5f7, #dcdfe4 82%)",
          gallery: [
            { src: "projects/clasifica-basura/Robot.jpg", caption: "Assembled robot cabinet" },
          ],
          renders: [],
        },
      ],
    },
  },

  papers: {
    label: "Papers",
    years: {
      2025: [{
        title: "Balancing Accuracy and Adaptability: Hybrid Analytical-Neural Control in Omnidirectional Robots",
        tag: "Robotics · Control",
        date: "Nov 2025",
        desc: "Three control strategies for navigation and trajectory tracking are presented and compared using the omnidirectional mobile robot RoboMaster S1, equipped with a Vicon motion capture system and controlled via Python: (1) classic potential field control, (2) neural network + proportional–integral control with a feed-forward neural network predicting wheel velocities, and (3) hybrid potential + NN control, where a second neural network trained on the residual error supplies an online corrective signal. Main contributions: empirical validation of a neural model for velocity prediction in omnidirectional platforms, a neural compensator integrated with analytical control laws, and a comparative experimental analysis of potential-based, neural and hybrid control approaches.",
        descLabel: "Abstract",
        tools: "Control · Neural Networks", github: null,
        url: "papers/Balancing%20Accuracy%20and%20Adaptability%20Hybrid%20Analytical%20Neural%20Control%20in%20Omnidirectional%20Robots/IEEE_CongresoICEV25_Hybrid_Analytical_Neural_Control_in_Omnidirectional_Robots.pdf",
        ctaLabel: "Open paper",
        cover: "papers/Balancing%20Accuracy%20and%20Adaptability%20Hybrid%20Analytical%20Neural%20Control%20in%20Omnidirectional%20Robots/first%20page.png",
        // El modal muestra solo el abstract (sin galería); la portada A4
        // se conserva como miniatura de la tarjeta.
        gallery: [], renders: [],
      }],
    },
  },

  competitions: {
    label: "Competitions",
    years: {
      2026: [
        {
          // Convocatoria del prototipo que en projects vive como "Teleop Mobile
          // Manipulator": aquí van los tableros de la entrega y el video, no el
          // desarrollo de hardware.
          title: "James Dyson Award", tag: "Design · Competition",
          date: "Sep 2026",
          desc: "Award entry built on the teleoperated mobile manipulator, framed as inclusive logistics: an operator in a wheelchair picks and places warehouse stock through a Meta Quest mixed-reality interface, with a real-time digital twin, selectable LiDAR views and a live depth-camera feed.",
          tools: "Product Design · XR", github: null, url: null, ctaLabel: "Entry page coming soon",
          cover: "competitions/The%20James%20Dyson%20Award/main.png",
          gallery: [
            { src: "competitions/The%20James%20Dyson%20Award/%231.png", caption: "Entry board — system overview" },
            { type: "video", id: "mCvmUQFTl2M", caption: "Submission video" },
            { src: "competitions/The%20James%20Dyson%20Award/%232.png", caption: "XR teleoperation interface" },
            { src: "competitions/The%20James%20Dyson%20Award/%233.png", caption: "Operator view + real-time digital twin" },
            { src: "competitions/The%20James%20Dyson%20Award/%234.png", caption: "Control architecture" },
            { src: "competitions/The%20James%20Dyson%20Award/%235.png", caption: "Field test" },
          ],
          renders: [],
        },
      ],
      2024: [
        {
          title: "2° Concurso Colombiano de Cohetería Deportiva", tag: "Rocketry · Competition",
          date: "Nov 2024",
          desc: "Participation in the Colombian sport rocketry competition. Preparation, technical work, analysis and results will be documented here.",
          tools: "Rocketry · Engineering", github: null, url: null, ctaLabel: "More details coming soon",
          cover: "competitions/2%C2%B0%20Concurso%20Colombiano%20de%20Coheter%C3%ADa%20Deportiva/IMG-20241124-WA0004.jpg",
          gallery: [{ src: "competitions/2%C2%B0%20Concurso%20Colombiano%20de%20Coheter%C3%ADa%20Deportiva/IMG-20241124-WA0004.jpg", caption: "Competition team" }], renders: [],
        },
        {
          title: "Reto del Fuego", tag: "Engineering · Competition",
          date: "May 2024",
          desc: "Engineering competition participation. Project development, presentation and results will be added here.",
          tools: "Design · Prototyping", github: null, url: null, ctaLabel: "More details coming soon",
          cover: "competitions/Reto%20del%20Fuego/IMG-20240502-WA0012.jpg",
          gallery: [{ src: "competitions/Reto%20del%20Fuego/IMG-20240502-WA0012.jpg", caption: "Competition team" }], renders: [],
        },
      ],
    },
  },

  courses: {
    label: "Courses",
    years: {
      2026: [
        {
          title: "KiCad Basics",
          tag: "Course · KiCad",
          date: "Sep 2026",
          desc: "Getting started with KiCad: schematic capture fundamentals, symbols, wiring and project setup.",
          tools: "KiCad", github: null,
          url: "https://sebas30073007.github.io/course-docs/",
          ctaLabel: "Start course",
          cover: "courses/KiCad/kicad-basics.png",
          gallery: [{ src: "courses/KiCad/kicad-basics.png", caption: "KiCad Basics" }],
          renders: [],
        },
        {
          title: "KiCad Intermediate",
          tag: "Course · KiCad",
          desc: "Coming soon.",
          tools: "KiCad", github: null, url: null, ctaLabel: "Coming soon",
          cover: "courses/KiCad/kicad-intermediate.png",
          gallery: [], renders: [],
          locked: true,
        },
        {
          title: "KiCad Advanced",
          tag: "Course · KiCad",
          desc: "Coming soon.",
          tools: "KiCad", github: null, url: null, ctaLabel: "Coming soon",
          cover: "courses/KiCad/kicad-advanced.png",
          gallery: [], renders: [],
          locked: true,
        },
      ],
    },
  },

  pcbs: {
    label: "PCB's",
    years: {
      2026: [
        {
          title: "Drivers Controller", tag: "PCB · Motor Control",
          desc: "Controller board for up to three NEMA17 stepper drivers using DIR/PULL pulse signals. Transistor stages shift the ESP32-C3's 3.3 V logic up to clean 5 V pulses, and an I2C input/output pair makes it easy to chain the board with other controllers.",
          tools: "KiCad · JLCPCB", github: null,
          url: "https://github.com/sebas30073007/portfolio/tree/main/pcbs/Drivers-controller",
          ctaLabel: "View KiCad files",
          // Tarjeta: video turntable (spin) + poster. Modal: model.glb (Draco)
          // como primer elemento de la galería + imágenes seleccionables.
          spin: "pcbs/Drivers-controller/turntable",
          poster: "pcbs/Drivers-controller/poster.webp",
          cover: "pcbs/Drivers-controller/poster.webp",
          model: "pcbs/Drivers-controller/model.glb",
          // Solo el visor 3D del modal — la tarjeta (turntable/poster) no se
          // regeneró, sigue con el fondo oscuro de siempre.
          modelBg: "radial-gradient(circle at 50% 42%, #4d5eea, #1c2570 82%)",
          gallery: [
            { src: "pcbs/Drivers-controller/Real.png", caption: "Assembled board" },
            { src: "pcbs/Drivers-controller/Render.png", caption: "Manufacturing render" },
            { src: "pcbs/Drivers-controller/Top_layer.png", caption: "Top copper layer" },
            { src: "pcbs/Drivers-controller/Down_layer.png", caption: "Bottom copper layer" },
            { src: "pcbs/Drivers-controller/Squematic.png", caption: "Connection schematic" },
          ],
          renders: [],
        },
        {
          title: "Puente H", tag: "PCB · Motor Driver",
          desc: "H-bridge driver for 12–24 V motors: works stably at 4 A continuous and withstands current peaks up to 8 A. Optocouplers fully separate the logic stage from the power stage, and an I2C input/output pair lets it chain with other boards.",
          tools: "KiCad · JLCPCB", github: null,
          url: "https://github.com/sebas30073007/portfolio/tree/main/pcbs/PuenteH",
          ctaLabel: "View KiCad files",
          spin: "pcbs/PuenteH/turntable",
          poster: "pcbs/PuenteH/poster.webp",
          cover: "pcbs/PuenteH/poster.webp",
          model: "pcbs/PuenteH/model.glb",
          modelBg: "radial-gradient(circle at 50% 42%, #4d5eea, #1c2570 82%)",
          gallery: [
            { src: "pcbs/PuenteH/Real.png", caption: "Assembled board" },
            { src: "pcbs/PuenteH/Render.png", caption: "Manufacturing render" },
            { src: "pcbs/PuenteH/Top_layer.png", caption: "Top copper layer" },
            { src: "pcbs/PuenteH/Down_layer.png", caption: "Bottom copper layer" },
            { src: "pcbs/PuenteH/Squematic.png", caption: "Electrical schematic" },
          ],
          renders: [],
        },
        {
          title: "Servo Controller v2",
          tag: "PCB · ESP32-C3",
          desc: "Educational kit for a small unicycle cart driven by two continuous-rotation servos. The board carries an ESP32-C3 SuperMini, an OLED display and an onboard charger for LiPo and Li-ion batteries.",
          tools: "Autodesk Inventor · KiCad",
          github: null,
          url: "https://github.com/sebas30073007/portfolio/tree/main/pcbs/Servo-controller",
          ctaLabel: "View KiCad files",
          spin: "pcbs/Servo-controller/turntable",
          poster: "pcbs/Servo-controller/poster.webp",
          cover: "pcbs/Servo-controller/poster.webp",
          model: "pcbs/Servo-controller/model.glb",
          modelBg: "radial-gradient(circle at 50% 42%, #4d5eea, #1c2570 82%)",
          gallery: [
            { src: "pcbs/Servo-controller/Render.png", caption: "Manufacturing render" },
            { src: "pcbs/Servo-controller/Top_layer.png", caption: "Top copper layer" },
            { src: "pcbs/Servo-controller/Down_layer.png", caption: "Bottom copper layer" },
            { src: "pcbs/Servo-controller/Squematic.png", caption: "Electrical schematic" },
          ],
          renders: [],
        },
      ],
    },
  },
};
