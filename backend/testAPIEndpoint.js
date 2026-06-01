require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const Product = require('./models/Product');
const cors = require('cors');

async function testAPIEndpoint() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Test the exact API endpoint
  app.get('/api/products', async (req, res) => {
    try {
      console.log('📡 API request received');
      const products = await Product.find();
      console.log(`📦 Found ${products.length} products`);
      
      const response = {
        products: products.map(p => ({
          _id: p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          salePrice: p.salePrice,
          stock: p.stock,
          image: p.image,
          sku: p.sku,
          description: p.description
        }))
      };
      
      console.log('✅ Sending response with', response.products.length, 'products');
      res.json(response);
    } catch (error) {
      console.error('❌ API Error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  const server = app.listen(5002, () => {
    console.log('🚀 Test API server running on http://localhost:5002');
  });

  // Test the API
  setTimeout(async () => {
    try {
      const response = await fetch('http://localhost:5002/api/products');
      const data = await response.json();
      console.log('🔍 Test API Response:', data);
      console.log('📊 Products count:', data.products?.length || 0);
    } catch (error) {
      console.error('❌ Test API Error:', error);
    }
    server.close();
    process.exit(0);
  }, 1000);
}

testAPIEndpoint().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
