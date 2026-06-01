require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testAPI() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  console.log('\n📦 Testing Products API Response:');
  const products = await Product.find();
  
  console.log(`Found ${products.length} products`);
  
  if (products.length > 0) {
    console.log('\nFirst product structure:');
    const p = products[0];
    console.log(`- _id: ${p._id}`);
    console.log(`- name: ${p.name}`);
    console.log(`- category: ${p.category}`);
    console.log(`- price: ${p.price}`);
    console.log(`- salePrice: ${p.salePrice}`);
    console.log(`- stock: ${p.stock}`);
    console.log(`- image: ${p.image}`);
    console.log(`- sku: ${p.sku}`);
    console.log(`- description: ${p.description ? p.description.substring(0, 50) + '...' : 'No description'}`);
    
    console.log('\n✅ API should return this structure:');
    console.log(JSON.stringify({
      products: [{
        _id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        salePrice: p.salePrice,
        stock: p.stock,
        image: p.image,
        sku: p.sku,
        description: p.description ? p.description.substring(0, 50) + '...' : 'No description'
      }]
    }, null, 2));
  } else {
    console.log('❌ No products found in database');
  }

  process.exit(0);
}

testAPI().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
