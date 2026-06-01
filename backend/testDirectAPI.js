require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testDirectAPI() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  const products = await Product.find();
  console.log(`\n📦 Found ${products.length} products in database`);
  
  // Check the exact structure needed for frontend
  const frontendProducts = products.map(p => ({
    _id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    salePrice: p.salePrice,
    stock: p.stock,
    image: p.image,
    sku: p.sku,
    description: p.description
  }));

  console.log('\n🔍 Frontend Product Structure:');
  frontendProducts.slice(0, 3).forEach((p, i) => {
    console.log(`\nProduct ${i+1}:`);
    console.log(`- _id: ${p._id}`);
    console.log(`- name: ${p.name}`);
    console.log(`- category: ${p.category}`);
    console.log(`- price: ${p.price}`);
    console.log(`- salePrice: ${p.salePrice}`);
    console.log(`- stock: ${p.stock}`);
    console.log(`- image: ${p.image}`);
    console.log(`- sku: ${p.sku}`);
    console.log(`- description: ${p.description ? p.description.substring(0, 50) + '...' : 'No description'}`);
  });

  console.log('\n✅ Frontend should receive this structure');
  console.log('📊 Total products for frontend:', frontendProducts.length);

  process.exit(0);
}

testDirectAPI().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
