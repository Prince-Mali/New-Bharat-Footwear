const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const cartController = require('../controllers/cart');

// cart page --
router.get('/cart', isLoggedIn, cartController.cart);

router.post('/cart/add/:productId', isLoggedIn, cartController.addToCart);

router.post('/cart/remove/:productId', isLoggedIn, cartController.removeFromCart); 

router.post('/cart/update/:productId', isLoggedIn, cartController.updateCart);

module.exports = router;