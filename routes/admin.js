const express = require('express');
const router = express.Router();
const { isAdmin, isLoggedIn } = require('../middleware');
const adminControllers = require('../controllers/admin');
const Product = require('../model/product');
const User = require('../model/user');
const multer = require('multer');
const { storage } = require('../CloudConfig');
const upload = multer({storage});

// Admin routes --
router.get('/admin', isLoggedIn, isAdmin, adminControllers.adminDashboard);

router.get('/dashboard', isLoggedIn, isAdmin, adminControllers.dashboard);

router.get('/product-list', isLoggedIn, isAdmin, adminControllers.productList);

router.get('/add-product', isLoggedIn, isAdmin, adminControllers.newProductForm);

router.post('/add-product', isLoggedIn, isAdmin, upload.single('imageUrl'), adminControllers.newProduct);

router.delete('/product/:id', isLoggedIn, isAdmin, adminControllers.deleteProduct);

router.get('/category-list', isLoggedIn, isAdmin, adminControllers.categoryList);

router.get('/order-list', isLoggedIn, isAdmin, adminControllers.orderList);

router.get('/all-user', isLoggedIn, isAdmin, adminControllers.allUserList);

router.get('/report', isLoggedIn, isAdmin, adminControllers.report);

module.exports = router;