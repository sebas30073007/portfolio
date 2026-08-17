/* ===================================================================
   Lógica del portafolio
   - Footer: año dinámico (todas las páginas)
   - Header: paneles About/Contact tipo acordeón (todas las páginas)
   - index.html (home): feed unificado de proyectos (búsqueda + filtro)
     tipo masonry, por año
   - featured-projects.html: catálogo premium (los 3 videos destacados)
   =================================================================== */

// ---------- Footer year ----------
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// ---------- Timeline horizontal (index) ----------
function renderTimeline() {
  const track = document.getElementById("timelineTrack");
  if (!track || typeof TIMELINE === "undefined") return;

  track.innerHTML = TIMELINE.map((node) => {
    const month = node.month
      ? `<span class="tl-month">${node.month}</span>`
      : "";
    return `
      <div class="tl-node">
        <span class="tl-year">${node.year}</span>
        ${month}
      </div>`;
  }).join("");
}

// ---------- Carrusel genérico (crossfade lento) ----------
function mountCarousel(el, images, interval = 2625) {
  if (!el || !images || !images.length) return;
  el.innerHTML = images
    .map(
      (src, i) =>
        `<img class="slide${i === 0 ? " is-active" : ""}" src="${src}" alt=""${
          i ? ' loading="lazy"' : ""
        } />`
    )
    .join("");

  // Respeta "reduce motion": deja fija la primera imagen sin rotar
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || images.length < 2) return;

  const nodes = el.querySelectorAll(".slide");
  let idx = 0;
  setInterval(() => {
    nodes[idx].classList.remove("is-active");
    idx = (idx + 1) % nodes.length;
    nodes[idx].classList.add("is-active");
  }, interval);
}

// Círculos de las apps destacadas (index)
function initFeatureCarousels() {
  document.querySelectorAll(".feature__art[data-app]").forEach((art) => {
    // Torke: comercial 3D pre-renderizado (video) en vez del carrusel de PNGs
    if (art.dataset.app === "torke") {
      mountGearReel(art);
      return;
    }
    if (typeof FEATURE_SLIDES === "undefined") return;
    const cfg = FEATURE_SLIDES[art.dataset.app];
    if (cfg) mountCarousel(art, cfg.images);
  });
}

// Comercial de engranes: video en bucle dentro del círculo de Torke
function mountGearReel(el) {
  el.classList.add("feature__art--reel");
  el.innerHTML = `
    <video class="feature__reel" autoplay loop muted playsinline preload="metadata"
           poster="projects/torke/reel-poster.webp">
      <source src="projects/torke/reel.webm" type="video/webm">
      <source src="projects/torke/reel.mp4" type="video/mp4">
    </video>`;
  // Respeta "reduce motion": deja el poster fijo
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const v = el.querySelector("video");
    v.removeAttribute("autoplay");
    v.pause();
  }
}

// Fotos casuales de la sección About me
function initAboutCarousel() {
  if (typeof ABOUT_PHOTOS === "undefined") return;
  // Más lento que las apps (para About me)
  document.querySelectorAll("[data-about]").forEach((el) => mountCarousel(el, ABOUT_PHOTOS, 7875));
}

// Videos de tarjeta (Teleop Mobile Manipulator, Capa8): no arrancan hasta que la tarjeta
// está mayormente en pantalla, y se pausan al salir (ahorra ancho de banda
// y evita que varios videos peleen por red/CPU nada más cargar la página).
function initPlayOnVisible() {
  const videos = document.querySelectorAll(".js-play-on-visible");
  if (!videos.length) return;

  if (!("IntersectionObserver" in window)) {
    videos.forEach((v) => v.play().catch(() => {}));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
      });
    },
    { threshold: 0.6 }
  );
  videos.forEach((v) => observer.observe(v));
}

// ---------- Projects page ----------
// Poner en true cuando quieras que el botón CTA del modal enlace al repo.
const ENABLE_REPO_LINKS = false;

const TOOL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.6-.6-2.3 2.4-2.4z"/></svg>`;

