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
        for(item of cart.items) {
            let product = await Product.findById(item.product);
            if(product.quantity === 0) {
                req.flash('error', 'Product is out of stock');
                return res.redirect('/cart');
            }
        };

        res.render('pages/indexPage/checkout', { cart });
    } else {
        req.flash('error', 'Your cart is empty');
        res.redirect('/cart');
    }
});

router.post('/checkout', isLoggedIn, async(req, res) => {
    let userId = req.user._id;
    let { name, contact, street, city, state, pincode, paymentMode } = req.body;

    let cart = await Cart.findOne({userId : userId});
    if(!cart || cart.items.length === 0) {
        req.flash('error', 'your cart is empty!');
        res.redirect('/cart');
    } else {
        const txnId = `txn_${Date.now()}`; // Generate unique transaction ID
        await createOrder(userId, name, contact, street, city, state, pincode, cart, paymentMode, txnId);

        if(paymentMode === 'COD') {
            req.flash('success', 'Your order has been placed successfully!');
            res.redirect('/cart');
        } else {
            // Redirect to the payment initiation route
            return res.redirect(`/pay?txnId=${txnId}`);
        }
    }
});

async function createOrder(userId, name, contact, street, city, state, pincode, cart, paymentMode, txnId) {
    const order = new Order({
        txnId,
        userId : userId,
        items : cart.items.map(item => ({
            product : item.product, // adding product ref id
            quantity : item.quantity,
            price : item.price
        })),
        totalQuantity : cart.totalQuantity,
        totalPrice : cart.totalPrice,
        address : {
            name, contact, street, city, state, pincode
        },
        // paymentStatus : 'Pending', 
        paymentMode : paymentMode
    });
    cart.items.forEach(async item => {
        let product = await Product.findById(item.product);
        product.quantity -= item.quantity;
        product.save();
    });
    await order.save();
    if(paymentMode === 'COD') {
        await Cart.findOneAndDelete({userId});
    }
};

module.exports = router;