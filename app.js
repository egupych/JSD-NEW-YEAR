/* Файл: app.js
   Описание:
   1. Реализует кастомный плавный скролл (Smooth Scroll) через смещение контейнера.
   2. Рассчитывает высоту body, чтобы нативный скроллбар соответствовал длине контента.
   3. Управляет появлением элементов (Intersection Observer).
   4. Отвечает за открытие/закрытие модального окна (Lightbox).
*/

const track = document.querySelector('.gallery-track');

// --- 1. ПЛАВНЫЙ СКРОЛЛ (Custom Smooth Scroll) ---

const easing = 0.08; // Коэффициент плавности (меньше = медленнее/плавнее)
let currentY = 0;    // Текущая позиция сдвига
let targetY = 0;     // Целевая позиция (скролл браузера)
let rafId = null;    // ID анимации

// Функция линейной интерполяции
const lerp = (start, end, t) => start * (1 - t) + end * t;

// Устанавливаем высоту body равной реальной высоте контента,
// чтобы появился нативный скроллбар
function setBodyHeight() {
    if (track) {
        document.body.style.height = `${track.scrollHeight}px`;
    }
}

function updateScroll() {
    // Плавно приближаем текущее значение к целевому
    currentY = lerp(currentY, targetY, easing);
    
    // Применяем сдвиг (translate3d включает GPU-ускорение)
    if (track) {
        track.style.transform = `translate3d(0, -${currentY}px, 0)`;
    }

    // Если разница очень мала, останавливаем анимацию для экономии ресурсов
    // Иначе продолжаем цикл
    if (Math.abs(targetY - currentY) < 0.1) {
        currentY = targetY;
        track.style.transform = `translate3d(0, -${targetY}px, 0)`;
        rafId = null;
    } else {
        rafId = requestAnimationFrame(updateScroll);
    }
}

function onScroll() {
    targetY = window.scrollY; // Обновляем цель
    if (!rafId) {
        rafId = requestAnimationFrame(updateScroll);
    }
}

// Слушатели событий скролла и изменения размеров
window.addEventListener('scroll', onScroll);

window.addEventListener('resize', () => {
    setBodyHeight();
    onScroll(); // Пересчитываем позицию
});

// Ждем полной загрузки (включая картинки), чтобы верно посчитать высоту
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
            // Небольшая задержка для эффекта "лесенки"
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

// Открытие
cardImages.forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = img.src;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        // Блокируем скролл, чтобы страница не ехала под попапом
        document.body.style.overflow = 'hidden'; 
    });
});

// Закрытие
const closeLightbox = () => {
    lightbox.classList.remove('active');
    
    // ВАЖНО: Возвращаем сброс overflow в пустоту, чтобы подхватилось значение из CSS.
    // В оригинале была ошибка 'hidden auto', которая могла ломать логику.
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