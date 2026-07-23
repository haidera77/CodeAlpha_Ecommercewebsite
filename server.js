require('dotenv').config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const path = require('path');

const Product = require('./models/Product');

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.use(flash());

// Global variables
app.use((req, res, next) => {

  res.locals.currentUser = req.session.userId ? {
    id: req.session.userId,
    name: req.session.userName,
    role: req.session.role
  } : null;

  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');

  res.locals.cartCount = (req.session.cart || [])
    .reduce((sum, item) => sum + item.quantity, 0);

  // Navbar search ke liye
  res.locals.search = "";

  next();
});


// Routes
app.use('/', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));


// Home Page
app.get('/', async (req, res) => {
  try {

    const featuredProducts = await Product.find({ featured: true }).limit(8);

    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);

    const categories = await Product.distinct('category');

    res.render('index', {
      featuredProducts,
      newProducts,
      categories,
      title: 'Home - CartVerse'
    });

  } catch (error) {

    res.render('index', {
      featuredProducts: [],
      newProducts: [],
      categories: [],
      title: 'Home - CartVerse'
    });

  }
});


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {

    console.log('✅ MongoDB Connected Successfully');

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });

  })
  .catch(err => {

    console.error('❌ MongoDB Connection Error:', err.message);

    process.exit(1);

  });