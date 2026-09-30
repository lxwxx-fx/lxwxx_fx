// =====================================================
// EDITA TUS PROYECTOS AQUÍ
// Campos: title, description, tags[], image ("" = gradiente),
// repo ("" = oculta "Ver código"), demo ("" = oculta "Demo"),
// status ("" = sin insignia, ej. "En desarrollo" o "Terminado")
// =====================================================
const projects = [
  {
    title: "Jarvis AI - Virtual Assistant",
    description: "Asistente virtual con reconocimiento de voz, comandos y respuestas.",
    tags: ["Python", "SpeechRecognition", "Text-to-Speech", "OpenAI API"],
    image: "",
    repo: "https://github.com/lxwxx-fx/JARVIS---IA",
    demo: "",
    status: "Terminado"
  },
  {
    title: "FluXify - Rendimiento Inteligente",
    description: "Aplicación para android que permite gestionar el rendimiento de tu dispositivo y optimizarlo con asistente IA.",
    tags: ["Kotlin + Compose", "Android Studio", "OpenAI API"],
    image: "",
    repo: "",
    demo: "",
    status: "En desarrollo"
  },
];

// ---------- Flags de entorno (rendimiento + accesibilidad) ----------
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const enableCursorFX = finePointer && !reducedMotion;

// ---------- 0. Tema oscuro / claro con preferencia recordada ----------
function getPreferredTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) { /* localStorage no disponible (ej. file:// restringido) */ }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    const isLight = theme === "light";
    btn.setAttribute("aria-pressed", String(isLight));
    btn.setAttribute("aria-label", isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro");
  }
  try {
    localStorage.setItem("theme", theme);
  } catch (e) { /* almacenamiento no disponible: el tema solo dura la sesión */ }
}

function initTheme() {
  applyTheme(getPreferredTheme());
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    applyTheme(current === "light" ? "dark" : "light");
  });
}

// ---------- 1. Render de proyectos (con reveal + stagger) ----------
function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = "";

  projects.forEach((project, i) => {
    const article = document.createElement("article");
    article.className = "project-card reveal";
    article.setAttribute("role", "listitem");
    // Retraso escalonado por columna (0s, 0.1s, 0.2s)
    article.style.setProperty("--d", `${(i % 3) * 0.1}s`);

    // Franja superior: captura del proyecto o gradiente de relleno
    const media = document.createElement("div");
    media.className = "project-media";
    if (project.image) {
      const img = document.createElement("img");
      img.src = project.image;
      img.alt = "Captura del proyecto " + project.title;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 640;
      img.height = 360;
      media.appendChild(img);
    } else {
      media.classList.add("project-media-empty");
      media.setAttribute("aria-hidden", "true");
    }
    if (project.status) {
      const badge = document.createElement("span");
      badge.className = "status-badge" + (project.status === "Terminado" ? " status-done" : "");
      badge.textContent = project.status;
      media.appendChild(badge);
    }
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "project-body";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.textContent = project.description;

    const techList = document.createElement("ul");
    techList.className = "tech-list";
    techList.setAttribute("aria-label", "Tecnologías de " + project.title);
    project.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      techList.appendChild(li);
    });

    // Botones: solo se muestran si hay URL
    const actions = document.createElement("div");
    actions.className = "project-actions";
    const buttons = [
      { url: project.repo, text: "Ver código", primary: false },
      { url: project.demo, text: "Demo", primary: true }
    ];
    buttons.forEach((btn) => {
      if (!btn.url) return;
      const link = document.createElement("a");
      link.className = "btn-card" + (btn.primary ? " btn-card-primary" : "");
      link.href = btn.url;
      link.textContent = btn.text;
      link.setAttribute("aria-label", btn.text + " - " + project.title);
      if (btn.url.indexOf("http") === 0) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      actions.appendChild(link);
    });

    body.append(title, desc, techList);
    if (actions.hasChildNodes()) body.appendChild(actions);
    article.appendChild(body);
    grid.appendChild(article);
  });
}

// ---------- 2. Hero: revelado palabra por palabra ----------
function initHeroReveal() {
  const title = document.querySelector("[data-words]");
  if (title && !reducedMotion) {
    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = "";
    words.forEach((w, i) => {
      const wrap = document.createElement("span");
      wrap.className = "word-wrap";
      wrap.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.className = "word";
      inner.textContent = w;
      inner.style.setProperty("--wi", i);
      wrap.appendChild(inner);
      title.appendChild(wrap);
      title.appendChild(document.createTextNode(" "));
    });
    // Texto accesible para lectores de pantalla
    title.setAttribute("aria-label", words.join(" "));
  }
  // Dispara las transiciones del hero en el siguiente frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add("loaded"));
  });
}

// ---------- Máquina de escribir con resaltado de sintaxis ----------
const PROFILE_CODE = [
  "// perfil.js",
  "const perfil = {",
  '  nombre: "Rogger",',
  '  rol: "Frontend",',
  '  stack: ["HTML", "CSS", "JavaScript"],',
  "  disponible: true, // prácticas",
  "};"
].join("\n");

function highlightCode(src) {
  const esc = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc.replace(
    /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(true|false|null)\b|([A-Za-z_$][\w$]*)(?=\s*:)/gm,
    (m, com, str, bool, key) => {
      if (com) return '<span class="tok-com">' + com + "</span>";
      if (str) return '<span class="tok-str">' + str + "</span>";
      if (bool) return '<span class="tok-bool">' + bool + "</span>";
      if (key) return '<span class="tok-key">' + key + "</span>";
      return m;
    }
  );
}

