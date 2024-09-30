const express = require('express');
const Router = express.Router();
const productsController = require('../controllers/product');

// Home page ----
Router.get('/', productsController.homePage);

// mens page ---
Router.get("/men", productsController.mensFootwear);

// women page --
Router.get("/women", productsController.womenFootwear);

// kids page --
Router.get("/kids", productsController.kidsFootwear);

// Route for filtered products
Router.get('/filtered/:viewPath', productsController.getFilteredProducts);

// product ---
Router.get('/products/:productId', productsController.getProductDetail);

module.exports = Router;