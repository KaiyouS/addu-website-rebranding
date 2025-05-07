const header = document.getElementById("header");
const headerContainer = document.getElementById("header-container");
const headerLogo = document.getElementById("header-logo");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.remove("header-v2");
    headerContainer.classList.remove("header-container-v2");
    headerLogo.classList.remove("header-logo-v2");
  } else {
    header.classList.add("header-v2");
    headerContainer.classList.add("header-container-v2");
    headerLogo.classList.add("header-logo-v2");
  }
});
