const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const profileController = require('../controllers/profile');
const multer = require('multer');
const { storage } = require('../CloudConfig');
const upload = multer({storage});

// profile route --
router.get('/profile/:userId', isLoggedIn, profileController.profile);

// userupdate route ---
router.get('/profile/:userId/update', isLoggedIn, profileController.profileUpdateForm);

router.post('/profile/:userId', isLoggedIn, upload.single('image'), profileController.profileUpdate);

router.get('/account-main', isLoggedIn, profileController.account);

router.get('/orders', isLoggedIn, profileController.orders);

module.exports = router;