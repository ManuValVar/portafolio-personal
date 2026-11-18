// --- Mobile navigation ---
const navLinks = document.getElementById('navlinks');

const img = document.querySelector('.AboutmeImg');

// animación para la imagen de AboutMe
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, { threshold: 0.35 });

    observer.observe(img);


// cerrar el menú al hacer clic en un enlace
navLinks.querySelectorAll('.navlink').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('show'));
});

// background de navbar al hacer scroll
const navbar = document.querySelector('.navbar');
const updateNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
};
updateNavbar();
window.addEventListener('scroll', updateNavbar);

// --- animaciones al hacer scroll (PC y celular) ---
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Que elementos animar, con que efecto, y si los hermanos entran uno tras otro
const REVEAL_ITEMS = [
    { selector: '.AboutmeDivider',  effect: 'right' },
    { selector: '.skillHeader',     effect: 'up' },
    { selector: '.skillsCarousel',  effect: 'up' },
    { selector: '.projectHeader',   effect: 'up' },
    { selector: '.projectCard',     effect: 'up',    stagger: 'row' },
    { selector: '.focusHeader',     effect: 'up' },
    { selector: '.focusCard',       effect: 'up',    stagger: 'row' },
    { selector: '.contactHeader',   effect: 'up' },
    { selector: '.contactForm',     effect: 'left' },
    { selector: '.contactCard',     effect: 'right', stagger: 'all' },
    { selector: '.footerContainer', effect: 'up' }
];

const REVEAL_CLASSES = ['reveal', 'reveal-up', 'reveal-left', 'reveal-right', 'is-revealed'];
const STAGGER_MS = 120;

if (!reduceMotion) {
    const pendingReveal = new Set();

    function revealElement(el) {
        if (!pendingReveal.has(el)) return;
        pendingReveal.delete(el);
        revealObserver.unobserve(el);
        el.classList.add('is-revealed');

        // Al terminar la animacion, el elemento vuelve a su CSS original
        // (asi no se pierden sus efectos hover).
        const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
        setTimeout(() => {
            el.classList.remove(...REVEAL_CLASSES);
            el.style.removeProperty('--reveal-delay');
        }, delay + 1000);
    }

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) revealElement(entry.target);
            });
        },
        // threshold 0 + margen inferior: funciona igual con elementos altos en celular
        { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );

    REVEAL_ITEMS.forEach(({ selector, effect, stagger }) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            let delay = 0;

            if (stagger === 'all') {
                delay = i * STAGGER_MS;
            } else if (stagger === 'row') {
                // En una cuadrícula, el retraso depende de la columna (no crece sin limite)
                const columns = getComputedStyle(el.parentElement).gridTemplateColumns;
                const count = columns && columns !== 'none' ? columns.split(' ').length : 1;
                delay = (i % count) * STAGGER_MS;
            }

            el.style.setProperty('--reveal-delay', `${delay}ms`);
            el.classList.add('reveal', `reveal-${effect}`);
            pendingReveal.add(el);
            revealObserver.observe(el);
        });
    });

    // Respaldo: al llegar al final de la pagina, mostrar lo que haya quedado pendiente
    // (por ejemplo el footer en pantallas altas, que nunca cruza la linea de activacion)
    window.addEventListener('scroll', () => {
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom) [...pendingReveal].forEach(revealElement);
    }, { passive: true });
}

// ELEMENTOS DEL MODAL
const botonAbrir = document.getElementById("abrirTinyStars");
const botonCerrar = document.getElementById("cerrarTinyStars");
const modalJuego = document.getElementById("modalTinyStars");
const unityFrame = document.getElementById("unityFrame");

// URL DEL VIDEOJUEGO
const URL_JUEGO = "https://tinystarsgame.netlify.app/";

// ABRIR EL VIDEOJUEGO
botonAbrir.addEventListener("click", () => {
    modalJuego.classList.add("activo");

    // Cargar el videojuego
    unityFrame.src = URL_JUEGO;
});

