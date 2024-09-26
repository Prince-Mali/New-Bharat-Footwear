if(process.env.Node_ENV  != 'production') {
    require('dotenv').config();
};
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Product = require('./model/product');



// Database connection ---
main().then((res) => {
    console.log('connection successful!')
}).catch((err) => {console.log(err)});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/bharatFootwear');
};

// middelwares
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

// Setting up EJS views and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejsMate);


// routes ----

// Home page ---
app.get('/', async (req, res) => {
    let productlist = await Product.find();
    res.render('pages/home', { productlist });
});

// mens page ---
app.get("/mens-footwear", async (req, res) => {
    let productList = await Product.find({category : 'Men'});
    res.render("pages/men", { productList });
});

// women page --
app.get("/womens-footwear", async (req, res) => {
    let productList = await Product.find({category : 'Women'});
    res.render("pages/women", { productList });
});

// kids page --
app.get("/kids-footwear", async (req, res) => {
    let productList = await Product.find({category : 'Kids'});
    res.render("pages/kids", { productList });
});

// cart page --
app.get('/cart', (req, res) => {
    res.render('pages/cart');
})

// server listening on port 8080 ---
app.listen(8080);
