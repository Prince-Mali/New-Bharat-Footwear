const Product = require('../model/product');
const User = require('../model/user');
const Order = require('../model/order');
const Cart = require('../model/cart');
const Wishlist = require('../model/wishlist');

module.exports.adminDashboard = async (req, res) => {
    const { totalSales, totalIncome, totalOrders, totalVisitors } = req.dataMatrics;
    res.render('pages/adminPage/admin', { totalSales, totalIncome, totalOrders, totalVisitors });
};

module.exports.dashboard = async (req, res) => {
    const { totalSales, totalIncome, totalOrders, totalVisitors } = req.dataMatrics;
    res.render('pages/adminPage/partialPages/dashboard', { totalSales, totalIncome, totalOrders, totalVisitors });
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
    // console.log(newProduct);
    res.redirect('/admin');
};

module.exports.deleteProduct = async (req, res) => {
    try {
        let {id : productId } = req.params;
        await Product.findByIdAndDelete(productId);
    
        // Update each wishlist and cart by removing the product and recalculating totalQuantity and totalPrice
        let carts = await Cart.find({'items.product' : productId});
         for (const cart of carts) {
            // Remove the product from the cart's items
            cart.items = cart.items.filter(item => !item.product.equals(productId));
    
            // Recalculate totalQuantity and totalPrice
            cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
            // Save the updated cart
            await cart.save();
        }
    
        let wishlists = await Wishlist.find({'products.productId' : productId});
        
        // Remove the product from each wishlist
        for (const wishlist of wishlists) {
            wishlist.products = wishlist.products.filter(product => !product.productId.equals(productId));
            await wishlist.save();
        }
    
        req.flash('success', 'Product deleted!');
        return res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting product and updating cart and wishlist');
        req.flash('error', 'Error deleting products. Plz try again!');
        res.redirect('/admin');
    }
};

module.exports.orderList = async(req, res) => {
    let orderList = await Order.find({});
    res.render('pages/adminPage/partialPages/order-list', { orderList });
};

module.exports.allUserList = async (req, res) => {
    let userList = await User.find();
    res.render('pages/adminPage/partialPages/all-user', { userList });
}