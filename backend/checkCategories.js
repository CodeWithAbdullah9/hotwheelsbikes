require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkCategories() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  const products = await Product.find();
  const categories = [...new Set(products.map(p => p.category))];
  
  console.log('\n📦 Categories in Database:');
  categories.forEach(cat => {
    const count = products.filter(p => p.category === cat).length;
    console.log(`- ${cat}: ${count} products`);
  });

  console.log('\n🔍 Sample products by category:');
  categories.forEach(cat => {
    const sample = products.find(p => p.category === cat);
    if (sample) {
      console.log(`\n${cat}:`);
      console.log(`  - ${sample.name}`);
      console.log(`  - Price: Rs.${sample.price}`);
      console.log(`  - Stock: ${sample.stock}`);
    }
  });

  process.exit(0);
}

checkCategories().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
