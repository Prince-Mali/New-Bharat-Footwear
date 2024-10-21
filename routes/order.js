const express = require('express');
const router = express.Router();
const Order = require('../model/order');
const Cart = require('../model/cart');
const Product = require('../model/product');
const { isLoggedIn } = require('../middleware');

router.get('/checkout', isLoggedIn, async(req, res) => {
    let userId = req.user._id;
    let cart = await Cart.findOne({ userId : userId });

    if(cart && cart.items.length) {
        cart.items.forEach(async item => {
            let product = await Product.findById(item.product);
            if(product.quantity === 0) {
                req.flash('error', 'Product is out of stock');
                res.redirect('/cart');
            } else {
                res.render('pages/indexPage/checkout', { cart });
            }
        });
    } else {
        req.flash('error', 'Your cart is empty');
        res.redirect('/cart');
    }
});

router.post('/checkout', isLoggedIn, async(req, res) => {
    let userId = req.user._id;
    let { name, contact, street, city, state, pincode, paymentMethod } = req.body;

    let cart = await Cart.findOne({userId : userId});
    if(!cart || cart.items.length === 0) {
        req.flash('error', 'your cart is empty!');
        res.redirect('/cart');
    } else {
        const order = new Order({
            userId : userId,
            items : cart.items.map(item => ({
                product : item.product, // adding product ref id
                quantity : item.quantity,
                price : item.price
            })),
            totalQuantity : cart.totalQuantity,
            totalPrice : cart.totalPrice,
            address :  {
                name, contact, street, city, state, pincode
            },
            paymentMethod : paymentMethod,
        });

        cart.items.forEach(async item => {
            let product = await Product.findById(item.product);
            product.quantity -= item.quantity;
            product.save();
        });
        await order.save();
        await Cart.findOneAndDelete({userId : userId });
        req.flash('success', 'Your order has been placed successfully!');
        res.redirect('/cart');
    }
});

module.exports = router;