// CERRAR EL VIDEOJUEGO
function cerrarJuego() {
    modalJuego.classList.remove("activo");

    // Detener el videojuego al cerrar
    unityFrame.src = "";
}

botonCerrar.addEventListener("click", cerrarJuego);

// CERRAR AL HACER CLIC FUERA DEL MODAL
modalJuego.addEventListener("click", (e) => {
    if (e.target === modalJuego) {
        cerrarJuego();
    }
});

// CERRAR CON LA TECLA ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalJuego.classList.contains("activo")) {
        cerrarJuego();
    }
});

// ELEMENTOS DEL CARRUSEL
const viewport = document.getElementById("skillsViewport");
const track = document.getElementById("skillsTrack");

const btnNext = document.getElementById("nextSkill");
const btnPrev = document.getElementById("prevSkill");

// OBTENER TODAS LAS TARJETAS
const cards = track.querySelectorAll(".skillCard");

// ÍNDICE DE LA TARJETA ACTUAL
let currentIndex = 0;

// TEMPORIZADOR DEL CARRUSEL
let autoplay;

// CALCULAR CUÁNTAS TARJETAS SE MUESTRAN
function getVisibleCards() {

    if (window.innerWidth <= 600) {
        return 1;
    }

    if (window.innerWidth <= 900) {
        return 2;
    }

    return 4;
}

// CALCULAR EL MÁXIMO DESPLAZAMIENTO
function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCards());
}

// ACTUALIZAR LA POSICIÓN DEL CARRUSEL
function updateCarousel() {

    // Obtener el ancho de una tarjeta
    const cardWidth = cards[0].getBoundingClientRect().width;

    // Obtener la separación entre tarjetas
    const gap = parseFloat(
        getComputedStyle(track).gap
    ) || 0;

    // Calcular cuánto debe desplazarse
    const movement = (cardWidth + gap) * currentIndex;

    // Mover las tarjetas horizontalmente
    track.style.transform = `translateX(-${movement}px)`;

}

// AVANZAR UNA TARJETA
function nextSlide() {

    if (currentIndex < getMaxIndex()) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }

    updateCarousel();
}

// RETROCEDER UNA TARJETA
function prevSlide() {

    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = getMaxIndex();
    }

    updateCarousel();
}

// EVENTOS DE LOS BOTONES
btnNext.addEventListener("click", () => {
    nextSlide();
    restartAutoplay();
});

btnPrev.addEventListener("click", () => {
    prevSlide();
    restartAutoplay();
});

// INICIAR MOVIMIENTO AUTOMÁTICO
function startAutoplay() {

    autoplay = setInterval(() => {
        nextSlide();
    }, 3000);
}

// REINICIAR EL TEMPORIZADOR
function restartAutoplay() {

    clearInterval(autoplay);
    startAutoplay();
}

// PAUSAR AL PASAR EL CURSOR
viewport.addEventListener("mouseenter", () => {
    clearInterval(autoplay);
});

// REANUDAR AL SALIR EL CURSOR
viewport.addEventListener("mouseleave", () => {
    startAutoplay();
});

// ACTUALIZAR AL CAMBIAR EL TAMAÑO DE PANTALLA
window.addEventListener("resize", () => {

    // Evitar que el índice supere el límite
    currentIndex = Math.min(currentIndex, getMaxIndex());

    updateCarousel();
});

// ANIMAR LAS BARRAS DE HABILIDADES (cuando la seccion entra en pantalla)

const skillBars = document.querySelectorAll(".skillFill");

function fillSkillBars() {
    skillBars.forEach((bar) => {
        bar.style.width = bar.getAttribute("data-width");
    });
}

if (reduceMotion) {
    fillSkillBars();
} else {
    const skillsObserver = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
            fillSkillBars();
            obs.disconnect();
        }
    }, { threshold: 0.25 });

    skillsObserver.observe(document.getElementById("skills"));
}

// INICIALIZAR EL CARRUSEL
updateCarousel();
startAutoplay();

