const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 800) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeBtn = document.getElementById("search-close-btn");
    
    if (searchIcon && searchOverlay) {
        searchIcon.addEventListener('click', (event) => {
            event.preventDefault();
            searchOverlay.classList.add('active');
            document.body.classList.add('overlay-active');
        });

        searchOverlay.addEventListener('click', (event) => {
            if (event.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.classList.remove('overlay-active'); 
            }
        });
        
        closeBtn.addEventListener('click', (event) => {
            if (event.target === closeBtn) {
                searchOverlay.classList.remove('active');
                document.body.classList.remove('overlay-active'); 
            }
        });
    }
});