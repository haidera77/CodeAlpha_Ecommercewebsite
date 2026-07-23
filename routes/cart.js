const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// View Cart
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  
  res.render('cart', { 
    cart, 
    subtotal, 
    shipping, 
    tax, 
    total,
    title: 'Shopping Cart'
  });
});

// Add to Cart
router.post('/add/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    
    if (product.stock === 0) {
      req.flash('error', 'Product is out of stock');
      return res.redirect('/products/' + product._id);
    }
    
    req.session.cart = req.session.cart || [];
    
    const existingItem = req.session.cart.find(item => item.productId === product._id.toString());
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
      } else {
        req.flash('error', 'Maximum stock reached');
        return res.redirect('/cart');
      }
    } else {
      req.session.cart.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        stock: product.stock
      });
    }
    
    req.flash('success', `${product.name} added to cart`);
    res.redirect('/products/' + product._id);
  } catch (error) {
    req.flash('error', 'Error adding to cart');
    res.redirect('/products');
  }
});

// Update Cart
router.post('/update', (req, res) => {
  const { productId, quantity } = req.body;
  
  req.session.cart = req.session.cart.map(item => {
    if (item.productId === productId) {
      item.quantity = Math.max(1, Math.min(parseInt(quantity), item.stock));
    }
    return item;
  });
  
  res.redirect('/cart');
});

// Remove from Cart
router.post('/remove/:productId', (req, res) => {
  req.session.cart = req.session.cart.filter(item => item.productId !== req.params.productId);
  req.flash('success', 'Item removed from cart');
  res.redirect('/cart');
});

// Clear Cart
router.post('/clear', (req, res) => {
  req.session.cart = [];
  req.flash('success', 'Cart cleared');
  res.redirect('/cart');
});

module.exports = router;