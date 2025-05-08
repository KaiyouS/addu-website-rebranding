document.querySelector('.scroll-down-icon a').addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

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
            searchOverlay.style.display = "flex";
            setTimeout(() => {
                searchOverlay.classList.add('active');
                document.body.classList.add('overlay-active');
            }, 1);
        });

        // searchOverlay.addEventListener('click', (event) => {
        //     if (event.target === searchOverlay) {
        //         searchOverlay.classList.remove('active');
        //         document.body.classList.remove('overlay-active'); 
        //         setTimeout(() => { searchOverlay.style.display = "none";}, 500);
        //     }
        // });
        
        closeBtn.addEventListener('click', (event) => {
            if (event.target === closeBtn) {
                searchOverlay.classList.remove('active');
                document.body.classList.remove('overlay-active'); 
                setTimeout(() => { searchOverlay.style.display = "none";}, 500);
            }
        });
    }
});


function scalePage() {
    const baseWidth = 1920;
    const thresholdWidth = 1600;
    const scale = window.innerWidth < thresholdWidth ? Math.min(window.innerWidth / baseWidth, 1) : 1;

    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = 'top left';
    document.body.style.width = `${100 / scale}%`;
  }

window.addEventListener('resize', () => {
    if (window.innerWidth <= 1600) {
        scalePage();
    }
});

window.addEventListener('load', () => {
    if (window.innerWidth <= 1600) {
        scalePage();
    }
});

if (window.innerWidth <= 1600) {
    window.addEventListener('resize', scalePage);
    window.addEventListener('load', scalePage);
}


document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
    this.reset();
    alert('Your message has been sent!');
  });