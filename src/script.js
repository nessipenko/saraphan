const slides = document.querySelector('.shops__slider_slides'),
    prev = document.querySelector('.prev'),
    next = document.querySelector('.next'),
    dots = document.querySelectorAll('.dot'),
    hamburger = document.querySelector('.hamburger'),
    menu = document.querySelector('.menu'),
    menuClose = document.querySelector('.menu__close'),
    overlay = document.querySelector('.menu__overlay')

let index = 0;
let intervalId;

const goToSlide = (idx) => {
    slides.style.transform = `translateX(-${idx * 100}%)`;
}

const setActiveDot = (idx) => {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', idx === i);
    });
}

const navigateSlide = (direction) => {
    if (direction === 'next') {
        index = (index + 1) % slides.children.length;
    } else {
        index = (index - 1 + slides.children.length) % slides.children.length;
    }
    goToSlide(index);
    setActiveDot(index);
}

const toggleAutoSlide = (action) => {
    if (action === 'start') {
        intervalId = setInterval(nextSlide, 5000);
    } else {
        clearInterval(intervalId);
    }
}

const toggleMenu = () => {
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    overlay.classList.toggle('active');
}

const nextSlide = () => {
    navigateSlide('next');
}

const prevSlide = () => {
    navigateSlide('prev');
}

next.addEventListener('click', () => {
    nextSlide();
    toggleAutoSlide('stop');
    toggleAutoSlide('start');
});

prev.addEventListener('click', () => {
    prevSlide();
    toggleAutoSlide('stop');
    toggleAutoSlide('start');
});

dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        index = idx;
        goToSlide(idx);
        setActiveDot(idx);
        toggleAutoSlide('stop');
        toggleAutoSlide('start');
    });
});

hamburger.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', toggleMenu);

toggleAutoSlide('start');