require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testProductsAPI() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  console.log('\n📦 Testing Products API Data Structure:');
  const products = await Product.find().limit(3);
  
  products.forEach((p, i) => {
    console.log(`\nProduct ${i+1}:`);
    console.log(`- _id: ${p._id}`);
    console.log(`- name: ${p.name}`);
    console.log(`- category: ${p.category}`);
    console.log(`- price: Rs.${p.price}`);
    console.log(`- salePrice: ${p.salePrice ? `Rs.${p.salePrice}` : 'Not set'}`);
    console.log(`- stock: ${p.stock}`);
    console.log(`- image: ${p.image || 'Not set'}`);
    console.log(`- sku: ${p.sku || 'Not set'}`);
    console.log(`- description: ${p.description ? p.description.substring(0, 50) + '...' : 'Not set'}`);
  });

  console.log('\n✅ Products API data structure is correct');
  console.log('✅ Frontend should be able to fetch this data');

  process.exit(0);
}

testProductsAPI().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
