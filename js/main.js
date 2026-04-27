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
// Header scroll state
// ================================================
const header          = document.getElementById("header");
const headerContainer = document.getElementById("header-container");
const headerLogo      = document.getElementById("header-logo");

function updateHeader() {
  const scrolled = window.scrollY > 100;
  header.classList.toggle("header-v2",                    !scrolled);
  headerContainer.classList.toggle("header-container-v2", !scrolled);
  headerLogo.classList.toggle("header-logo-v2",           !scrolled);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// ================================================
// Panel manager
// ================================================
const hamburger      = document.getElementById("hamburger");
const nav            = document.getElementById("main-nav");
const navOverlay     = document.getElementById("nav-overlay");
const searchOverlay  = document.getElementById("search-overlay");
const openSearchBtn  = document.getElementById("open-search");
const closeSearchBtn = document.getElementById("search-close-btn");

// Scroll lock
const lockScroll   = () => document.documentElement.classList.add("no-scroll");
const unlockScroll = () => document.documentElement.classList.remove("no-scroll");

// Active panel state
let activePanel = null; // 'nav' | 'search' | null

function openPanel(name) {
  if (activePanel === name) return;
  closeAll();

  activePanel = name;
  lockScroll();

  if (name === 'nav') {
    hamburger.classList.add("open");
    nav.classList.add("nav-open");
    navOverlay.classList.add("active");
  } else if (name === 'search') {
    searchOverlay.classList.add("active");
    // Give CSE time to re-attach its DOM before we start watching
    setTimeout(startCseWatch, 200);
  }
}

function closeAll() {
  if (!activePanel) return;

  hamburger.classList.remove("open");
  nav.classList.remove("nav-open");
  navOverlay.classList.remove("active");
  searchOverlay.classList.remove("active");
  searchOverlay.classList.remove("has-results"); // reset sticky state
  stopCseWatch();
  unlockScroll();
  activePanel = null;
}

// ------------------------------------------------
// Event listeners
// ------------------------------------------------
hamburger.addEventListener("click", () => {
  activePanel === 'nav' ? closeAll() : openPanel('nav');
});

nav.addEventListener("click", (e) => e.stopPropagation());
navOverlay.addEventListener("click", closeAll);

nav.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", closeAll);
});

openSearchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openPanel('search');
});

closeSearchBtn.addEventListener("click", closeAll);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

// ================================================
// Programmable Search Engine by Google
// ================================================
let cseObserver = null;

function updateResultsAnchor() {
  const searchPill = document.querySelector('#search-overlay .gsc-search-box-tools .gsc-search-box');
  if (!searchPill) return;
  
  const bottom = searchPill.getBoundingClientRect().bottom;
  // Add a 24px gap between the bottom of the search pill and the results
  document.documentElement.style.setProperty('--search-results-top', `${bottom + 24}px`);
}

function hasCseResults() {
  const results = document.querySelectorAll('#search-overlay .gsc-webResult.gsc-result');
  if (results.length > 0) return true;

  if (document.querySelector('#search-overlay .gs-no-results-result')) return true;
  
  if (document.querySelector('#search-overlay .gs-spelling')) return true;

  return false;
}

// ================================================
// Fallback Listener for the Clear 'X' Button
// ================================================
document.addEventListener('click', (e) => {
  if (e.target.closest('.gsst_a') || e.target.closest('.gsc-clear-button')) {
    const searchOverlay = document.getElementById("search-overlay");
    if (searchOverlay) {
      searchOverlay.classList.remove('has-results');
    }
    
    // AGGRESSIVE DOM SCRUB
    // 1. Clear the main results wrapper
    const expansionArea = document.querySelector('#search-overlay .gsc-expansionArea');
    if (expansionArea) expansionArea.innerHTML = '';
    
    // 2. Clear any stray result cards
    const strayResults = document.querySelectorAll('#search-overlay .gsc-result');
    strayResults.forEach(el => el.remove());
    
    // 3. Clear no-results messages
    const noResults = document.querySelectorAll('#search-overlay .gs-no-results-result');
    noResults.forEach(el => el.remove());
    
    // 4. Clear spelling/typo suggestions
    const spellings = document.querySelectorAll('#search-overlay .gs-spelling, #search-overlay .gsc-spelling-container');
    spellings.forEach(el => el.remove());
    
    // 5. Clear the "About X results" text
    const resultInfo = document.querySelector('#search-overlay .gsc-result-info');
    if (resultInfo) resultInfo.innerHTML = '';

    // Slight delay to allow CSE's internal scripts to finish clearing the DOM
    setTimeout(syncSearchOverlayState, 100); 
  }
});

/**
 * Reconcile the `has-results` class with actual CSE DOM state.
 * Called by MutationObserver on every subtree change inside the CSE widget.
 */
function syncSearchOverlayState() {
  if (!searchOverlay || !searchOverlay.classList.contains('active')) return;

  const shouldHave = hasCseResults();
  const has        = searchOverlay.classList.contains('has-results');

  if (shouldHave && !has) {
    searchOverlay.classList.add('has-results');
    setTimeout(updateResultsAnchor, 460);
  } else if (!shouldHave && has) {
    searchOverlay.classList.remove('has-results');
  }
}

/** Begin observing the CSE widget for DOM mutations. */
function startCseWatch() {
  if (cseObserver) return; // already running

  const cseArea = document.querySelector('#search-overlay .custom-search-bar');
  if (!cseArea) return;

  cseObserver = new MutationObserver(syncSearchOverlayState);
  cseObserver.observe(cseArea, { childList: true, subtree: true });

  // Check immediately in case results are already rendered
  syncSearchOverlayState();
}

/** Stop observing the CSE widget. */
function stopCseWatch() {
  if (cseObserver) {
    cseObserver.disconnect();
    cseObserver = null;
  }
}

window.addEventListener('resize', () => {
  if (searchOverlay && searchOverlay.classList.contains('has-results')) {
    updateResultsAnchor();
  }
}, { passive: true });

const searchContentWrapper = document.querySelector('#search-overlay .search-content-wrapper');
if (searchContentWrapper) {
  searchContentWrapper.addEventListener('transitionend', (e) => {
    // Only trigger if the wrapper itself finished moving, and we have results
    if (e.target === searchContentWrapper && searchOverlay.classList.contains('has-results')) {
      updateResultsAnchor();
    }
  });
}