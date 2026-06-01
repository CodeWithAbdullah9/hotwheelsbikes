const fs = require('fs');
const path = require('path');

// Create sample product images
const sampleImages = [
  {
    name: 'hot-wheels-bone-shaker.png',
    url: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/Rectangle-1-1.png'
  },
  {
    name: 'hot-wheels-twin-mill.png',
    url: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/Rectangle-2-1.png'
  },
  {
    name: 'mountain-bike.png',
    url: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/mountain-bike.png'
  },
  {
    name: 'helmet.png',
    url: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/helmet.png'
  },
  {
    name: 'shimano-xt.png',
    url: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/shimano-xt.png'
  }
];

async function setupImages() {
  console.log('🖼️ Setting up product images...');
  
  // Create uploads/products directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'uploads', 'products');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads/products directory');
  }

  // Download sample images
  for (const image of sampleImages) {
    try {
      const response = await fetch(image.url);
      const buffer = await response.arrayBuffer();
      const imagePath = path.join(uploadsDir, image.name);
      
      fs.writeFileSync(imagePath, Buffer.from(buffer));
      console.log(`✅ Downloaded: ${image.name}`);
    } catch (error) {
      console.log(`❌ Failed to download ${image.name}:`, error.message);
    }
  }

  console.log('🎯 Image setup complete!');
  console.log('📁 Images saved to:', uploadsDir);
}

setupImages().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
