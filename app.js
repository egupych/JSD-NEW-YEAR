/* Файл: app.js */

// --- Логика Анимации "По одной" ---

const observerOptions = {
    root: null, 
    threshold: 0.1, 
    rootMargin: '0px 0px -50px 0px'
};

const observerCallback = (entries, observer) => {
    // Счетчик задержки для текущей группы появившихся элементов
    let delayCounter = 0;

    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Используем setTimeout для создания очереди появления
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delayCounter * 150); // 150мс задержка между каждым элементом

            delayCounter++; // Увеличиваем задержку для следующего элемента в этой пачке
            
            observer.unobserve(entry.target);
        }
    });
};

const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

const cardsContainer = document.querySelectorAll('.card');
const cardImages = document.querySelectorAll('.card img');

cardsContainer.forEach((card) => {
    scrollObserver.observe(card);
});


// --- Логика Лайтбокса (Попапа) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');

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
    document.body.style.overflow = '';
    setTimeout(() => {
        lightboxImg.src = '';
    }, 400);
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