if(process.env.Node_ENV  != 'production') {
    require('dotenv').config();
};
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const productRoute = require('./routes/product');

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


// Products routes ----
app.use('/', productRoute);

// cart page --
app.get('/cart', (req, res) => {
    res.render('pages/cart');
});

// server listening on port 8080 ---
app.listen(8080);
