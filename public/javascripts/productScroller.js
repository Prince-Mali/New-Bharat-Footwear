let leftBtn = document.querySelector('.product-container .left-scroll-btn');
let rightBtn = document.querySelector('.product-container .right-scroll-btn');
let productContainer = document.querySelector('.product-group');

leftBtn.addEventListener('click', () => {
    productContainer.scrollBy({
        left : -500,
        behavior : "smooth"
    });
});

rightBtn.addEventListener('click', () => {
    productContainer.scrollBy({
        left : 500,
        behavior : "smooth"
    });
});
