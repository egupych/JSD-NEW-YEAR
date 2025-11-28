/* Файл: app.js */

const track = document.querySelector('.gallery-track');

// --- 1. ПЛАВНЫЙ СКРОЛЛ (Custom Smooth Scroll) ---

const easing = 0.08; 
let currentY = 0;    
let targetY = 0;     
let rafId = null;    

const lerp = (start, end, t) => start * (1 - t) + end * t;

function setBodyHeight() {
    if (track) {
        document.body.style.height = `${track.scrollHeight}px`;
    }
}

function updateScroll() {
    currentY = lerp(currentY, targetY, easing);
    
    if (track) {
        track.style.transform = `translate3d(0, -${currentY}px, 0)`;
    }

    if (Math.abs(targetY - currentY) < 0.1) {
        currentY = targetY;
        track.style.transform = `translate3d(0, -${targetY}px, 0)`;
        rafId = null;
    } else {
        rafId = requestAnimationFrame(updateScroll);
    }
}

function onScroll() {
    targetY = window.scrollY; 
    if (!rafId) {
        rafId = requestAnimationFrame(updateScroll);
    }
}

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', () => {
    setBodyHeight();
    onScroll();
});
window.addEventListener('load', () => {
    setBodyHeight();
    onScroll();
});


// --- 2. ПОЯВЛЕНИЕ "ПО ОДНОЙ" (Intersection Observer) ---

const observerOptions = {
    root: null, 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observerCallback = (entries, observer) => {
    let delayCounter = 0;

    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delayCounter * 100); 

            delayCounter++; 
            observer.unobserve(entry.target);
        }
    });
};

const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
const cards = document.querySelectorAll('.card');

cards.forEach((card) => {
    scrollObserver.observe(card);
});


// --- 3. ПОПАП (LIGHTBOX) ---

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');
const cardImages = document.querySelectorAll('.card img');

cardImages.forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = img.src;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    });
});

const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; 
    setTimeout(() => {
        lightboxImg.src = '';
    }, 300);
};

closeBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});


// --- 4. ЭФФЕКТ ЗАМОРОЗКИ (Frost Overlay) ---

const frostOverlay = document.getElementById('frost-overlay');
let frostTimeout;

const resetFrostTimer = () => {
    // 1. Снимаем заморозку (если была)
    frostOverlay.classList.remove('active');
    
    // 2. Сбрасываем старый таймер
    clearTimeout(frostTimeout);
    
    // 3. Запускаем новый таймер на 10 секунд
    frostTimeout = setTimeout(() => {
        frostOverlay.classList.add('active');
    }, 10000);
};

// События, которые считаются активностью пользователя
const activityEvents = ['mousemove', 'scroll', 'click', 'keydown', 'touchstart', 'wheel'];

activityEvents.forEach(event => {
    window.addEventListener(event, resetFrostTimer, { passive: true });
});

// Запускаем таймер при загрузке
resetFrostTimer();