require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testAllProducts() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  const products = await Product.find();
  console.log(`\n📦 Total products in database: ${products.length}`);
  
  console.log('\n🔍 Products by category:');
  const categories = {};
  products.forEach(p => {
    if (!categories[p.category]) {
      categories[p.category] = [];
    }
    categories[p.category].push(p);
  });

  Object.keys(categories).forEach(category => {
    console.log(`\n${category} (${categories[category].length} products):`);
    categories[category].slice(0, 3).forEach((p, i) => {
      console.log(`  ${i+1}. ${p.name} - Rs.${p.price} - Stock: ${p.stock}`);
    });
    if (categories[category].length > 3) {
      console.log(`  ... and ${categories[category].length - 3} more`);
    }
  });

  console.log('\n✅ All products verified in database');
  process.exit(0);
}

testAllProducts().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
