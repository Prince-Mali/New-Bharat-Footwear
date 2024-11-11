const Cart = require('../model/cart');
const Product = require('../model/product');


module.exports.cart = async(req, res) => {
    try {
        let userId = req.user._id;
        let cart = await Cart.findOne({userId : userId}).populate('items.product');
        res.render('pages/indexPage/cart', { cart });
    } catch (error) {
        return next(error);
    }
};

module.exports.addToCart = async(req, res) => {
    try {
        let { productId } = req.params;
        let userId = req.user._id;
    
        let product = await Product.findById(productId);
    
        if(product.quantity === 0) {
            req.flash('error', 'product is out of Stock');
        } else {
            let cart = await Cart.findOne({userId : userId});
            if(!cart) {
                cart = new Cart({
                    userId : userId,
                    items : [],
                    totalQuantity : 0,
                    totalPrice : 0 
                });
            };
            const existingItemIndex = cart.items.findIndex(item => item.product.equals(productId));
        
            if(existingItemIndex >= 0) {
                cart.items[existingItemIndex].quantity += 1;
                cart.items[existingItemIndex].price += product.price;
            } else {
                cart.items.push({
                    product : product._id,
                    quantity : 1,
                    price : product.price
                });
            };
        
            cart.totalQuantity += 1;
            cart.totalPrice += product.price;
        
            await cart.save();
            req.flash('success', 'Product added to cart!');
        }
        res.redirect(`/products/${productId}`);

    } catch (error) {
        req.flash('error', 'Product is not found!');
        res.redirect('/');
    };
};

module.exports.removeFromCart = async(req, res) => {
    let { productId } = req.params;
    let userId = req.user._id;

    let cart = await Cart.findOne({ userId : userId });

    if(cart) {
        const ItemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if(ItemIndex >= 0) {
            // updating total quantity and price --
            cart.totalQuantity -= cart.items[ItemIndex].quantity;
            cart.totalPrice -= cart.items[ItemIndex].price;
            
            cart.items.splice(ItemIndex, 1);
            await cart.save();
            req.flash('success', 'Item removed from cart');
        } else {
            req.flash('error', 'Item not found in the cart');
        }
    } else {
        req.flash('error', 'cart is empty!');
    };

    res.redirect('/cart');
};

module.exports.updateCart = async(req, res) => {
    let { productId } = req.params;
    let { quantity } = req.body;
    let userId = req.user._id;

    let cart = await Cart.findOne({ userId : userId });
    let product = await Product.findById(productId);
    
    if(cart) {
        let itemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if(itemIndex >= 0) {
            let item = cart.items[itemIndex];
            let oldQuantity = item.quantity;
            let itemPrice = product.price;
            let diffQuantity = quantity - oldQuantity;

            // updating product total quantity and price ---
            item.quantity = quantity;
            item.price += diffQuantity * itemPrice;

            // updating cart total quantity and price ---
            cart.totalQuantity += diffQuantity;
            cart.totalPrice += diffQuantity * itemPrice;

            await cart.save();
            req.flash('success', 'Item quantity updated!');
        } else {
            req.flash('error', 'Item not found in the cart');
        }
    } else {
        req.flash('error', 'Item not found in the cart');
    }

    res.redirect('/cart');
};