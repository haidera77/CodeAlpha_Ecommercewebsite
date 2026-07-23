const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// All Products
router.get('/', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let filter = {};

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (search) {F
            filter.name = { $regex: search, $options: 'i' };
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price-low') sortOption = { price: 1 };
        if (sort === 'price-high') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const products = await Product.find(filter).sort(sortOption);
        const categories = await Product.distinct('category');

        res.render('products', {
            products,
            categories,
            title: 'All Products',
            currentCategory: category,
            search,
            sort
        });
    } catch (error) {
        req.flash('error', 'Error loading products');
        res.redirect('/');
    }
});

// Product Detail
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/products');
        }

        // Get related products
        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4);

        res.render('product-detail', { product, relatedProducts, title: product.name });
    } catch (error) {
        req.flash('error', 'Error loading product');
        res.redirect('/products');
    }
});

// Admin Routes
// Admin Dashboard
router.get('/admin', isLoggedIn, isAdmin, async (req, res) => {
    const Product = require('../models/Product');
    const User = require('../models/User');
    const Order = require('../models/Order');

    const [totalProducts, totalUsers, totalOrders, orders] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
        Order.find()
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);

    res.render('admin/dashboard', {
        products,
        stats: {
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue
        },
        title: 'Admin Dashboard'
    });
});
router.get('/admin/all', isLoggedIn, isAdmin, async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/products', { products, title: 'Admin - Products' });
});

router.get('/admin/new', isLoggedIn, isAdmin, (req, res) => {
    res.render('admin/product-form', { product: {}, title: 'Add Product' });
});

router.post('/admin', isLoggedIn, isAdmin, async (req, res) => {
    try {
        await Product.create(req.body);
        req.flash('success', 'Product added successfully');
        res.redirect('/products/admin/all');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/products/admin/new');
    }
});
// 🔍 Live Search API (YE ROUTE /:id SE PEHLE LIKHNA HAI)
router.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || query.length < 2) return res.json([]);

        const products = await Product.find({
            name: { $regex: query, $options: 'i' }
        }).select('name image price').limit(5);

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin/:id/edit', isLoggedIn, isAdmin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('admin/product-form', { product, title: 'Edit Product' });
});

router.post('/admin/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success', 'Product updated successfully');
        res.redirect('/products/admin/all');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/products/admin/all');
    }
});

router.post('/admin/:id/delete', isLoggedIn, isAdmin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted successfully');
    res.redirect('/products/admin/all');
});

module.exports = router;