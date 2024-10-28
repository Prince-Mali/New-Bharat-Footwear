const Order = require('./model/order');
const Visitor = require('./model/visitor');

module.exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        req.session.redirectURl = req.get('Referer');
        // console.log(req.session.redirectURl);
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

module.exports.dashboardData = async(req, res, next) => {
    // total Sales ----
    let totalSalesResult = await Order.aggregate([
        {$match : {orderStatus : 'Delivered'}},
        {$unwind : '$items'},
        {$group : {_id : null, totalSales : {$sum : '$items.quantity'}}}
    ]);
    const totalSales = totalSalesResult[0]?.totalSales || 0;
    // total Income ----
    const totalIncomeResult = await Order.aggregate([
        { $match: { orderStatus: "Delivered" } },
        { $group: { _id: null, totalIncome: { $sum: "$totalPrice" } } }
    ]);
    const totalIncome = totalIncomeResult[0]?.totalIncome || 0;
    // total Orders ----
    let totalOrders = await Order.countDocuments({});
    // total Visitors ----
    let totalVisitors = await Visitor.findOne();

    req.dataMatrics = {
        totalSales, totalIncome, totalOrders, totalVisitors
    }
    next();
};