require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testAPIResponse() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  const products = await Product.find();
  console.log(`\n📦 Found ${products.length} products in database`);
  
  // Simulate API response structure
  const apiResponse = {
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

  console.log('\n🔍 API Response Structure:');
  console.log(`- Total products: ${apiResponse.products.length}`);
  console.log(`- Categories: ${[...new Set(apiResponse.products.map(p => p.category))].join(', ')}`);
  
  console.log('\n📋 Sample products:');
  apiResponse.products.slice(0, 3).forEach((p, i) => {
    console.log(`${i+1}. ${p.name} (${p.category}) - Rs.${p.price} - Stock: ${p.stock}`);
  });

  process.exit(0);
}

testAPIResponse().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
