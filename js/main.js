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
  if (typeof FEATURE_SLIDES === "undefined") return;
  document.querySelectorAll(".feature__art[data-app]").forEach((art) => {
    const cfg = FEATURE_SLIDES[art.dataset.app];
    if (cfg) mountCarousel(art, cfg.images);
  });
}

// Fotos casuales de la sección About me
function initAboutCarousel() {
  if (typeof ABOUT_PHOTOS === "undefined") return;
  // Más lento que las apps (para About me)
  document.querySelectorAll("[data-about]").forEach((el) => mountCarousel(el, ABOUT_PHOTOS, 7875));
}

// ---------- Projects page ----------
// Poner en true cuando quieras que el botón CTA del modal enlace al repo.
const ENABLE_REPO_LINKS = false;

const GH_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>`;

const TOOL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.6-.6-2.3 2.4-2.4z"/></svg>`;

// Índice pid -> proyecto (lo llena renderCategory para que el modal lo lea)
let PROJECT_INDEX = {};

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

  // Estado vacío / deshabilitado
  if (years.length === 0) {
    const note = cat && cat.note ? cat.note : "Content coming soon.";
    container.innerHTML = `
      <div class="empty-state">
        <h3>${cat ? cat.label : ""}</h3>
        <p>${note}</p>
      </div>`;
    return;
  }

  container.innerHTML = years
    .map((year) => {
      const cards = cat.years[year]
        .map((item, i) => {
          const pid = `${catKey}-${slugify(item.title)}-${i}`;
          PROJECT_INDEX[pid] = item;

          const cover =
            item.cover || (item.gallery && item.gallery[0] ? item.gallery[0].src : "");
          const bgStyle = cover ? ` style="background-image:url('${cover}')"` : "";
          const tools = item.tools
            ? `<div class="pcard__tools">${TOOL_ICON}<span>${item.tools}</span></div>`
            : "";

          return `
            <article class="pcard${cover ? "" : " pcard--noimg"}" data-pid="${pid}"
                     role="button" tabindex="0" aria-label="Abrir ${item.title}"${bgStyle}>
              <div class="pcard__scrim"></div>
              <span class="pcard__kw">${item.tag}</span>
              <span class="pcard__gh" aria-hidden="true">${GH_ICON}</span>
              <div class="pcard__panel">
                <h3 class="pcard__title">${item.title}</h3>
                <div class="pcard__detail">
                  <div class="pcard__detail-inner">
                    <p class="pcard__desc">${item.desc}</p>
                    ${tools}
                    <span class="pcard__more">Ver más →</span>
                  </div>
                </div>
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
}

// ---------- Modal de proyecto (galería) ----------
let modalTimer = null;
let modalSlides = [];
let modalIdx = 0;

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
  document.getElementById("modalImg").src = slide.src;
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

  const gallery = project.gallery || [];
  modalSlides = gallery;
  modalIdx = 0;
  stopModalAutoplay();

  if (gallery.length) {
    img.hidden = false;
    empty.hidden = true;
    thumbs.innerHTML = gallery
      .map(
        (s, k) =>
          `<img class="modal__thumb" src="${s.src}" alt="${s.caption || ""}" data-i="${k}" />`
      )
      .join("");
    showModalSlide(0);
    // Autoplay lento (mismo ritmo que el home). Se rompe al elegir miniatura.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (gallery.length > 1 && !reduce) {
      modalTimer = setInterval(() => showModalSlide(modalIdx + 1), 2625);
    }
  } else {
    img.hidden = true;
    img.removeAttribute("src");
    empty.hidden = false;
    thumbs.innerHTML = "";
    cap.textContent = "";
  }

  // CTA al repositorio (deshabilitado hasta activar ENABLE_REPO_LINKS)
  if (ENABLE_REPO_LINKS && project.repo) {
    cta.href = project.repo;
    cta.classList.remove("is-disabled");
    cta.removeAttribute("aria-disabled");
  } else {
    cta.removeAttribute("href");
    cta.classList.add("is-disabled");
    cta.setAttribute("aria-disabled", "true");
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (!modal || modal.hidden) return;
  stopModalAutoplay();
  modal.hidden = true;
  document.body.style.overflow = "";
}

function initProjectModal() {
  const container = document.getElementById("catContent");
  const modal = document.getElementById("projectModal");
  if (!container || !modal) return;

  const openFromEvent = (e) => {
    const card = e.target.closest(".pcard[data-pid]");
    if (!card) return;
    const project = PROJECT_INDEX[card.dataset.pid];
    if (project) openProjectModal(project);
  };

  container.addEventListener("click", openFromEvent);
  container.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.closest(".pcard[data-pid]")) {
      e.preventDefault();
      openFromEvent(e);
    }
  });

  // Miniatura seleccionada -> rompe el autoplay y fija esa imagen
  document.getElementById("modalThumbs").addEventListener("click", (e) => {
    const thumb = e.target.closest(".modal__thumb");
    if (!thumb) return;
    stopModalAutoplay();
    showModalSlide(Number(thumb.dataset.i));
  });

  // Cerrar: backdrop, botón X o Escape
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeProjectModal)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
}

function initTabs() {
  const group = document.getElementById("tabsGroup");
  if (!group) return;

  // Render inicial (categoría activa)
  const active = group.querySelector(".tab.is-active");
  renderCategory(active ? active.dataset.cat : "projects");

  group.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    group.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    renderCategory(tab.dataset.cat);
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  renderTimeline();
  initFeatureCarousels();
  initAboutCarousel();
  initTabs();
  initProjectModal();
});
