const express = require('express');
const router = express.Router();
const { payuClient } = require('../payuConfig');
const { isLoggedIn } = require('../middleware');
const Order = require('../model/order');
const User = require('../model/user');
const Cart = require('../model/cart');

router.get('/pay', isLoggedIn, async (req, res) => {
    req.session.userId = req.user._id;

    req.session.save(async(err) => {
        if(err) {
            console.error("Error saving session:", err);
            req.flash("error", "Session error. Please try again.");
            return res.redirect('/checkout');
        }
        console.log("Session saved with userId:", req.session.userId);

        const { txnId } = req.query;
        const order = await Order.findOne({txnId});

        if(!order) {
            req.flash('error', 'Order not found');
            return res.redirect('/checkout');
        } else {
            // Handle PayU Payment
            const paymentData = {
                txnid : txnId,
                amount: order.totalPrice,
                productinfo: "Footwear",
                firstname: order.address.name,
                email: order.address.email,
                // address1 : order.userId,
                phone: order.address.contact,
                surl: 'https://new-bharat-footwear.onrender.com/success',
                furl: "https://new-bharat-footwear.onrender.com/failure"
            };

            try {
                const response = payuClient.paymentInitiate(paymentData);
                return res.send(response); // Send auto-submit form for PayU payment
            } catch (error) {
                console.error("Error initiating payment:", error);
                req.flash("error", "Error initiating payment. Please try again.");
                return res.redirect('/checkout');
            }
        }
    });
});

router.post("/success", async(req, res, next) => {
    try {
        await handleSession(req, res);
        
        const {txnid, status, mode} = req.body;
        // Handle success response, verify transaction, update order status
        if(status === 'success') {
            const order = await Order.findOne({txnId : txnid});
            if(order) {
                order.paymentStatus = 'Paid';
                order.paymentMode = mode;
        
                await order.save();
                await Cart.findOneAndDelete({userId : order.userId});
                req.flash('success', 'Payment successful. Order placed!');
                res.redirect('/cart');
            } else {
                req.flash('error', 'Order not found');
                res.redirect('/checkout');
            }
        } else {
            req.flash('error', 'Payment failed');
            res.redirect('/checkout');
        }
    } catch (error) {
        console.error('Error processing payment success:', error);
        req.flash('error', 'An error occurred while processing payment');
        res.redirect('/cart');
    }
});

router.post("/failure", async(req, res) => {
    await handleSession(req, res);

    const { txnid } = req.body;
    const order = await Order.findOne({ txnId : txnid });

    if(order) {
        order.paymentStatus = 'Failed';
        await order.save();
        req.flash('error', 'Payment failed');
        res.redirect('/checkout');
    }
});

async function handleSession(req, res) {
    const { txnid } = req.body;
    const order = await Order.findOne({txnId : txnid});
    if(order) {
        req.session.userId = order.userId;
    }
    console.log('session user id : ', req.session.userId);

    if(!req.user && req.session.userId) {
        const user = await User.findById(req.session.userId);
        if(user) {
            req.login(user, (err) => {
                if(err) { return next(err); }
                req.session.save(() => {
                    console.log("User successfully logged back in");
                });
            })
        } else {
            console.log('No user found with session userId');
        }
    } else {
        console.log('user is already logged in');
    }
};

module.exports = router;