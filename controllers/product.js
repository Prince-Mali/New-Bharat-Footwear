const Product = require('../model/product');
const Cart = require('../model/cart');
const Wishlist = require('../model/wishlist');
const Review = require('../model/review');

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

module.exports.getProductDetail = async (req, res, next) => {
    try {
        let { productId } = req.params;
        const userId = req.user ? req.user._id : null; 
    
        let product = await Product.findById(productId);
        let productReviews = await Review.find({productId}).populate('userId');
    
        // check isincart product ---
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        await cart.save();
        const isInCart = cart.items.find(item => item.product == productId);
    
        // check isinwishlist product ---
        let wishlist = await Wishlist.findOne({ userId });
        if(!wishlist) {
            wishlist = new Wishlist({ userId });
        }
        await wishlist.save();
        const isInWishlist = await wishlist.products.find(product => product.productId == productId);
    
        // rendering product detail ---
        res.render('pages/indexPage/product', { product, isInCart, isInWishlist, productReviews });
    } catch (error) {
        console.error('Error fetching product details:', error);
        req.flash('error', 'Unable to retrieve product details');
        res.redirect('/');
    }
};