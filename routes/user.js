const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const User = require('../model/user');

// signup routes --
router.get('/signup', userController.signUpForm);
router.post('/signup', userController.signUp);

// login routes --
router.get('/login', userController.loginForm);
router.post('/login', passport.authenticate('local', {
    failureRedirect : '/login',
    failureFlash : true,
}), userController.logIn);

// logout route ---
router.get('/logout', userController.logOut);

module.exports = router;