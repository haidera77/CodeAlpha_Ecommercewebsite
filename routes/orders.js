const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isLoggedIn } = require('../middleware/auth');

// Checkout Page
router.get('/checkout', isLoggedIn, (req, res) => {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    req.flash('error', 'Your cart is empty');
    return res.redirect('/cart');
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  
  res.render('checkout', { cart, subtotal, shipping, tax, total, title: 'Checkout' });
});

// Place Order
router.post('/place', isLoggedIn, async (req, res) => {
  try {
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
      req.flash('error', 'Your cart is empty');
      return res.redirect('/cart');
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    
    // Create order
    const order = await Order.create({
      user: req.session.userId,
      items: cart.map(item => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingAddress: req.body,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: req.body.paymentMethod || 'Cash on Delivery'
    });
    
    // Update stock
    for (const item of cart) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    
    // Clear cart
    req.session.cart = [];
    
    req.flash('success', `Order #${order._id.toString().slice(-8)} placed successfully!`);
    res.redirect('/orders');
  } catch (error) {
    req.flash('error', 'Error placing order: ' + error.message);
    res.redirect('/checkout');
  }
});

// My Orders
router.get('/', isLoggedIn, async (req, res) => {
  const orders = await Order.find({ user: req.session.userId })
    .sort({ orderDate: -1 })
    .populate('items.product');
  
  res.render('orders', { orders, title: 'My Orders' });
});

// Order Detail
router.get('/:id', isLoggedIn, async (req, res) => {
  const order = await Order.findOne({ 
    _id: req.params.id, 
    user: req.session.userId 
  }).populate('items.product');
  
  if (!order) {
    req.flash('error', 'Order not found');
    return res.redirect('/orders');
  }
  
  res.render('order-detail', { order, title: 'Order Details' });
});

module.exports = router;