const User = require('../model/user');

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
    let { name, email, contact, image, address } = req.body;
    let query = {};
    if(name){ query.name = name};
    if(email) { query.email = email};
    if(contact) {query.contact = contact};
    if(image) { query.image = image};
    if(address){query.address = address};

    let updatedUser = await User.findByIdAndUpdate(userId, query);
    res.redirect(`/profile/${userId}`);
};

