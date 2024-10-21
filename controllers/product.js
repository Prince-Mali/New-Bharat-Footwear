const Product = require('../model/product');
const Cart = require('../model/cart');

module.exports.homePage = async (req, res) => {
    let productlist = await Product.find();
    res.render('pages/indexPage/home', { productlist });
};

module.exports.mensFootwear = async (req, res) => {
    let productList = await Product.find({category : 'Men'});
    res.render("pages/indexPage/men", { productList });
};

module.exports.womenFootwear = async (req, res) => {
    let productList = await Product.find({category : 'Women'});
    res.render("pages/indexPage/women", { productList });
};

module.exports.kidsFootwear = async (req, res) => {
    let productList = await Product.find({category : 'Kids'});
    res.render("pages/indexPage/kids", { productList });
};

module.exports.getFilteredProducts = async (req, res) => {
    let { viewPath } = req.params;
    const { color, size, minPrice, maxPrice, category } = req.query;
    let query = {category};

    if (color) { query.color = color };
    if (size) { query.size = size };
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) { query.price.$gte = minPrice};
        if (maxPrice) { query.price.$lte = maxPrice};
    };

    try {
        const productList = await Product.find(query);
        res.render(`pages/indexPage/${viewPath}`, { productList });
    }catch (err) {
        console.log(err);
    }
};

module.exports.getProductDetail = async (req, res) => {
    let { productId } = req.params;
    let userId = req.user._id;

    let product = await Product.findById(productId);
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }
    await cart.save();

    const isInCart = cart.items.find(item => item.product == productId);
    // console.log(isInCart);
    res.render('pages/indexPage/product', { product, isInCart });
};