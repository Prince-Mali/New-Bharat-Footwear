module.exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'You must be logged in to view this page.');
        res.redirect('/login');
    }
};

module.exports.isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    } else {
        req.flash('error', 'you do not have permission to access this page.');
        res.redirect('/');
    }
};