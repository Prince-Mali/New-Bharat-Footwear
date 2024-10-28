const express = require('express');
const router = express.Router();
const Wishlist = require('../model/wishlist');
const { isLoggedIn } = require('../middleware');
const Cart = require('../model/cart');

router.post('/wishlist/add/:productId', isLoggedIn, async(req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    let redirectUrl = req.session.redirectURl;
    redirectUrl = redirectUrl.split('/').slice(3).join('/');
    console.log(redirectUrl);

    let wishlist = await Wishlist.findOne({userId});
    if(!wishlist) {
        wishlist = new Wishlist({ userId });
    }

    let existingProductIndex = wishlist.products.findIndex(product => product.productId.equals(productId));

    if(existingProductIndex >= 0) {
        req.flash('error', 'Product is already wishlisted!');
        res.redirect(`/${redirectUrl}`);
    } else {
        wishlist.products.push({ productId });
        await wishlist.save();

        req.flash('success', 'product is added to wishlist!');
        res.redirect(`/${redirectUrl}`);
    };
});

router.get('/wishlist', isLoggedIn, async(req, res) => {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');
    res.render('pages/indexPage/wishlist', { wishlist });
});

router.get('/wishlist/remove/:productId', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    let redirectUrl = req.session.redirectURl;
    redirectUrl = redirectUrl.split('/').slice(3).join('/');
    console.log(redirectUrl);

    let wishlist = await Wishlist.findOne({ userId });
    wishlist.products = wishlist.products.filter(product => !product.productId.equals(productId));
    await wishlist.save();

    req.flash('success', 'Product removed from wishlist');
    res.redirect(`/${redirectUrl}`);
});


module.exports = router;