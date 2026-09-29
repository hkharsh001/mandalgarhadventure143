"use strict";


/* =====================================================
   DOM
===================================================== */

const body = document.body;

const navbar = document.querySelector(".navbar");

const menuButton =
    document.getElementById("menuButton");

const closeMenu =
    document.getElementById("closeMenu");

const mobileMenu =
    document.getElementById("mobileMenu");

const mobileLinks =
    document.querySelectorAll(".mobile-menu a");

const navLinks =
    document.querySelectorAll(
        '.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]'
    );

const sections =
    document.querySelectorAll("section[id]");


/* =====================================================
   DEVICE
===================================================== */

const mobileBreakpoint = 800;

const isMobile = () =>
    window.innerWidth <= mobileBreakpoint;


/* =====================================================
   MOBILE MENU
===================================================== */

function openMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("active");

    body.classList.add("menu-open");

    if (menuButton) {
        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    mobileMenu.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove("active");

    body.classList.remove("menu-open");

    if (menuButton) {
        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    mobileMenu.setAttribute(
        "aria-hidden",
        "true"
    );
}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        openMobileMenu
    );

}


if (closeMenu) {

    closeMenu.addEventListener(
        "click",
        closeMobileMenu
    );

}


mobileLinks.forEach(link => {

    link.addEventListener(
        "click",
        closeMobileMenu
    );

});


if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        event => {

            if (event.target === mobileMenu) {
                closeMobileMenu();
            }

        }
    );

}


/* ESC closes menu */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    }
);


/* =====================================================
   RESPONSIVE MENU RESET
===================================================== */

let previousMobileState = isMobile();


window.addEventListener(
    "resize",
    () => {

        const currentMobileState =
            isMobile();

        if (
            currentMobileState !==
            previousMobileState
        ) {

            closeMobileMenu();

            previousMobileState =
                currentMobileState;

        }

    },
    { passive: true }
);


/* =====================================================
   NAVBAR
===================================================== */

let ticking = false;


function updateNavbar() {

    if (!navbar) return;

    if (window.scrollY > 40) {

        navbar.classList.add(
            "navbar-scrolled"
        );

    } else {

        navbar.classList.remove(
            "navbar-scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    () => {

        if (!ticking) {

            window.requestAnimationFrame(
                () => {

                    updateNavbar();

                    ticking = false;

                }
            );

            ticking = true;
        }

    },
    { passive: true }
);


updateNavbar();


/* =====================================================
   SMOOTH SCROLL
===================================================== */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetID =
                    link.getAttribute("href");

                if (
                    !targetID ||
                    targetID === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetID
                    );

                if (!target) return;

                event.preventDefault();

                const navbarHeight =
                    navbar
                        ? navbar.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }
        );

    });


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sectionObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting)
                    return;

                const id =
                    entry.target.id;

                navLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );

                    if (
                        link.getAttribute(
                            "href"
                        ) === `#${id}`
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                });

            });

        },

        {
            root: null,

            threshold: 0.25,

            rootMargin:
                "-15% 0px -55% 0px"
        }

    );


sections.forEach(section => {

    sectionObserver.observe(section);

});


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".section-label, " +
        ".experience-text, " +
        ".experience-image, " +
        ".experience-item, " +
        ".feature, " +
        ".about-features > div, " +
        ".gallery-grid img, " +
        ".about-image, " +
        ".location-grid > div"
    );


const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (!prefersReducedMotion) {

    revealElements.forEach(element => {

        element.classList.add("reveal");

    });


    const revealObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    entry.target.classList.add(
                        "revealed"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -50px 0px"
            }

        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(element => {

        element.classList.add(
            "revealed"
        );

    });

}


/* =====================================================
   IMAGE OPTIMIZATION
===================================================== */

document
    .querySelectorAll("img")
    .forEach(image => {

        if (!image.hasAttribute("decoding")) {

            image.setAttribute(
                "decoding",
                "async"
            );

        }

    });


/* =====================================================
   IMAGE ERROR
===================================================== */

document
    .querySelectorAll("img")
    .forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-error"
                );

                console.warn(
                    "Image failed to load:",
                    image.src
                );

            }
        );

    });


/* =====================================================
   TOUCH DEVICES
===================================================== */

if ("ontouchstart" in window) {

    body.classList.add(
        "touch-device"
    );

}


/* =====================================================
   ORIENTATION
===================================================== */

window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(
            () => {

                updateNavbar();

                closeMobileMenu();

            },
            250
        );

    }
);


/* =====================================================
   INITIAL STATE
===================================================== */

if (mobileMenu) {

    mobileMenu.setAttribute(
        "aria-hidden",
        "true"
    );

}

if (menuButton) {

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

}

document.documentElement
    .classList.add("js-enabled");
