/* =========================================================
   MANDALGARH ADVENTURE 143
   Responsive / Mobile + Desktop JavaScript
   ========================================================= */

"use strict";


/* =========================================================
   DOM
   ========================================================= */

const body = document.body;
const navbar = document.querySelector(".navbar");

const menuButton = document.getElementById("menuButton");
const closeMenu = document.getElementById("closeMenu");
const mobileMenu = document.getElementById("mobileMenu");

const mobileLinks = document.querySelectorAll(".mobile-menu a");
const navLinks = document.querySelectorAll(
    '.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]'
);

const sections = document.querySelectorAll("section[id]");


/* =========================================================
   DEVICE / VIEWPORT HELPERS
   ========================================================= */

const mobileBreakpoint = 800;

const isMobile = () => {
    return window.innerWidth <= mobileBreakpoint;
};


/* =========================================================
   MOBILE MENU
   ========================================================= */

function openMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("active");

    body.classList.add("menu-open");

    if (menuButton) {
        menuButton.setAttribute("aria-expanded", "true");
    }

    mobileMenu.setAttribute("aria-hidden", "false");
}


function closeMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove("active");

    body.classList.remove("menu-open");

    if (menuButton) {
        menuButton.setAttribute("aria-expanded", "false");
    }

    mobileMenu.setAttribute("aria-hidden", "true");
}


if (menuButton) {

    menuButton.addEventListener("click", openMobileMenu);

}


if (closeMenu) {

    closeMenu.addEventListener("click", closeMobileMenu);

}


/* Close after selecting a mobile navigation link */

mobileLinks.forEach(link => {

    link.addEventListener("click", closeMobileMenu);

});


/* Close menu when clicking outside the content */

if (mobileMenu) {

    mobileMenu.addEventListener("click", event => {

        if (event.target === mobileMenu) {
            closeMobileMenu();
        }

    });

}


/* ESC closes mobile menu */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeMobileMenu();

    }

});


/* =========================================================
   RESPONSIVE MENU RESET
   ========================================================= */

let previousMobileState = isMobile();


window.addEventListener("resize", () => {

    const currentMobileState = isMobile();

    /*
     * If user rotates phone or resizes desktop browser,
     * automatically reset the mobile menu.
     */

    if (currentMobileState !== previousMobileState) {

        closeMobileMenu();

        previousMobileState = currentMobileState;

    }

}, { passive: true });


/* =========================================================
   NAVBAR
   ========================================================= */

let ticking = false;


function updateNavbar() {

    if (!navbar) return;

    const scrolled = window.scrollY > 40;

    if (scrolled) {

        navbar.classList.add("navbar-scrolled");

    } else {

        navbar.classList.remove("navbar-scrolled");

    }

}


window.addEventListener("scroll", () => {

    if (!ticking) {

        window.requestAnimationFrame(() => {

            updateNavbar();

            ticking = false;

        });

        ticking = true;

    }

}, { passive: true });


updateNavbar();


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetID = link.getAttribute("href");

        if (!targetID || targetID === "#") return;

        const target = document.querySelector(targetID);

        if (!target) return;

        event.preventDefault();

        const navbarHeight = navbar
            ? navbar.offsetHeight
            : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight;

        window.scrollTo({

            top: targetPosition,

            behavior: "smooth"

        });

    });

});


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sectionObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const id = entry.target.id;

            navLinks.forEach(link => {

                link.classList.remove("active");

                if (link.getAttribute("href") === `#${id}`) {

                    link.classList.add("active");

                }

            });

        });

    },

    {
        root: null,
        threshold: 0.25,
        rootMargin: "-15% 0px -55% 0px"
    }

);


sections.forEach(section => {

    sectionObserver.observe(section);

});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements = document.querySelectorAll(
    ".section-label, " +
    ".experience-text, " +
    ".experience-image, " +
    ".experience-item, " +
    ".feature, " +
    ".about-features > div, " +
    ".gallery-grid img, " +
    ".location-grid > div"
);


/*
 * Respect users who disable animation
 */

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


if (!prefersReducedMotion) {

    revealElements.forEach(element => {

        element.classList.add("reveal");

    });


    const revealObserver = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("revealed");

                revealObserver.unobserve(entry.target);

            });

        },

        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }

    );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(element => {

        element.classList.add("revealed");

    });

}


/* =========================================================
   LAZY LOAD IMAGES
   ========================================================= */

document.querySelectorAll("img").forEach(image => {

    /*
     * Don't lazy-load images that are already visible
     * near the top of the page.
     */

    if (!image.hasAttribute("loading")) {

        image.setAttribute("loading", "lazy");

    }

    if (!image.hasAttribute("decoding")) {

        image.setAttribute("decoding", "async");

    }

});


/* Hero image should load immediately */

const hero = document.querySelector(".hero");

if (hero) {

    hero.style.willChange = "auto";

}


/* =========================================================
   IMAGE ERROR HANDLING
   ========================================================= */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("error", () => {

        image.classList.add("image-error");

    });

});


/* =========================================================
   BOOKING BUTTON PROTECTION
   ========================================================= */

document.querySelectorAll(
    'a[href^="tel:"], a[href*="wa.me"]'
).forEach(button => {

    button.addEventListener("click", () => {

        /*
         * Close mobile menu before leaving the website.
         */

        closeMobileMenu();

    });

});


/* =========================================================
   MOBILE TOUCH EXPERIENCE
   ========================================================= */

if ("ontouchstart" in window) {

    body.classList.add("touch-device");

}


/* =========================================================
   ORIENTATION CHANGE
   ========================================================= */

window.addEventListener("orientationchange", () => {

    setTimeout(() => {

        updateNavbar();

        closeMobileMenu();

    }, 250);

});


/* =========================================================
   ONLINE / OFFLINE STATUS
   ========================================================= */

window.addEventListener("offline", () => {

    body.classList.add("offline");

});


window.addEventListener("online", () => {

    body.classList.remove("offline");

});


/* =========================================================
   INITIAL STATE
   ========================================================= */

if (mobileMenu) {

    mobileMenu.setAttribute("aria-hidden", "true");

}


if (menuButton) {

    menuButton.setAttribute("aria-expanded", "false");

}


/* =========================================================
   PAGE READY
   ========================================================= */

document.documentElement.classList.add("js-enabled");
