// ================================================
// Scroll: Down arrow
// ================================================
const scrollDownLink = document.querySelector('.scroll-down-icon a');
if (scrollDownLink) {
  scrollDownLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
    });
  });
}

// ================================================
// Scroll: Back to top button
// ================================================
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
if (scrollToTopBtn) {
  window.addEventListener("scroll", () => {
    scrollToTopBtn.classList.toggle("show", window.scrollY > 800);
  }, { passive: true });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ================================================
// Header scroll state
// ================================================
const header          = document.getElementById("header");
const headerContainer = document.getElementById("header-container");
const headerLogo      = document.getElementById("header-logo");

function updateHeader() {
  const scrolled = window.scrollY > 100;
  header.classList.toggle("header-v2",           !scrolled);
  headerContainer.classList.toggle("header-container-v2", !scrolled);
  headerLogo.classList.toggle("header-logo-v2",  !scrolled);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// ================================================
// Panel manager
// ================================================
const hamburger      = document.getElementById("hamburger");
const nav            = document.getElementById("main-nav");
const navOverlay     = document.getElementById("nav-overlay");

// Scroll lock (single class, single source of truth)
const lockScroll   = () => document.documentElement.classList.add("no-scroll");
const unlockScroll = () => document.documentElement.classList.remove("no-scroll");

// Active panel state
let activePanel = null; // 'nav' | null

function openPanel(name) {
  if (activePanel === name) return; // already open, nothing to do
  closeAll();                       //  close whatever is currently open first

  activePanel = name;
  lockScroll();

  if (name === 'nav') {
    hamburger.classList.add("open");
    nav.classList.add("nav-open");
    navOverlay.classList.add("active");
  }
}

function closeAll() {
  if (!activePanel) return; // nothing open, skip unnecessary DOM writes

  hamburger.classList.remove("open");
  nav.classList.remove("nav-open");
  navOverlay.classList.remove("active");
  unlockScroll();
  activePanel = null;
}

// ------------------------------------------------
// Event listeners
// ------------------------------------------------

// Hamburger toggle
hamburger.addEventListener("click", () => {
  activePanel === 'nav' ? closeAll() : openPanel('nav');
});

// Prevent clicks inside the nav drawer from reaching the backdrop
nav.addEventListener("click", (e) => e.stopPropagation());

// Click nav backdrop → close
navOverlay.addEventListener("click", closeAll);

// Nav links → close drawer (allows navigation to proceed normally)
nav.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", closeAll);
});

// Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});