require('dotenv').config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  // ELECTRONICS
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    category: 'Electronics',
    stock: 25,
    rating: 4.8,
    reviews: 342,
    featured: true
  },
  {
    name: 'Smart Watch',
    description: 'Advanced fitness tracker with heart rate monitor and GPS.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 18,
    rating: 4.7,
    reviews: 521,
    featured: true
  },
  {
    name: 'DSLR Camera',
    description: '24.2MP camera with 4K video recording.',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 12,
    rating: 4.9,
    reviews: 189,
    featured: true
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 45,
    rating: 4.5,
    reviews: 678,
    featured: false
  },
  {
    name: 'Gaming Mouse',
    description: 'High-precision gaming mouse with RGB lighting.',
    price: 69.99,
    image:  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
    category: 'Electronics',
    stock: 35,
    rating: 4.6,
    reviews: 445,
    featured: false
  },

  // FASHION
  {
    name: 'Leather Jacket',
    description: 'Genuine leather jacket with modern fit.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion',
    stock: 20,
    rating: 4.6,
    reviews: 234,
    featured: true
  },
  {
    name: 'Designer Sunglasses',
    description: 'UV400 protection polarized sunglasses.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion',
    stock: 35,
    rating: 4.4,
    reviews: 412,
    featured: false
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioning.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion',
    stock: 50,
    rating: 4.7,
    reviews: 892,
    featured: true
  },
  {
    name: 'Luxury Watch',
    description: 'Elegant stainless steel watch.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion',
    stock: 15,
    rating: 4.8,
    reviews: 156,
    featured: true
  },
  {
    name: 'Travel Backpack',
    description: '40L waterproof travel backpack.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    category: 'Fashion',
    stock: 42,
    rating: 4.5,
    reviews: 734,
    featured: false
  },

  // HOME & KITCHEN
  {
    name: 'Coffee Maker',
    description: 'Programmable 12-cup coffee maker.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    category: 'Home & Kitchen',
    stock: 30,
    rating: 4.5,
    reviews: 567,
    featured: false
  },
  {
    name: 'Table Lamp',
    description: 'Modern LED desk lamp.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    category: 'Home & Kitchen',
    stock: 60,
    rating: 4.3,
    reviews: 289,
    featured: false
  },
  {
    name: 'Cookware Set',
    description: '10-piece non-stick cookware set.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
    category: 'Home & Kitchen',
    stock: 22,
    rating: 4.6,
    reviews: 423,
    featured: true
  },

  // SPORTS
  {
    name: 'Yoga Mat',
    description: 'Extra-thick 6mm yoga mat.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    stock: 75,
    rating: 4.7,
    reviews: 1023,
    featured: false
  },
  {
    name: 'Dumbbell Set',
    description: '5-52.5 lb adjustable dumbbells.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600',
    category: 'Sports',
    stock: 10,
    rating: 4.9,
    reviews: 345,
    featured: true
  },

  // BOOKS
  {
    name: 'Novel Collection',
    description: 'Box set of 5 award-winning novels.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    category: 'Books',
    stock: 40,
    rating: 4.8,
    reviews: 678,
    featured: false
  },

  // BEAUTY
  {
    name: 'Skincare Set',
    description: 'Complete skincare routine.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    category: 'Beauty',
    stock: 28,
    rating: 4.6,
    reviews: 512,
    featured: true
  },

  // TOYS
  {
    name: 'Building Blocks',
    description: '500-piece creative building blocks.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80',
    category: 'Toys',
    stock: 55,
    rating: 4.7,
    reviews: 892,
    featured: false
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@shopeasy.com',
      password: 'admin123',
      role: 'admin'
    });
    
    await User.create({
      name: 'Test User',
      email: 'user@shopeasy.com',
      password: 'user123',
      role: 'user'
    });
    
    console.log('\n🎉 Seeding completed!');
    console.log('\n📧 Login:');
    console.log('   Admin: admin@shopeasy.com / admin123');
    console.log('   User:  user@shopeasy.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();