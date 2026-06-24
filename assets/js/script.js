"use strict";

/* =========================================================
   ELEMENTOS GERAIS DA INTERFACE
========================================================= */

const header = document.querySelector(".header");
const menuButton = document.querySelector("#menu-button");
const navLinksContainer = document.querySelector("#nav-links");
const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);
const smoothScrollLinks = document.querySelectorAll(
    '.nav-links a[href^="#"], .logo[href^="#"], .hero-actions a[href^="#"]'
);
const currentYearElement = document.querySelector("#current-year");


/* =========================================================
   ANO AUTOMÁTICO NO RODAPÉ
========================================================= */

if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   MENU MOBILE
========================================================= */

function openMobileMenu() {
    if (!menuButton || !navLinksContainer) {
        return;
    }

    navLinksContainer.classList.add("active");
    menuButton.classList.add("active");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute(
        "aria-label",
        "Fechar menu de navegação"
    );
}


function closeMobileMenu() {
    if (!menuButton || !navLinksContainer) {
        return;
    }

    navLinksContainer.classList.remove("active");
    menuButton.classList.remove("active");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute(
        "aria-label",
        "Abrir menu de navegação"
    );
}


function toggleMobileMenu() {
    if (!navLinksContainer) {
        return;
    }

    const menuIsOpen = navLinksContainer.classList.contains("active");

    if (menuIsOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


if (menuButton) {
    menuButton.addEventListener("click", toggleMobileMenu);
}


/*
Fecha o menu quando o usuário seleciona uma seção.
*/
navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});


/*
Fecha o menu ao pressionar a tecla Escape.
*/
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});


/*
Fecha o menu ao clicar fora da navegação.
*/
document.addEventListener("click", (event) => {
    if (!menuButton || !navLinksContainer) {
        return;
    }

    const menuIsOpen = navLinksContainer.classList.contains("active");

    if (!menuIsOpen) {
        return;
    }

    const clickedInsideMenu = navLinksContainer.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {
        closeMobileMenu();
    }
});


/*
Evita que o menu continue aberto ao aumentar a janela.
*/
window.addEventListener("resize", () => {
    if (window.innerWidth > 780) {
        closeMobileMenu();
    }
});


/* =========================================================
   CABEÇALHO AO ROLAR A PÁGINA
========================================================= */

function updateHeaderStyle() {
    if (!header) {
        return;
    }

    header.classList.toggle(
        "scrolled",
        window.scrollY > 30
    );
}


window.addEventListener("scroll", updateHeaderStyle);

updateHeaderStyle();


/* =========================================================
   PREFERÊNCIA DE MOVIMENTO REDUZIDO
========================================================= */

const reduceMotionEnabled = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================================
   FILTROS DAS CERTIFICAÇÕES
========================================================= */

const certificateFilterButtons = document.querySelectorAll(
    ".certificate-filter-button"
);

const certificateCards = document.querySelectorAll(
    ".certificate-card"
);

const certificatesEmptyMessage = document.querySelector(
    "#certificates-empty"
);


function updateCertificateFilter(selectedFilter) {
    let visibleCertificates = 0;

    certificateCards.forEach((card) => {
        const cardCategory = card.dataset.category;

        const shouldShow =
            selectedFilter === "all" ||
            cardCategory === selectedFilter;

        card.classList.toggle(
            "is-hidden",
            !shouldShow
        );

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCertificates += 1;
        }
    });


    certificateFilterButtons.forEach((button) => {
        const buttonFilter = button.dataset.filter;
        const buttonIsActive = buttonFilter === selectedFilter;

        button.classList.toggle(
            "active",
            buttonIsActive
        );

        button.setAttribute(
            "aria-pressed",
            String(buttonIsActive)
        );
    });


    if (certificatesEmptyMessage) {
        const categoryIsEmpty = visibleCertificates === 0;

        certificatesEmptyMessage.hidden = !categoryIsEmpty;
    }
}


certificateFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        if (!selectedFilter) {
            return;
        }

        updateCertificateFilter(selectedFilter);
    });
});


if (certificatesEmptyMessage) {
    certificatesEmptyMessage.setAttribute(
        "aria-live",
        "polite"
    );
}


/*
Define o filtro inicial.
*/
const initialCertificateFilterButton = document.querySelector(
    ".certificate-filter-button.active"
);

const initialCertificateFilter =
    initialCertificateFilterButton?.dataset.filter || "all";

updateCertificateFilter(initialCertificateFilter);


/* =========================================================
   ANIMAÇÕES DE ENTRADA
========================================================= */

const animatedElements = document.querySelectorAll(
    [
        ".section-heading",
        ".about-content",
        ".about-card",
        ".technology-card",
        ".project-card",
        ".timeline-item",
        ".education-card",
        ".certificates-introduction",
        ".certificates-filter",
        ".certificate-card",
        ".contact-content"
    ].join(", ")
);


animatedElements.forEach((element, index) => {
    element.classList.add("reveal");

    const delay = (index % 4) * 80;

    element.style.setProperty(
        "--reveal-delay",
        `${delay}ms`
    );
});


function showAllAnimatedElements() {
    animatedElements.forEach((element) => {
        element.classList.add("visible");
    });
}


if (
    reduceMotionEnabled ||
    !("IntersectionObserver" in window)
) {
    showAllAnimatedElements();
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");

                /*
                Cada elemento é animado apenas uma vez.
                */
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px"
        }
    );


    animatedElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* =========================================================
   SEÇÃO ATIVA NO MENU
========================================================= */

const pageSections = document.querySelectorAll(
    "main section[id]"
);


function activateNavigationLink(sectionId) {
    navigationLinks.forEach((link) => {
        const targetId = link.getAttribute("href");

        link.classList.toggle(
            "active",
            targetId === `#${sectionId}`
        );
    });
}


if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activateNavigationLink(
                        entry.target.id
                    );
                }
            });
        },
        {
            /*
            Considera ativa a seção posicionada
            na região central da tela.
            */
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );


    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* =========================================================
   ROLAGEM SUAVE CONTROLADA
========================================================= */

smoothScrollLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetSelector = link.getAttribute("href");

        if (
            !targetSelector ||
            targetSelector === "#"
        ) {
            return;
        }

        const targetSection = document.querySelector(
            targetSelector
        );

        if (!targetSection) {
            return;
        }

        event.preventDefault();

        targetSection.scrollIntoView({
            behavior: reduceMotionEnabled
                ? "auto"
                : "smooth",

            block: "start"
        });

        history.replaceState(
            null,
            "",
            targetSelector
        );
    });
});