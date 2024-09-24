if(process.env.Node_ENV  != 'production') {
    require('dotenv').config();
};
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');


main().then((res) => {
    console.log('connection successful!')
}).catch((err) => {console.log(err)});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/bharatFootwear');
}

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));

app.engine('ejs', ejsMate);


// Home page ---
app.get('/', (req, res) => {
    res.render('pages/home');
});

// mens page ---
app.get("/mens-footwear", (req, res) => {
    res.render("pages/men");
});

// women page --
app.get("/womens-footwear", (req, res) => {
    res.render("pages/women");
});

// kids page --
app.get("/kids-footwear", (req, res) => {
    res.render("pages/kids");
});

// cart page --
app.get('/cart', (req, res) => {
    res.render('pages/cart');
})

// server listening on port 8080 ---
app.listen(8080);
