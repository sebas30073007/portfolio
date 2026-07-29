/* ===================================================================
   Tarjeta de presentación de vidrio (contacto)
   - Visor A: losa procedural 90 × 50 mm, fillet 3.2 mm, texto grabado
   - Visor B: Card.glb (export CAD) en la MISMA escena/iluminación para
     comparar de forma justa (env tenue + fondo oscuro = vidrio legible)
   =================================================================== */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Dimensiones reales de la tarjeta (unidades de escena = mm)
const CARD_W = 90;
const CARD_H = 50;
const CARD_T = 3; // grosor de la losa
const FILLET = 3.2; // radio de esquina
const BEVEL = 0.5; // canto suavizado del borde

const NAME_TEXT = "Sebastian Mendez Villegas";
const EMAIL_TEXT = "sebastian.mendez14yyy@gmail.com";
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/fonts/helvetiker_regular.typeface.json";

const webgl = window.WebGL2RenderingContext || window.WebGLRenderingContext;

// ---- Escena base compartida por ambos visores ----
function createViewer(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  // Reflejos contenidos: el vidrio debe leerse transparente sobre el fondo
  // oscuro, con highlights solo en cantos y esquinas.
  scene.environmentIntensity = 0.55;

  // Fondo real dentro de la escena (mismo gradiente que el contenedor CSS):
  // el material de transmisión necesita algo detrás que refractar; con canvas
  // transparente el vidrio se ve lechoso en vez de transparente.
  const bg = document.createElement("canvas");
  bg.width = bg.height = 512;
  const ctx = bg.getContext("2d");
  const grad = ctx.createRadialGradient(256, 215, 40, 256, 215, 430);
  grad.addColorStop(0, "#26262c");
  grad.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  const bgTex = new THREE.CanvasTexture(bg);
  bgTex.colorSpace = THREE.SRGBColorSpace;
  scene.background = bgTex;

  const camera = new THREE.PerspectiveCamera(35, 16 / 10, 1, 600);
  camera.position.set(0, 10, 150);

  // Vaciar el contenido estático y montar el canvas
  host.textContent = "";
  host.appendChild(renderer.domElement);

  // Luz suave direccional para dar sombreado al texto/detalles
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(-40, 60, 90);
  scene.add(key);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 1.4;

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  return scene;
}

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

// ---- Visor A: tarjeta procedural ----
async function initProcedural(host) {
  const scene = createViewer(host);

  const cardGeo = new THREE.ExtrudeGeometry(roundedRectShape(CARD_W, CARD_H, FILLET), {
    depth: CARD_T - BEVEL * 2,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 5,
    curveSegments: 32,
  });
  cardGeo.center();

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1,
    thickness: CARD_T,
    roughness: 0.06,
    ior: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    attenuationColor: new THREE.Color(0xdff3f2), // leve tinte de vidrio real
    attenuationDistance: 60,
  });

  const card = new THREE.Group();
  card.add(new THREE.Mesh(cardGeo, glass));

  // Texto grabado (hundido bajo la cara frontal, como grabado láser)
  try {
    const font = await new FontLoader().loadAsync(FONT_URL);
    const etched = new THREE.MeshStandardMaterial({
      color: 0xf2f5f7,
      roughness: 0.9,
      metalness: 0,
    });
    const engrave = (text, size, y) => {
      const g = new TextGeometry(text, {
        font,
        size,
        depth: 0.6,
        curveSegments: 6,
        bevelEnabled: false,
      });
      g.computeBoundingBox();
      const b = g.boundingBox;
      // Centrado horizontal; la cara frontal del texto queda 0.5 mm por
      // debajo de la superficie del vidrio.
      g.translate(-(b.min.x + b.max.x) / 2, y, CARD_T / 2 - 0.6 - 0.5);
      card.add(new THREE.Mesh(g, etched));
    };
    engrave(NAME_TEXT, 5, 2.5);
    engrave(EMAIL_TEXT, 3.2, -8.5);
  } catch {
    /* sin conexión al CDN de la fuente: la tarjeta se muestra sin grabado */
  }

  card.rotation.x = -0.12; // ligera inclinación inicial
  scene.add(card);
}

// ---- Visor B: Card.glb (export CAD) con la misma iluminación ----
async function initGlb(host) {
  const scene = createViewer(host);
  const gltf = await new GLTFLoader().loadAsync("Card.glb");
  const obj = gltf.scene;

  // Normaliza escala y centrado: el lado mayor se lleva a 90 mm
  let box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  obj.scale.setScalar(CARD_W / Math.max(size.x, size.y, size.z));
  // Si el CAD exporta la tarjeta "acostada" (grosor en Y), se pone de pie
  if (Math.min(size.x, size.y, size.z) === size.y) obj.rotateX(-Math.PI / 2);
  box = new THREE.Box3().setFromObject(obj);
  obj.position.sub(box.getCenter(new THREE.Vector3()));

  const group = new THREE.Group();
  group.add(obj);
  group.rotation.x = -0.12;
  scene.add(group);
}

if (webgl) {
  const a = document.getElementById("glassCard");
  const b = document.getElementById("glassCardGlb");
  if (a) initProcedural(a).catch(() => {});
  if (b) initGlb(b).catch(() => {});
}