// Icono 360° (visor 3D rotable): órbita elíptica con flechas
const ICON_360 = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="12" rx="10" ry="5"/><path d="M6.5 8.3 4.2 7.4l-.6 2.4"/><path d="M17.5 15.7l2.3.9.6-2.4"/></svg>`;

// Índice pid -> proyecto (lo llena renderCategory para que el modal lo lea)
let PROJECT_INDEX = {};

// model-viewer se carga bajo demanda: solo cuando se pinta o abre un .glb.
let modelViewerLoading = null;
function ensureModelViewer() {
  if (window.customElements && customElements.get("model-viewer")) return;
  if (modelViewerLoading) return modelViewerLoading;
  modelViewerLoading = new Promise((resolve) => {
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://cdn.jsdelivr.net/npm/@google/model-viewer/dist/model-viewer.min.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });
  return modelViewerLoading;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// ---------- Feed unificado (búsqueda + filtro, estilo Pinterest) ----------
// Categorías del CATALOG, en el orden en que se van intercalando dentro de
// cada año. "projects" se reparte a su vez en hardware/software (ver
// itemFilterType) para alimentar el panel de filtro.
const FEED_CAT_ORDER = ["projects", "papers", "competitions", "pcbs", "courses"];
const FILTER_TYPES = ["hardware", "software", "papers", "competitions", "pcbs", "courses"];

function itemFilterType(catKey, item) {
  return catKey === "projects" ? item.subtype || "hardware" : catKey;
}

// Índice completo pid -> proyecto, independiente del filtro activo. PROJECT_INDEX
// solo contiene lo que está pintado, así que un deep link a un proyecto que el
// tab actual oculta no lo encontraría ahí.
let ALL_PROJECTS = {};

// Agrupa todo el CATALOG por año → categoría → registros, sin filtrar todavía.
function buildFeedIndex() {
  const byYear = new Map();
  FEED_CAT_ORDER.forEach((catKey) => {
    const cat = CATALOG[catKey];
    if (!cat || !cat.years) return;
    Object.keys(cat.years).forEach((year) => {
      cat.years[year].forEach((item, i) => {
        const pid = `${catKey}-${slugify(item.title)}-${i}`;
        const record = { catKey, year, item, pid, ftype: itemFilterType(catKey, item) };
        ALL_PROJECTS[pid] = item;
        if (!byYear.has(year)) byYear.set(year, {});
        const bucket = byYear.get(year);
        (bucket[catKey] = bucket[catKey] || []).push(record);
      });
    });
  });
  return byYear;
}

// Intercala round-robin entre categorías (projects, papers, competitions,
// pcbs) para que el masonry mezcle proporciones en vez de agruparlas.
function interleave(bucket, order) {
  const queues = order.map((k) => (bucket[k] || []).slice());
  const out = [];
  let added = true;
  while (added) {
    added = false;
    for (const q of queues) {
      if (q.length) {
        out.push(q.shift());
        added = true;
      }
    }
  }
  return out;
}

function matchesSearch(item, query) {
  if (!query) return true;
  const haystack = [item.title, item.tag, item.tools, item.desc]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

// Copiar link sustituyó a "compartir": la hoja nativa de share solo existe en
// móvil y en escritorio caía igual en el portapapeles, así que el icono
// prometía más de lo que hacía. El eslabón de cadena dice exactamente qué pasa.
const ICON_LINK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
const ICON_INFO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
const ICON_EXT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';
const ICON_LOCK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

function renderCard(catKey, item, pid, year) {
  const cover = item.cover || (item.gallery && item.gallery[0] ? item.gallery[0].src : "");
  // Turntable 3D pre-renderizado (video liviano, sin WebGL en la tarjeta).
  // Un click abre el modal con el modelo interactivo real.
  // preload="auto" (antes "metadata"): con solo metadata, la descarga del
  // video no arrancaba hasta el autoplay, así que en una carga fría (sin
  // caché) alcanzaba a bufferear muy poco antes de reproducir — se veía
  // girar un poco y reiniciar en bucle hasta que el buffer alcanzaba. Con
  // "auto" el navegador empieza a bajar el video desde que carga la página,
  // no desde que arranca a reproducirse.
  const spin = item.spin
    ? `<video class="pin__video" autoplay loop muted playsinline preload="auto"${
        item.poster ? ` poster="${item.poster}"` : ""
      }>
         <source src="${item.spin}.webm" type="video/webm">
         <source src="${item.spin}.mp4" type="video/mp4">
       </video>`
    : "";

  // La imagen entra con su proporción natural (width:100%; height:auto). Es
  // lo que produce el escalonado del masonry: si se recortara a una caja
  // fija, todas las columnas quedarían a la misma altura y se perdería.
  // alt="" porque la tarjeta ya se nombra con el título de al lado; un alt
  // duplicado solo repetiría el mismo texto al lector de pantalla.
  const media =
    spin ||
    (cover
      ? `<img src="${cover}" alt="" loading="lazy" decoding="async" />`
      : "");

  // Dos destinos distintos, ambos etiquetados. Antes la tarjeta solo mostraba
  // la flecha del enlace externo y el modal quedaba escondido detrás de un
  // clic en cualquier parte: quien apuntaba a la flecha se saltaba el detalle
  // sin saber que existía, y al revés. Ahora el par está a la vista con texto,
  // no solo con un tooltip que hay que provocar.
  //
  // Enlace externo: solo item.url, nunca item.github — el CTA del modal
  // tampoco enlaza repos (ver ENABLE_REPO_LINKS). Si la tarjeta enlazara el
  // repo, expondría lo que el modal decide no exponer. Muchos items no tienen
  // url: ahí queda solo "More info".
  const ext = item.url || "";
  // La etiqueta la pone el item (Visit site / Open paper / View KiCad files):
  // "See project" genérico mentiría en un PDF o en un repo de KiCad.
  const extLabel = escapeHtml(item.ctaLabel || "See project");
  const extBtn = ext
    ? `<a class="pin__act pin__act--pill pin__act--link" href="${ext}" target="_blank" rel="noopener"
          aria-label="${extLabel}: ${escapeHtml(item.title)}"
          >${ICON_EXT}<span class="pin__act-label">${extLabel}</span></a>`
    : "";

  const meta = [year, item.tag].filter(Boolean).join(" · ");

  // Bloqueada ("Coming soon"): portada atenuada, sin acciones ni apertura de
  // modal — nada que mostrar todavía. El título queda como texto plano (no
  // <button>) para que ni el mouse ni el teclado sugieran que hay algo detrás.
  if (item.locked) {
    return `
      <article class="pin pin--locked" data-pid="${pid}">
        <div class="pin__media${media ? "" : " pin__media--empty"}">
          ${media}
          <div class="pin__lock">
            ${ICON_LOCK}
            <span>Coming soon</span>
          </div>
        </div>
        <div class="pin__foot">
          <div class="pin__text">
            <h3 class="pin__title">${escapeHtml(item.title)}</h3>
            <p class="pin__meta">${escapeHtml(meta)}</p>
          </div>
        </div>
      </article>`;
  }

  return `
    <article class="pin" data-pid="${pid}">
      <div class="pin__media${media ? "" : " pin__media--empty"}">
        ${media}
        <div class="pin__acts">
          <button class="pin__act pin__act--pill pin__act--info" type="button" data-act="info"
                  aria-label="More info about ${escapeHtml(item.title)}"
                  >${ICON_INFO}<span class="pin__act-label">More info</span></button>
          ${extBtn}
        </div>
        <button class="pin__act pin__act--copy" type="button" data-act="copy"
                title="Copy link" aria-label="Copy link to ${escapeHtml(item.title)}">${ICON_LINK}</button>
      </div>
      <div class="pin__foot">
        <div class="pin__text">
          <h3 class="pin__title">
            <button class="pin__open" type="button" data-pid="${pid}">${escapeHtml(item.title)}</button>
          </h3>
          <p class="pin__meta">${escapeHtml(meta)}</p>
        </div>
      </div>
    </article>`;
}

// Índice construido una vez (el CATALOG no cambia en tiempo de ejecución)
let FEED_INDEX = null;

// Un único masonry continuo para todo el catálogo (antes: un bloque de
// columnas por año). Los años siguen ordenando el recorrido — se recorren de
// más reciente a más antiguo — pero ya no cortan el flujo: el año viaja como
// dato en cada tarjeta.
function renderFeed(filter, query) {
  const container = document.getElementById("catContent");
  if (!container || typeof CATALOG === "undefined") return;

  if (!FEED_INDEX) FEED_INDEX = buildFeedIndex();
  const years = [...FEED_INDEX.keys()].sort((a, b) => b - a);

  PROJECT_INDEX = {};
  const cards = [];

  years.forEach((year) => {
    interleave(FEED_INDEX.get(year), FEED_CAT_ORDER)
      .filter(
        (r) =>
          (filter === "all" || r.ftype === filter) && matchesSearch(r.item, query)
      )
      .forEach((r) => {
        PROJECT_INDEX[r.pid] = r.item;
        cards.push(renderCard(r.catKey, r.item, r.pid, r.year));
      });
  });

  if (!cards.length) {
    const msg = query
      ? `No results for “${escapeHtml(query)}”. Try another keyword or reset the search and filters.`
      : "No projects match the selected filters.";
    const resetLabel = query ? "Clear search" : "Clear filters";
    container.innerHTML = `
      <div class="empty-state">
        <h3>Nothing here</h3>
        <p>${msg}</p>
        <button type="button" class="btn btn--red-outline empty-state__cta" id="emptyStateReset">${resetLabel}</button>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="pins">${cards.join("")}</div>`;

  // Respeta "reduce motion": no reproduce los turntables (queda el poster fijo)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    container.querySelectorAll(".pin__video").forEach((v) => {
      v.removeAttribute("autoplay");
      v.pause();
    });
  }
}

// ---------- Sincronización de turntables (tarjetas PCB) ----------
// Todos los videos de giro comparten el mismo reloj (performance.now módulo
// duración): si el navegador pausa alguno (p. ej. mientras el modal lo tapa),
// al reanudarse se re-engancha en la misma fase que los demás.
function syncTurntables() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".pin__video").forEach((v) => {
    if (!v.duration || !isFinite(v.duration)) return;
    // Sin suficiente buffer todavía (carga en frío, sin caché): no lo toques.
    // Forzar un seek a una zona no descargada solo provoca un stall, y en el
    // siguiente tick se repite el salto → el "gira un poco y reinicia" que
    // se veía en la primera visita (se resolvía solo al recargar por caché).
    if (v.readyState < 3) return;
    const t = (performance.now() / 1000) % v.duration;
    // Corrige solo derivas visibles (ignorando el cruce del loop) para no
    // provocar micro-saltos en cada tick.
    const drift = Math.abs(v.currentTime - t);
    let targetBuffered = false;
    for (let i = 0; i < v.buffered.length; i++) {
      if (t >= v.buffered.start(i) && t <= v.buffered.end(i)) {
        targetBuffered = true;
        break;
      }
    }
    if (drift > 0.2 && Math.abs(drift - v.duration) > 0.2 && targetBuffered) v.currentTime = t;
    if (v.paused) v.play().catch(() => {});
  });
}

function initTurntableSync() {
  setInterval(syncTurntables, 1500);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncTurntables();
  });
}

// ---------- Modal de proyecto (galería) ----------
let modalTimer = null;
let modalSlides = [];
let modalIdx = 0;
let modalTrigger = null; // elemento que abrió el modal (para devolver el foco)

function stopModalAutoplay() {
  if (modalTimer) {
    clearInterval(modalTimer);
    modalTimer = null;
  }
}

function showModalSlide(i) {
  if (!modalSlides.length) return;
  modalIdx = (i + modalSlides.length) % modalSlides.length;
  const slide = modalSlides[modalIdx];
  const img = document.getElementById("modalImg");
  const video = document.getElementById("modalVideo");
  const stage = document.querySelector(".modal__stage");

  // El visor 3D nunca se destruye al cambiar de slide: solo se oculta
  // (visibility) para que el modelo permanezca cargado mientras el modal
  // esté abierto. La clase también oculta el badge 360° y el spinner.
  if (stage) stage.classList.toggle("model-hidden", slide.type !== "model");

  if (slide.type === "model") {
    img.hidden = true;
    img.removeAttribute("src");
    if (video) {
      video.hidden = true;
      video.innerHTML = "";
    }
    stopModalAutoplay(); // el 3D se explora manualmente, sin auto-avance
  } else if (slide.type === "video") {
    img.hidden = true;
    img.removeAttribute("src");
    if (video) {
      video.hidden = false;
      video.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${slide.id}" title="${slide.caption || "video"}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    stopModalAutoplay(); // no auto-avanzar mientras hay un video
  } else {
    if (video) {
      video.hidden = true;
      video.innerHTML = "";
    }
    img.hidden = false;
    img.src = slide.src;
    img.alt = slide.caption || "";
  }

  document.getElementById("modalCaption").textContent = slide.caption || "";
  document.querySelectorAll("#modalThumbs .modal__thumb").forEach((t, k) => {
    t.classList.toggle("is-active", k === modalIdx);
  });
}

function openProjectModal(project, pid) {
  // Deep link: mientras el modal está abierto la URL apunta al proyecto, así
  // "Compartir" y "Copiar enlace" tienen algo real que compartir.
  if (pid) {
    OPEN_PID = pid;
    writeHash(CURRENT_FILTER, pid);
  }
  const modal = document.getElementById("projectModal");
  const img = document.getElementById("modalImg");
  const empty = document.getElementById("modalEmpty");
  const thumbs = document.getElementById("modalThumbs");
  const cap = document.getElementById("modalCaption");
  const cta = document.getElementById("modalCta");

  document.getElementById("modalTitle").textContent = project.title;
  // Detalle de mes ("Mon YYYY"), opcional — la tarjeta ya muestra el año solo.
  const dateEl = document.getElementById("modalDate");
  if (dateEl) {
    dateEl.textContent = project.date || "";
    dateEl.hidden = !project.date;
  }
  document.getElementById("modalDesc").textContent = project.desc || "";
  // Etiqueta opcional sobre la descripción (p. ej. "Abstract" en papers)
  const descLabel = document.getElementById("modalDescLabel");
  if (descLabel) {
    descLabel.textContent = project.descLabel || "";
    descLabel.hidden = !project.descLabel;
  }

  // Renders opcionales (3D, etc.)
  const renders = document.getElementById("modalRenders");
  const rlist = project.renders || [];
  if (renders) {
    if (rlist.length) {
      renders.innerHTML =
        `<h4 class="modal__subtitle">Renders</h4>` +
        rlist
          .map((src) => `<img class="modal__render" src="${src}" alt="" loading="lazy" />`)
          .join("");
      renders.hidden = false;
    } else {
      renders.innerHTML = "";
      renders.hidden = true;
    }
  }

  // Modelo 3D (PCB) — visor interactivo dentro del stage
  const stage = document.querySelector(".modal__stage");
  const old3d = document.getElementById("modalModel");
  if (old3d) old3d.remove();
  // Limpia estado/overlays de una apertura anterior
  stage.classList.remove("has-model", "model-hidden");
  stage.querySelectorAll(".modal__badge360, .modal__spinner").forEach((el) => el.remove());

  if (project.model && stage) {
    ensureModelViewer();
    stage.classList.add("has-model");

    const mv = document.createElement("model-viewer");
    mv.id = "modalModel";
    mv.className = "modal__model";
    mv.setAttribute("src", project.model);
    mv.setAttribute("camera-controls", "");
    mv.setAttribute("auto-rotate", "");
    mv.setAttribute("touch-action", "pan-y");
    mv.setAttribute("shadow-intensity", "1");
    mv.setAttribute("environment-image", "neutral");
    mv.setAttribute("exposure", "1.1");
    mv.setAttribute("alt", project.title);
    if (project.cover) mv.setAttribute("poster", project.cover);
    if (project.modelBg) mv.style.background = project.modelBg; // override puntual del fondo del visor
    stage.prepend(mv);

    // Badge 360° (arriba-izquierda): indica que el modelo se puede rotar
    const badge = document.createElement("span");
    badge.className = "modal__badge360";
    badge.innerHTML = `${ICON_360}<span>360°</span>`;
    stage.appendChild(badge);

    // Spinner de carga: mínimo 2 s; si el modelo tarda más, permanece hasta cargar
    const spinner = document.createElement("div");
    spinner.className = "modal__spinner";
    spinner.innerHTML = `<span class="modal__spinner-ring" role="progressbar" aria-label="Loading 3D model"></span>`;
    stage.appendChild(spinner);

    let loaded = false;
    let minElapsed = false;
    const maybeHide = () => {
      if (loaded && minElapsed) spinner.classList.add("is-done");
    };
    mv.addEventListener("load", () => { loaded = true; maybeHide(); }, { once: true });
    mv.addEventListener("error", () => { loaded = true; maybeHide(); }, { once: true });
    setTimeout(() => { minElapsed = true; maybeHide(); }, 2000);
  }

  // Con modelo 3D, el render interactivo es siempre el primer elemento de la
  // galería; las imágenes seleccionables van después.
  const gallery = project.gallery || [];
  modalSlides = project.model
    ? [{ type: "model", caption: "Interactive 3D render — drag to rotate" }, ...gallery]
    : gallery.slice();
  modalIdx = 0;
  stopModalAutoplay();

  const video = document.getElementById("modalVideo");

  // Miniaturas en columna a la izquierda del stage cuando la galería
  // incluye el modelo 3D (layout tipo selector).
  const galleryWrap = document.getElementById("modalGallery");
  if (galleryWrap) {
    // Sin imágenes ni modelo la galería desaparece por completo (papers:
    // solo título + abstract + CTA).
    galleryWrap.hidden = !modalSlides.length;
    galleryWrap.classList.toggle(
      "modal__gallery--side",
      !!project.model && modalSlides.length > 1
    );
  }

  if (modalSlides.length) {
    empty.hidden = true;
    // Miniaturas solo cuando hay algo que alternar
    thumbs.innerHTML = modalSlides.length > 1
      ? modalSlides
          .map((s, k) => {
            const isVid = s.type === "video";
            const isModel = s.type === "model";
            const thumbSrc = isVid
              ? `https://img.youtube.com/vi/${s.id}/hqdefault.jpg`
              : isModel
              ? project.poster || project.cover || ""
              : s.src;
            return `<span class="modal__thumb${isVid ? " modal__thumb--video" : ""}${isModel ? " modal__thumb--model" : ""}"
                  role="button" tabindex="0" data-i="${k}" aria-label="${s.caption || ""}"
                ><img src="${thumbSrc}" alt="" loading="lazy" /></span>`;
          })
          .join("")
      : "";
    showModalSlide(0);
    // Autoplay lento (mismo ritmo que el home). Se rompe al elegir miniatura.
    // Con modelo 3D o video al frente no hay auto-avance: la galería se
    // recorre con las miniaturas.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (modalSlides.length > 1 && !reduce && !modalSlides[0].type) {
      modalTimer = setInterval(() => showModalSlide(modalIdx + 1), 2625);
    }
  } else {
    img.hidden = true;
    img.removeAttribute("src");
    if (video) {
      video.hidden = true;
      video.innerHTML = "";
    }
    empty.hidden = !!project.model; // con modelo 3D no mostramos "Imágenes próximamente"
    thumbs.innerHTML = "";
    cap.textContent = "";
  }

  // CTA al enlace del proyecto (página o repo, según el proyecto)
  const ctaLabel = project.ctaLabel || "View repository";
  if (project.url) {
    cta.href = project.url;
    cta.textContent = `${ctaLabel} →`;
    cta.classList.remove("is-disabled");
    cta.removeAttribute("aria-disabled");
  } else {
    cta.removeAttribute("href");
    cta.textContent = `${ctaLabel} →`;
    cta.classList.add("is-disabled");
    cta.setAttribute("aria-disabled", "true");
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  // Mueve el foco al diálogo (botón cerrar) para lectores de pantalla/teclado
  const closeBtn = modal.querySelector(".modal__close");
  if (closeBtn) closeBtn.focus();
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (!modal || modal.hidden) return;
  stopModalAutoplay();
  // Detiene el video (si lo hay)
  const video = document.getElementById("modalVideo");
  if (video) {
    video.hidden = true;
    video.innerHTML = "";
  }
  modal.hidden = true;
  document.body.style.overflow = "";
  // Saca el proyecto de la URL, dejando solo el tab activo
  OPEN_PID = null;
  writeHash(CURRENT_FILTER, null);
  // Re-engancha los turntables de las tarjetas en la fase común
  syncTurntables();
  // Devuelve el foco a la tarjeta que abrió el modal
  if (modalTrigger && document.contains(modalTrigger)) modalTrigger.focus();
  modalTrigger = null;
}

