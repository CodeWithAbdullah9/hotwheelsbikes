require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkExistingSKUs() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  const products = await Product.find().select('sku name');
  console.log('\n📦 Existing SKUs:');
  products.forEach(p => {
    if (p.sku) console.log(`- ${p.sku}: ${p.name}`);
  });

  process.exit(0);
}

checkExistingSKUs().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
