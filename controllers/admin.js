const Product = require('../model/product');
const User = require('../model/user');

module.exports.adminDashboard = (req, res) => {
    res.render('pages/adminPage/admin');
};

module.exports.dashboard = (req, res) => {
    res.render('pages/adminPage/partialPages/dashboard');
};

module.exports.productList = async (req, res) => {
    let productList = await Product.find();
    res.render('pages/adminPage/partialPages/product-list', { productList });
};

module.exports.newProductForm = (req, res) => {
    res.render('pages/adminPage/partialPages/add-product');
};

module.exports.newProduct = async (req, res) => {
    let { title, price, description, category, size, color } = req.body;
    let imageUrl = req.file.path;
    let product = {title, price, description, category, size, color, imageUrl };
    let newProduct = new Product(product);
    newProduct.owner = req.user._id;
    
    await newProduct.save();
    console.log(newProduct);
    res.redirect('/admin');
};

module.exports.categoryList = (req, res) => {
    res.render('pages/adminPage/partialPages/category-list');
};

module.exports.orderList = (req, res) => {
    res.render('pages/adminPage/partialPages/order-list');
};

module.exports.allUserList = async (req, res) => {
    let userList = await User.find();
    res.render('pages/adminPage/partialPages/all-user', { userList });
}

module.exports.report = (req, res) => {
    res.render('pages/adminPage/partialPages/report');
};