function initProjectModal() {
  const container = document.getElementById("catContent");
  const modal = document.getElementById("projectModal");
  if (!container || !modal) return;

  // Abrir: clic en cualquier parte de la tarjeta, menos en sus controles
  // propios (enlace externo, copiar link), que tienen su propio handler.
  // "More info" es la excepción: es justo el botón que abre este modal, así
  // que se deja pasar aunque sea un .pin__act. El teclado entra por ahí o por
  // el <button> del título.
  const openFromEvent = (e) => {
    if (!e.target.closest(".pin__act--info")) {
      if (e.target.closest("a")) return;
      if (e.target.closest(".pin__act")) return;
    }
    const card = e.target.closest(".pin[data-pid]");
    if (!card) return;
    if (card.classList.contains("pin--locked")) return; // "Coming soon": nada que abrir
    const project = PROJECT_INDEX[card.dataset.pid];
    if (!project) return;
    // Al cerrar, el foco vuelve al control que abrió: el botón "More info" si
    // se entró por ahí, si no el título.
    modalTrigger =
      e.target.closest(".pin__act--info") || card.querySelector(".pin__open") || card;
    openProjectModal(project, card.dataset.pid);
  };

  container.addEventListener("click", openFromEvent);

  // Miniaturas: clic y teclado (Enter/Espacio) rompen el autoplay y fijan la imagen
  const selectThumb = (thumb) => {
    stopModalAutoplay();
    showModalSlide(Number(thumb.dataset.i));
  };
  const thumbs = document.getElementById("modalThumbs");
  thumbs.addEventListener("click", (e) => {
    const thumb = e.target.closest(".modal__thumb");
    if (thumb) selectThumb(thumb);
  });
  thumbs.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const thumb = e.target.closest(".modal__thumb");
    if (!thumb) return;
    e.preventDefault();
    selectThumb(thumb);
  });

  // Cerrar: backdrop, botón X o Escape
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeProjectModal)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });

  // Atrapa el Tab dentro del diálogo mientras está abierto
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || modal.hidden) return;
    const win = modal.querySelector(".modal__window");
    const focusable = [...win.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((el) => !el.hidden && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// ---------- Hash: tab activo + proyecto abierto ----------
// Formatos: "#papers", "#project=projects-teleop-mobile-manipulator-0", o ambos unidos por
// "&". Sin hash (o con uno que no reconoce nada) muestra todo, así el link
// limpio de la página sigue siendo el archivo completo.
let CURRENT_FILTER = "all";
let OPEN_PID = null;

function parseHash() {
  const raw = decodeURIComponent(location.hash.replace(/^#/, "")).trim();
  const out = { filter: "all", project: null };
  raw
    .split("&")
    .filter(Boolean)
    .forEach((part) => {
      if (part.startsWith("project=")) out.project = part.slice(8);
      else if (FILTER_TYPES.includes(part.toLowerCase())) out.filter = part.toLowerCase();
    });
  return out;
}

function writeHash(filter, project) {
  const parts = [];
  if (filter && filter !== "all") parts.push(filter);
  if (project) parts.push("project=" + encodeURIComponent(project));
  const url = parts.length
    ? `${location.pathname}${location.search}#${parts.join("&")}`
    : `${location.pathname}${location.search}`;
  // replaceState (no location.hash =): no dispara hashchange, así que no
  // provoca un re-render en cada apertura de modal.
  history.replaceState(null, "", url);
}

function projectUrl(pid) {
  return `${location.origin}${location.pathname}#project=${encodeURIComponent(pid)}`;
}

// ---------- Acciones de tarjeta (copiar link) ----------
// Confirmación en texto (no solo un cambio de color): copiar no tiene ningún
// efecto visible por sí solo y sin esto parece que no pasó nada.
function pinToast(pin, msg) {
  pin.querySelectorAll(".pin__toast").forEach((t) => t.remove());
  const el = document.createElement("span");
  el.className = "pin__toast";
  el.setAttribute("role", "status");
  el.textContent = msg;
  pin.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

async function copyPinLink(pin, pid) {
  try {
    await navigator.clipboard.writeText(projectUrl(pid));
    pinToast(pin, "Link copied");
  } catch (err) {
    pinToast(pin, "Copy failed");
  }
}

// El menú de "..." desapareció: su único ítem era "Copy link", así que ahora
// esa acción es un botón directo sobre la imagen — un clic en vez de dos.
function initPinActions() {
  const container = document.getElementById("catContent");
  if (!container) return;

  container.addEventListener("click", (e) => {
    const pin = e.target.closest(".pin[data-pid]");
    const copy = e.target.closest(".pin__act--copy");
    if (copy && pin) copyPinLink(pin, pin.dataset.pid);
  });
}

// ---------- Tabs de categoría + búsqueda ----------
function initSearchFilter() {
  const searchInput = document.getElementById("searchInput");
  const tablist = document.getElementById("filterTabs");
  const container = document.getElementById("catContent");
  if (!searchInput || !tablist || !container) return;

  const tabs = [...tablist.querySelectorAll(".tab")];
  let query = "";

  function selectTab(filter, { focus = false } = {}) {
    CURRENT_FILTER = filter;
    tabs.forEach((t) => {
      const on = t.dataset.filter === filter;
      t.setAttribute("aria-selected", on ? "true" : "false");
      // Roving tabindex: dentro de un tablist solo el tab activo entra en el
      // orden de tabulación; entre tabs se navega con flechas.
      t.tabIndex = on ? 0 : -1;
      if (on) {
        container.setAttribute("aria-labelledby", t.id);
        if (focus) t.focus();
      }
    });
    writeHash(filter, OPEN_PID);
    renderFeed(filter, query);
  }

  // Estado inicial desde la URL
  const initial = parseHash();
  selectTab(initial.filter);

  tablist.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (tab) selectTab(tab.dataset.filter);
  });

  tablist.addEventListener("keydown", (e) => {
    const i = tabs.findIndex((t) => t.dataset.filter === CURRENT_FILTER);
    let next = null;
    if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
    else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === "Home") next = tabs[0];
    else if (e.key === "End") next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    selectTab(next.dataset.filter, { focus: true });
  });

  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    renderFeed(CURRENT_FILTER, query);
  });

  // Botón del estado vacío: limpia búsqueda y tab a la vez. Si el vacío lo
  // causó el texto buscado, resetear solo el tab no mostraría nada.
  container.addEventListener("click", (e) => {
    if (!e.target.closest("#emptyStateReset")) return;
    query = "";
    searchInput.value = "";
    selectTab("all");
  });

  // Link compartido con otro hash, o navegación atrás/adelante
  window.addEventListener("hashchange", () => {
    const state = parseHash();
    if (state.filter !== CURRENT_FILTER) selectTab(state.filter);
    if (state.project) openProjectFromHash(state.project);
  });
}

