const Product = require('../model/product');
const User = require('../model/user');
const Visitor = require('../model/visitor');

module.exports.adminDashboard = async (req, res) => {
    let visitorRecord = await Visitor.findOne();
    let totalVisitors = visitorRecord ? visitorRecord.visitorCount : 0;
    res.render('pages/adminPage/admin', { totalVisitors } );
};

module.exports.dashboard = async (req, res) => {
    let totalVisitors = await Visitor.findOne();
    totalVisitors = totalVisitors.visitorCount;
    res.render('pages/adminPage/partialPages/dashboard', { totalVisitors });
};

module.exports.productList = async (req, res) => {
    let productList = await Product.find();
    res.render('pages/adminPage/partialPages/product-list', { productList });
};

module.exports.newProductForm = (req, res) => {
    res.render('pages/adminPage/partialPages/add-product');
};

module.exports.newProduct = async (req, res) => {
    let { title, price, description, category, categories, size, color, quantity } = req.body;
    let imageUrl = req.file.path;
    let product = {title, price, description, category, categories, size, color, quantity, imageUrl };
    let newProduct = new Product(product);
    newProduct.owner = req.user._id;
    
    await newProduct.save();
    console.log(newProduct);
    res.redirect('/admin');
};

module.exports.deleteProduct = async (req, res) => {
    let {id : productId } = req.params;
    await Product.findByIdAndDelete(productId);
    req.flash('success', 'Product deleted!');
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
