"use strict";

/* =========================================================
   ELEMENTOS DA INTERFACE
========================================================= */

const header = document.querySelector(".header");
const menuButton = document.querySelector("#menu-button");
const navLinksContainer = document.querySelector("#nav-links");
const navigationLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const currentYearElement = document.querySelector("#current-year");


/* =========================================================
   ANO AUTOMÁTICO NO RODAPÉ
========================================================= */

if (currentYearElement) {
    const currentYear = new Date().getFullYear();

    currentYearElement.textContent = currentYear;
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
    link.addEventListener("click", () => {
        closeMobileMenu();
    });
});


/*
Fecha o menu quando o usuário pressiona Esc.
*/
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
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

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}


window.addEventListener("scroll", updateHeaderStyle);

updateHeaderStyle();


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
        ".contact-content"
    ].join(", ")
);


animatedElements.forEach((element, index) => {
    element.classList.add("reveal");

    /*
    Cria pequenos intervalos nas animações dos cartões.
    */
    const delay = (index % 4) * 80;

    element.style.setProperty(
        "--reveal-delay",
        `${delay}ms`
    );
});


const reduceMotionEnabled = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


if (reduceMotionEnabled) {
    animatedElements.forEach((element) => {
        element.classList.add("visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");

                /*
                A animação acontece somente uma vez.
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


const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activateNavigationLink(entry.target.id);
            }
        });
    },
    {
        /*
        Considera ativa a seção localizada na região
        central da tela.
        */
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    }
);


pageSections.forEach((section) => {
    sectionObserver.observe(section);
});


/* =========================================================
   ROLAGEM SUAVE CONTROLADA
========================================================= */

navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetSelector = link.getAttribute("href");
        const targetSection = document.querySelector(targetSelector);

        if (!targetSection) {
            return;
        }

        event.preventDefault();

        targetSection.scrollIntoView({
            behavior: reduceMotionEnabled ? "auto" : "smooth",
            block: "start"
        });

        /*
        Atualiza a URL sem recarregar a página.
        */
        history.replaceState(
            null,
            "",
            targetSelector
        );
    });
});