// Abre el modal de un proyecto referenciado en la URL. Se llama al cargar
// (link compartido) y en hashchange.
function openProjectFromHash(pid) {
  // ALL_PROJECTS, no PROJECT_INDEX: el proyecto puede estar oculto por el tab
  // activo y aun así el link debe abrirlo.
  const project = ALL_PROJECTS[pid];
  if (!project) return;
  const card = document.querySelector(`.pin[data-pid="${CSS.escape(pid)}"]`);
  modalTrigger = card ? card.querySelector(".pin__open") || card : null;
  openProjectModal(project, pid);
}

// ---------- Paneles About / Contact (acordeón bajo el header) ----------
// Presentes en todas las páginas (mismo bloque duplicado en cada .html).
// Un solo panel abierto a la vez; "Show less" y click fuera también cierran.
function initRevealPanels() {
  const panels = {
    about: document.getElementById("panel-about"),
    contact: document.getElementById("panel-contact"),
  };
  const triggers = {
    about: document.getElementById("navAbout"),
    contact: document.getElementById("navContact"),
  };
  if (!panels.about && !panels.contact) return;

  const keys = Object.keys(panels).filter((k) => panels[k] && triggers[k]);

  function closeAll() {
    keys.forEach((k) => {
      panels[k].classList.remove("is-open");
      triggers[k].setAttribute("aria-expanded", "false");
    });
  }

  function toggle(key) {
    const wasOpen = panels[key].classList.contains("is-open");
    closeAll();
    if (!wasOpen) {
      panels[key].classList.add("is-open");
      triggers[key].setAttribute("aria-expanded", "true");
    }
  }

  keys.forEach((k) => triggers[k].addEventListener("click", () => toggle(k)));

  document.querySelectorAll("[data-close-panel]").forEach((btn) => {
    btn.addEventListener("click", closeAll);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  // Click fuera de un panel abierto (y fuera de su disparador) lo cierra
  document.addEventListener("click", (e) => {
    const openKey = keys.find((k) => panels[k].classList.contains("is-open"));
    if (!openKey) return;
    if (panels[openKey].contains(e.target) || triggers[openKey].contains(e.target)) return;
    closeAll();
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  // Se lee ANTES de initSearchFilter: al fijar el tab inicial, esa función
  // reescribe el hash con writeHash(filter, OPEN_PID) y OPEN_PID todavía es
  // null, así que borraría el "project=" de la URL antes de poder leerlo.
  const fromHash = parseHash();

  setYear();
  renderTimeline();
  initFeatureCarousels();
  initAboutCarousel();
  initPlayOnVisible();
  initSearchFilter(); // pinta el feed y llena PROJECT_INDEX
  initProjectModal();
  initPinActions();
  initTurntableSync();
  initRevealPanels();

  // Link compartido a un proyecto: se abre una vez que el feed existe.
  if (fromHash.project) openProjectFromHash(fromHash.project);
});