function initTypewriter() {
  const el = document.getElementById("typed-code");
  if (!el) return;
  if (reducedMotion) {
    el.innerHTML = highlightCode(PROFILE_CODE);
    return;
  }
  let i = 0;
  const step = () => {
    i += 2;
    el.innerHTML = highlightCode(PROFILE_CODE.slice(0, i));
    if (i < PROFILE_CODE.length) setTimeout(step, 32);
  };
  setTimeout(step, 1100);
}

// ---------- Palabras rotativas del subtítulo ----------
function initRoleRotator() {
  const el = document.getElementById("role-rotator");
  if (!el) return;
  const roles = [
    "Desarrollador Web",
    "Creador de Apps",
    "Estudiante de Ing. de Software con IA"
  ];
  el.textContent = roles[0];
  if (reducedMotion) return;
  let i = 0;
  setInterval(() => {
    el.classList.add("rot-out");
    setTimeout(() => {
      i = (i + 1) % roles.length;
      el.textContent = roles[i];
      el.classList.remove("rot-out");
    }, 350);
  }, 3200);
}

// ---------- 3. Glow que sigue el cursor (rAF + lerp, solo transform/opacity) ----------
function initCursorGlow() {
  if (!enableCursorFX) return;
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  let tx = -600, ty = -600, x = tx, y = ty, shown = false;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!shown) {
      shown = true;
      glow.style.opacity = "1";
    }
  }, { passive: true });

  document.documentElement.addEventListener("mouseleave", () => {
    shown = false;
    glow.style.opacity = "0";
  });

  (function loop() {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(loop);
  })();
}

// ---------- 4. Aparición al hacer scroll (IntersectionObserver + stagger) ----------
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (reducedMotion) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }

  // Stagger automático dentro de cada grupo (excepto tarjetas, que ya traen --d)
  document.querySelectorAll(".reveal-group").forEach((group) => {
    const items = group.querySelectorAll(":scope .reveal:not(.project-card)");
    items.forEach((el, i) => {
      if (!el.style.getPropertyValue("--d")) {
        el.style.setProperty("--d", `${Math.min(i * 0.1, 0.5)}s`);
      }
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  els.forEach((el) => io.observe(el));
}

// ---------- 5. Tilt 3D + spotlight en tarjetas ----------
function initTilt() {
  if (!enableCursorFX) return;
  const cards = document.querySelectorAll(".project-card");
  const maxTilt = 8;

  cards.forEach((card) => {
    let raf = null;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1

      // Spotlight: actualiza vars (solo afecta a un radial-gradient con opacity)
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);

      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rx = (0.5 - py) * maxTilt * 2;
        const ry = (px - 0.5) * maxTilt * 2;
        card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
        raf = null;
      });
    });

    card.addEventListener("mouseleave", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      // Retorno suave (solo transform) y luego cede el control al CSS
      card.style.transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1)";
      card.style.transform = "";
      setTimeout(() => { card.style.transition = ""; }, 480);
    });
  });
}

// ---------- 6. Navbar: vidrio + progreso + sección activa ----------
function initNavbar() {
  const header = document.getElementById("site-header");
  const progress = document.getElementById("scroll-progress");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(y / max, 1) : 0;
    if (progress) progress.style.transform = `scaleX(${p.toFixed(4)})`;
    if (header) header.classList.toggle("scrolled", y > 10);
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  // Resaltado de sección activa
  const links = document.querySelectorAll(".nav-link[data-section]");
  const sections = document.querySelectorAll("main section[id]");
  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const activeIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => {
          const on = l.dataset.section === entry.target.id;
          l.classList.toggle("active", on);
          if (on) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach((s) => activeIO.observe(s));
}

// ---------- 7. Botones magnéticos ----------
function initMagnetic() {
  if (!enableCursorFX) return;
  const els = document.querySelectorAll(".magnetic");
  const strength = 0.28;
  const maxShift = 7;

  els.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const mx = Math.max(-maxShift, Math.min(maxShift, dx * strength));
      const my = Math.max(-maxShift, Math.min(maxShift, dy * strength));
      el.style.transition = "none";
      el.style.transform = `translate3d(${mx.toFixed(1)}px, ${my.toFixed(1)}px, 0)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform 0.35s cubic-bezier(0.22,1,0.36,1)";
      el.style.transform = "";
    });
  });
}

// ---------- Copiar correo + toast ----------
function initCopyEmail() {
  const btn = document.getElementById("copy-email");
  const toast = document.getElementById("toast");
  if (!btn || !toast) return;

  const email = btn.getAttribute("data-email") || "";
  let hideTimer = null;

  function showToast() {
    toast.classList.add("show");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function fallbackCopy() {
    const ta = document.createElement("textarea");
    ta.value = email;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) { /* portapapeles no disponible */ }
    document.body.removeChild(ta);
  }

  btn.addEventListener("click", () => {
    if (!email) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showToast, () => {
        fallbackCopy();
        showToast();
      });
    } else {
      fallbackCopy();
      showToast();
    }
  });
}

// ---------- 8. Scroll suave ----------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (reducedMotion) target.scrollIntoView();
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ---------- Menú móvil + año ----------
function initMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderProjects();
  initHeroReveal();
  initTypewriter();
  initRoleRotator();
  initCursorGlow();
  initReveal();
  initTilt();
  initNavbar();
  initMagnetic();
  initCopyEmail();
  initSmoothScroll();
  initMenu();
  initYear();
});
