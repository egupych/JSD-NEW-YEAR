/* Файл: app.js */

const track = document.querySelector('.gallery-track');

// --- 1. ПЛАВНЫЙ СКРОЛЛ (Smooth Scroll) ---

const easing = 0.08; // Плавность (меньше = плавнее)
let startY = 0;
let endY = 0;
let raf = null;

const lerp = (start, end, t) => start * (1 - t) + end * t;

// Устанавливаем высоту страницы равной высоте контента, 
// чтобы браузер показал скроллбар и позволил скроллить
function setBodyHeight() {
    document.body.style.height = `${track.scrollHeight}px`;
}

function updateScroll() {
  // Интерполяция значения скролла
  startY = lerp(startY, endY, easing);
  // Сдвигаем фиксированный контейнер
  track.style.transform = `translateY(-${startY}px)`;

  // Продолжаем анимацию пока есть разница
  if (Math.abs(startY - window.scrollY) < 0.1) {
    cancelAnimationFrame(raf);
    raf = null;
  } else {
    raf = requestAnimationFrame(updateScroll);
  }
}

function startScroll() {
  endY = window.scrollY;
  if (!raf) raf = requestAnimationFrame(updateScroll);
}

// Запуск слушателей
window.addEventListener('scroll', startScroll);
window.addEventListener('resize', () => {
    setBodyHeight();
    startScroll();
});
window.addEventListener('load', () => {
    setBodyHeight();
    startScroll();
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
            }, delayCounter * 150); 

            delayCounter++; 
            observer.unobserve(entry.target);
        }
    });
};

const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
const cardsContainer = document.querySelectorAll('.card');

cardsContainer.forEach((card) => {
    scrollObserver.observe(card);
});


// --- 3. ПОПАП (LIGHTBOX) ---

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');
const cardImages = document.querySelectorAll('.card img');

// Открытие
cardImages.forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = img.src;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    });
});

// Закрытие
const closeLightbox = () => {
    lightbox.classList.remove('active');
    // Возвращаем overflow: scroll, чтобы JS-скролл продолжил работать
    document.body.style.overflow = 'hidden auto'; 
    
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