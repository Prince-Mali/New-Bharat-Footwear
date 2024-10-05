const User = require('../model/user');

module.exports.signUpForm = (req, res) => {
    res.render('pages/userPage/signup');
};

module.exports.signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({username, email});
        await User.register(newUser, password);
        req.flash('success', 'Successfully registered!');
        res.redirect('/login');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.loginForm = (req, res) => {
    res.render('pages/userPage/login');
};

module.exports.logIn = (req, res) => {
    req.flash('success', 'Logged in success!');
    res.redirect('/');
};

module.exports.logOut = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'You have logged out!');
        res.redirect('/');
    });
};
