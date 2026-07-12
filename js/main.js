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

// ---------- Projects page ----------
function renderCategory(catKey) {
  const container = document.getElementById("catContent");
  if (!container || typeof CATALOG === "undefined") return;

  const cat = CATALOG[catKey];
  const years = cat && cat.years ? Object.keys(cat.years).sort((a, b) => b - a) : [];

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
        .map((item) => {
          const demo = item.demo
            ? `<a class="pcard__link" href="${item.demo}" target="_blank" rel="noopener">Demo ↗</a>`
            : "";
          const repo = item.repo
            ? `<a class="pcard__link" href="${item.repo}" target="_blank" rel="noopener">Repo ↗</a>`
            : "";
          return `
            <article class="pcard">
              <span class="pcard__tag">${item.tag}</span>
              <h3 class="pcard__title">${item.title}</h3>
              <p class="pcard__desc">${item.desc}</p>
              <div class="pcard__links">${repo}${demo}</div>
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
  initTabs();
});
