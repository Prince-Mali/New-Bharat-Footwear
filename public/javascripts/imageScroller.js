let leftScrollBtn = document.querySelector('.left-scroll-btn');
let rightScrollBtn = document.querySelector('.right-scroll-btn');
let imageContainer = document.querySelector('.image-container');


leftScrollBtn.addEventListener('click', () => {
    imageContainer.scrollBy({
        left : -1400,
        behavior : "smooth"
    });
});

rightScrollBtn.addEventListener('click', () => {
    imageContainer.scrollBy({
        left : 1400,
        behavior : "smooth"
    });
});