/* =================================
    CURSOR Y REFLEJO INTERACTIVO
================================= */

const cursorGlow = document.getElementById("cursorGlow");
const customCursor = document.getElementById("customCursor");

// Detectar movimiento del mouse
document.addEventListener("mousemove", (event) => {

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Mover el reflejo violeta
    cursorGlow.style.left = `${mouseX}px`;
    cursorGlow.style.top = `${mouseY}px`;

    // Mover el cursor circular
    customCursor.style.left = `${mouseX}px`;
    customCursor.style.top = `${mouseY}px`;

    // Mostrar los elementos
    cursorGlow.style.opacity = "1";
    customCursor.style.opacity = "1";

});

// Ocultar cuando el mouse sale de la ventana
document.addEventListener("mouseout", (event) => {

    if (!event.relatedTarget) {
        cursorGlow.style.opacity = "0";
        customCursor.style.opacity = "0";
    }

});

// Efecto hover en elementos interactivos
const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, select, .projectCard"
);

interactiveElements.forEach((element) => {

    element.addEventListener("mouseenter", () => {
        customCursor.classList.add("hover");
    });

    element.addEventListener("mouseleave", () => {
        customCursor.classList.remove("hover");
    });

});

// MODAL POMOPET (VIDEO DEMO)
const abrirPomo = document.getElementById("abrirPomoPet");
const cerrarPomo = document.getElementById("cerrarPomoPet");
const modalPomo = document.getElementById("modalPomoPet");
const videoPomo = document.getElementById("videoPomoPet");

function abrirModalPomo() {
    modalPomo.classList.add("activo");
    document.body.style.overflow = "hidden";   // evita que la pagina se mueva detras del modal
    cerrarPomo.focus();

    // Al abrir desde un clic, el navegador permite reproducir de inmediato
    videoPomo.play().catch(() => {});
}

function cerrarModalPomo() {
    modalPomo.classList.remove("activo");
    document.body.style.overflow = "";

    // Detener y volver al inicio
    videoPomo.pause();
    videoPomo.currentTime = 0;
    abrirPomo.focus();
}

abrirPomo.addEventListener("click", abrirModalPomo);
cerrarPomo.addEventListener("click", cerrarModalPomo);

// Cerrar al hacer clic fuera del contenido
modalPomo.addEventListener("click", (e) => {
    if (e.target === modalPomo) cerrarModalPomo();
});

// Cerrar con la tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalPomo.classList.contains("activo")) {
        cerrarModalPomo();
    }
});

// Contact Form - Backend API
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const contactSubmitLabel = document.getElementById('contactSubmitLabel');

const API_URL = 'https://portafolio-personal-0a4z.onrender.com/api/messages';

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formStatus.classList.remove('show', 'success', 'error');

        // Obtener los datos del formulario
        const nombre = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const asunto = document.getElementById('subject').value.trim();
        const mensaje = document.getElementById('message').value.trim();

        // Mostrar estado de envío
        contactSubmitBtn.disabled = true;
        contactSubmitLabel.textContent = 'Enviando...';
        formStatus.textContent = '';

        try {
            // Enviar los datos al backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    asunto,
                    mensaje,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'No se pudo enviar el mensaje');
            }

            
            // Mostrar mensaje de éxito
            formStatus.textContent = '¡Tu mensaje ha sido enviado correctamente! Gracias por contactarme.';

            formStatus.classList.remove('error');
            formStatus.classList.add('show', 'success');

            // Limpiar el formulario
            contactForm.reset();

        } catch (error) {
            console.error('Error al enviar el formulario:', error);

            formStatus.textContent = error.message || 'No fue posible enviar tu mensaje. Intenta nuevamente.';

            formStatus.classList.remove('success');
            formStatus.classList.add('show', 'error');

        } finally {
            // Restaurar el botón
            contactSubmitBtn.disabled = false;
            contactSubmitLabel.textContent = 'Enviar Mensaje';
        }
    });
}

