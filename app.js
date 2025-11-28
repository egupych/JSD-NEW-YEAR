/* Файл: app.js */
// --- Логика Лайтбокса (Попапа) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');
const cards = document.querySelectorAll('.card img');

// Открытие лайтбокса
cards.forEach(img => {
    img.addEventListener('click', () => {
        const src = img.src;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл фона
    });
});

// Функция закрытия
const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Возвращаем скролл
    // Очищаем src после анимации
    setTimeout(() => {
        lightboxImg.src = '';
    }, 300);
};

// Слушатели событий
closeBtn.addEventListener('click', closeLightbox);

// Закрытие по клику вне картинки
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Закрытие по клавише Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});