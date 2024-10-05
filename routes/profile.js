const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const profileController = require('../controllers/profile');

// profile route --
router.get('/profile/:userId', isLoggedIn, profileController.profile);

// userupdate route ---
router.get('/profile/:userId/update', isLoggedIn, profileController.profileUpdateForm);

router.post('/profile/:userId', isLoggedIn, profileController.profileUpdate);

router.get('/account-main', (req, res) => {
    res.render('pages/userPage/partialPages/acount-main', { user : req.user});
});

router.get('/orders', (req, res) => {
    res.render('pages/userPage/partialPages/orders', {user : req.user });
});

router.get('/wishlist', (req, res) => {
    res.render('pages/userPage/partialPages/wishlist', { user : req.user });
});

router.get('/addresses', (req, res) => {
    res.render('pages/userPage/partialPages/address', { user : req.user});
});

module.exports = router;
