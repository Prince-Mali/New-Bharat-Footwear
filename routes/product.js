const express = require('express');
const router = express.Router();
const productsController = require('../controllers/product');

// Home page ----
router.get('/', productsController.homePage);

// mens page ---
router.get("/men", productsController.mensFootwear);

// women page --
router.get("/women", productsController.womenFootwear);

// kids page --
router.get("/kids", productsController.kidsFootwear);

// Route for filtered products
router.get('/filtered/:viewPath', productsController.getFilteredProducts);

// product ---
router.get('/products/:productId', productsController.getProductDetail);

module.exports = router;