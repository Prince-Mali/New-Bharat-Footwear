const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const profileController = require('../controllers/profile');
const Order = require('../model/order');

// profile route --
router.get('/profile/:userId', isLoggedIn, profileController.profile);

// userupdate route ---
router.get('/profile/:userId/update', isLoggedIn, profileController.profileUpdateForm);

router.post('/profile/:userId', isLoggedIn, profileController.profileUpdate);

router.get('/account-main', (req, res) => {
    res.render('pages/userPage/partialPages/acount-main', { user : req.user});
});

router.get('/orders', async(req, res) => {
    let userId = req.user._id;
    let orderList = await Order.find({userId : userId});
    res.render('pages/userPage/partialPages/orders', {user : req.user, orderList });
});

router.get('/wishlist', (req, res) => {
    res.render('pages/userPage/partialPages/wishlist', { user : req.user });
});

router.get('/addresses', (req, res) => {
    res.render('pages/userPage/partialPages/address', { user : req.user});
});

module.exports = router;
