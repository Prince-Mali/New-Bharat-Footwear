const User = require('../model/user');
const Order = require('../model/order');

module.exports.profile = async (req, res) => {
    let { userId } = req.params;
    let user = await User.findById(userId);
    res.render('pages/userPage/profile', { user });
};

module.exports.profileUpdateForm = async (req, res) => {
    let { userId } = req.params;
    let user = await User.findById(userId);
    res.render('pages/userPage/update', { user });
};

module.exports.profileUpdate = async (req, res) => {
    let { userId } = req.params;
    let { name, email, contact, address } = req.body;
    let query = {name, email, contact, address };
    if(req.file) {
        query.image = req.file.path;
    }

    await User.findByIdAndUpdate(userId, query);
    res.redirect(`/profile/${userId}`);
};

module.exports.account = (req, res) => {
    res.render('pages/userPage/partialPages/acount-main', { user : req.user});
};

module.exports.orders = async(req, res) => {
    let userId = req.user._id;
    let orderList = await Order.find({userId : userId}).populate('items.product');
    res.render('pages/userPage/partialPages/orders', {user : req.user, orderList });
};
