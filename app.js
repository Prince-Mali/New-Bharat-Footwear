if(process.env.Node_ENV  != 'production') {
    require('dotenv').config();
};
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const User = require('./model/user');
const Visitor = require('./model/visitor');
const productRoute = require('./routes/product');
const userRoute = require('./routes/user');
const profileRoute = require('./routes/profile');
const adminRoute = require('./routes/admin');
const cartRoute = require('./routes/cart');
const wishlistRoute = require('./routes/wishlist');
const orderRoute = require('./routes/order');
const paymentRoute = require('./routes/payment');
const reviewRoute = require('./routes/review');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const crypto = require('crypto');

// Database connection ---
main().then((res) => {
    console.log('connection successful!')
}).catch((err) => {console.log(err)});

async function main() {
    await mongoose.connect(`${process.env.DB_URL}`);
};

// middelwares
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(methodOverride('_method')); // method-override


// Setting up EJS views and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejsMate);

app.use(cookieParser()); // cookie-parser

// session --
let store = MongoStore.create({
    mongoUrl : 'mongodb://127.0.0.1:27017/bharatFootwear',
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on('error', (err) => {
    console.log('Error in Mongo Session Url', err);
});

let sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized: false,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
        secure: false,
        sameSite : 'Lax'
    }
}

app.use(session(sessionOptions)); // express-session

// Authentication and Authorization using passport ---
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash massage --
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// visitor count middleware ----
app.use(async(req, res, next) => {
    if(!req.session.isNewVisitor) {
        req.session.isNewVisitor = true;

        let visitorRecord = await Visitor.findOne();
        if(!visitorRecord) {
            visitorRecord = new Visitor({visitorCount : 1 });
        } else {
            visitorRecord.visitorCount += 1;
        }
        await visitorRecord.save();
    }
    next();
});

// Products routes ----
app.use('/', productRoute);

// User routes ---
app.use('/', userRoute);

// user profile routes --
app.use('/', profileRoute);

// Admin routes ---
app.use('/', adminRoute);

// Cart routes --
app.use('/', cartRoute);

// Wishlist routes --
app.use('/', wishlistRoute);

// order routes --
app.use('/', orderRoute);

// payment routes --
app.use('/', paymentRoute);

// review routes --
app.use('/', reviewRoute);

// Error handler ---
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!');
});

// server listening on port 8080 ---
app.listen(8080);