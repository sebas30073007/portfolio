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

// ---------- Carruseles del círculo de apps (index) ----------
function initFeatureCarousels() {
  if (typeof FEATURE_SLIDES === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".feature__art[data-app]").forEach((art) => {
    const cfg = FEATURE_SLIDES[art.dataset.app];
    if (!cfg || !cfg.images.length) return;

    // Solo las capturas del proyecto (sin avatar)
    art.innerHTML = cfg.images
      .map(
        (src, i) =>
          `<img class="slide${i === 0 ? " is-active" : ""}" src="${src}" alt="" loading="lazy" />`
      )
      .join("");

    // Respeta "reduce motion": deja fija la primera imagen sin rotar
    if (reduce || cfg.images.length < 2) return;

    const nodes = art.querySelectorAll(".slide");
    let idx = 0;
    setInterval(() => {
      nodes[idx].classList.remove("is-active");
      idx = (idx + 1) % nodes.length;
      nodes[idx].classList.add("is-active");
    }, 2625);
  });
}

// ---------- Projects page ----------
// Poner en true cuando quieras que el botón CTA del modal enlace al repo.
const ENABLE_REPO_LINKS = false;

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
          const count = item.gallery ? item.gallery.length : 0;
          const hint = count
            ? `${count} ${count === 1 ? "imagen" : "imágenes"} · ver galería →`
            : "Ver detalle →";
          return `
            <article class="pcard is-clickable" data-pid="${pid}" role="button" tabindex="0"
                     aria-label="Abrir ${item.title}">
              <span class="pcard__tag">${item.tag}</span>
              <h3 class="pcard__title">${item.title}</h3>
              <p class="pcard__desc">${item.desc}</p>
              <span class="pcard__more">${hint}</span>
            </article>`;
        })
        .join("");

      return `
        <div class="year-block">
          <span class="year-ribbon">${year}</span>
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
  initTabs();
  initProjectModal();
});
