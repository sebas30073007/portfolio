/* ===================================================================
   Lógica del portafolio
   - Footer: año dinámico (todas las páginas)
   - Index: timeline horizontal
   - Projects: tabs de categorías + grid por año
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
    // GearLab: comercial 3D pre-renderizado (video) en vez del carrusel de PNGs
    if (art.dataset.app === "gearlab") {
      mountGearReel(art);
      return;
    }
    if (typeof FEATURE_SLIDES === "undefined") return;
    const cfg = FEATURE_SLIDES[art.dataset.app];
    if (cfg) mountCarousel(art, cfg.images);
  });
}

// Comercial de engranes: video en bucle dentro del círculo de GearLab
function mountGearReel(el) {
  el.classList.add("feature__art--reel");
  el.innerHTML = `
    <video class="feature__reel" autoplay loop muted playsinline preload="metadata"
           poster="projects/gear-lab/reel-poster.webp">
      <source src="projects/gear-lab/reel.webm" type="video/webm">
      <source src="projects/gear-lab/reel.mp4" type="video/mp4">
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

// Videos de tarjeta (Remote Hands, Capa8): no arrancan hasta que la tarjeta
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

const GH_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>`;

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

function renderCategory(catKey) {
  const container = document.getElementById("catContent");
  if (!container || typeof CATALOG === "undefined") return;

  const cat = CATALOG[catKey];
  const years = cat && cat.years ? Object.keys(cat.years).sort((a, b) => b - a) : [];

  PROJECT_INDEX = {};

  // Estado vacío: nota de lo que viene + una acción real (no un callejón sin salida)
  if (years.length === 0) {
    const note = cat && cat.note ? cat.note : "Nothing here yet — this section is on the way.";
    container.innerHTML = `
      <div class="empty-state">
        <h3>${cat ? cat.label : ""}</h3>
        <p>${note}</p>
        <a class="btn btn--red-outline empty-state__cta"
           href="https://github.com/sebas30073007" target="_blank" rel="noopener">
          Browse my GitHub in the meantime →
        </a>
      </div>`;
    return;
  }

  // model-viewer ya NO se usa en las tarjetas (usan video turntable): la
  // librería 3D se carga bajo demanda solo al abrir un modal con .glb.

  container.innerHTML = years
    .map((year) => {
      const cards = cat.years[year]
        .map((item, i) => {
          const pid = `${catKey}-${slugify(item.title)}-${i}`;
          PROJECT_INDEX[pid] = item;

          const cover =
            item.cover || (item.gallery && item.gallery[0] ? item.gallery[0].src : "");
          const bgStyle = cover ? ` style="background-image:url('${cover}')"` : "";
          // Turntable 3D pre-renderizado (video liviano, sin WebGL en la tarjeta).
          // Un click abre el modal con el modelo interactivo real.
          const spin = item.spin
            ? `<video class="pcard__video" autoplay loop muted playsinline preload="metadata"${
                item.poster ? ` poster="${item.poster}"` : ""
              }>
                 <source src="${item.spin}.webm" type="video/webm">
                 <source src="${item.spin}.mp4" type="video/mp4">
               </video>`
            : "";
          // Icono GitHub solo si el proyecto es open-source (tiene github)
          const gh = item.github
            ? `<a class="folder-card__gh" href="${item.github}" target="_blank" rel="noopener" aria-label="GitHub">${GH_ICON}</a>`
            : "";
          const folderTag = item.tag
            ? `<span class="folder-card__tag">${item.tag}</span>`
            : "";

          // Todas las categorías usan la tarjeta tipo carpeta (folder-card).
          return `
            <article class="pcard folder-card folder-card--${catKey}${cover ? "" : " pcard--noimg"}" data-pid="${pid}">
              <div class="folder-card__media"${bgStyle}>${spin}${gh}</div>
              <div class="folder-card__panel">
                ${folderTag}
                <h3 class="folder-card__title">
                  <button class="pcard__open" type="button" data-pid="${pid}"><span class="folder-card__titletext">${item.title}</span></button>
                </h3>
              </div>
            </article>`;
        })
        .join("");

      return `
        <div class="year-block">
          <div class="year-head">
            <span class="year-label">${year}</span>
            <span class="year-line"></span>
          </div>
          <div class="cards">${cards}</div>
        </div>`;
    })
    .join("");

  // Respeta "reduce motion": no reproduce los turntables (queda el poster fijo)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    container.querySelectorAll(".pcard__video").forEach((v) => {
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
  document.querySelectorAll(".pcard__video").forEach((v) => {
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

function openProjectModal(project) {
  const modal = document.getElementById("projectModal");
  const img = document.getElementById("modalImg");
  const empty = document.getElementById("modalEmpty");
  const thumbs = document.getElementById("modalThumbs");
  const cap = document.getElementById("modalCaption");
  const cta = document.getElementById("modalCta");

  document.getElementById("modalTitle").textContent = project.title;
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

  // Abrir: clic en cualquier parte de la tarjeta (menos el enlace de GitHub).
  // El teclado entra por el <button> del título, que dispara este mismo clic.
  const openFromEvent = (e) => {
    if (e.target.closest("a")) return; // deja pasar el enlace de GitHub
    const card = e.target.closest(".pcard[data-pid]");
    if (!card) return;
    const project = PROJECT_INDEX[card.dataset.pid];
    if (!project) return;
    modalTrigger = card.querySelector(".pcard__open") || card;
    openProjectModal(project);
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

function initTabs() {
  const group = document.getElementById("tabsGroup");
  if (!group) return;

  const tabs = [...group.querySelectorAll(".tab")];
  const panel = document.getElementById("catContent");

  // Activa una pestaña: clases + ARIA + tabindex rodante + render del panel
  function selectTab(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    if (panel) panel.setAttribute("aria-labelledby", tab.id);
    renderCategory(tab.dataset.cat);
    if (focus) tab.focus();
  }

  selectTab(group.querySelector(".tab.is-active") || tabs[0], false);

  group.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (tab) selectTab(tab, false);
  });

  // Navegación con flechas / Home / End (patrón tablist ARIA)
  group.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    selectTab(tabs[j], true);
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  renderTimeline();
  initFeatureCarousels();
  initAboutCarousel();
  initPlayOnVisible();
  initTabs();
  initProjectModal();
  initTurntableSync();
});
