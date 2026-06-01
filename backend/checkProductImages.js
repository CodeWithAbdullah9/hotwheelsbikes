require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkProductImages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  const products = await Product.find();
  console.log(`\n📦 Checking images for ${products.length} products...\n`);
  
  let validImages = 0;
  let invalidImages = 0;
  let missingImages = 0;
  
  products.forEach((product, index) => {
    console.log(`\n${index + 1}. ${product.name}`);
    console.log(`   Category: ${product.category}`);
    console.log(`   Image URL: ${product.image || 'MISSING'}`);
    
    if (!product.image) {
      missingImages++;
      console.log(`   ❌ No image URL`);
    } else {
      // Check if image URL is valid format
      if (product.image.startsWith('http') || product.image.startsWith('/')) {
        validImages++;
        console.log(`   ✅ Valid image URL format`);
      } else {
        invalidImages++;
        console.log(`   ❌ Invalid image URL format`);
      }
    }
  });

  console.log(`\n📊 Image Summary:`);
  console.log(`- Valid images: ${validImages}`);
  console.log(`- Invalid images: ${invalidImages}`);
  console.log(`- Missing images: ${missingImages}`);
  console.log(`- Total products: ${products.length}`);

  // Show sample products with images
  console.log(`\n🔍 Sample products with valid images:`);
  const productsWithImages = products.filter(p => p.image && (p.image.startsWith('http') || p.image.startsWith('/')));
  productsWithImages.slice(0, 5).forEach((p, i) => {
    console.log(`${i+1}. ${p.name}: ${p.image}`);
  });

  process.exit(0);
}

checkProductImages().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
