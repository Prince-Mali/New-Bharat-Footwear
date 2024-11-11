const express = require('express');
const router = express.Router();
const { isAdmin, isLoggedIn, dashboardData } = require('../middleware');
const adminControllers = require('../controllers/admin');
const multer = require('multer');
const { storage } = require('../CloudConfig');
const upload = multer({storage});
const Order = require('../model/order');
const Product = require('../model/product');

// Admin routes --
router.get('/admin', isLoggedIn, isAdmin, dashboardData, adminControllers.adminDashboard);

router.get('/dashboard', isLoggedIn, isAdmin, dashboardData, adminControllers.dashboard);

router.get('/product-list', isLoggedIn, isAdmin, adminControllers.productList);

router.get('/add-product', isLoggedIn, isAdmin, adminControllers.newProductForm);

router.post('/add-product', isLoggedIn, isAdmin, upload.single('imageUrl'), adminControllers.newProduct);

router.get('/:productId/edit', isLoggedIn, isAdmin, async (req, res) => {
    let { productId } = req.params;
    let product = await Product.findById(productId);
    res.render('pages/adminPage/product-edit', { product });
});

router.post('/:productId/edit', isLoggedIn, isAdmin, upload.single('imageUrl'), async(req, res) => {
    let { price, size, quantity, discription } = req.body;
    let { productId } = req.params;

    await Product.findByIdAndUpdate(productId, {price, quantity, size, discription});
    req.flash('success', 'Product updated successful!');
    res.redirect('/admin');
});

router.delete('/product/:id', isLoggedIn, isAdmin, adminControllers.deleteProduct);

router.get('/order-list', isLoggedIn, isAdmin, adminControllers.orderList);

router.post('/admin/orders/:orderId/status', isLoggedIn, isAdmin, async(req, res) => {
    let { orderId } = req.params;
    let { orderStatus } = req.body;

    await Order.findByIdAndUpdate(orderId,{orderStatus});
    req.flash('success', 'Order status updated!');
    res.redirect('/admin');
});

router.get('/admin/orders/:orderId/details', isLoggedIn, isAdmin, async(req, res) => {
    let { orderId } = req.params;

    let order = await Order.findById(orderId).populate('items.product').populate('userId');

    // console.log(order);
    res.render('pages/adminPage/order-detail', { order });
});

router.get('/all-user', isLoggedIn, isAdmin, adminControllers.allUserList);

module.exports = router;