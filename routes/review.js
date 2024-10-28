const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const Review = require('../model/review');
const { isLoggedIn } = require('../middleware');
const Order = require('../model/order');

router.get('/review/:productId', async(req, res) => {
    let { productId } = req.params;
    let product = await Product.findById(productId);
    res.render('pages/indexPage/review', { product });
});

router.post('/review/:productId/add', isLoggedIn, async (req, res) => {
    let { productId } = req.params;
    let { rating, comment } = req.body;
    let userId = req.user._id;

    // Check if the product was delivered
    const order = await Order.findOne({ userId, 'items.product': productId, orderStatus: 'Delivered' });

    if (!order) {
        req.flash('error', 'You can only review products that you have purchased and were delivered successfully.');
        return res.redirect(`/products/${productId}`);
    }

    let review = await Review.findOne({userId, productId});

    if(!review) {
        review = new Review({ productId, userId, rating, comment });
        await review.save();
        req.flash('success', 'Review added successfully!');
    }else {
        req.flash('error', 'Product review is added already!');
    }

    res.redirect(`/profile/${userId}`);
});


module.exports = router;