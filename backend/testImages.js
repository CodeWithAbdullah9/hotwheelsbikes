const fs = require('fs');
const path = require('path');

function testImages() {
  console.log('🔍 Testing image serving...');
  
  const uploadsDir = path.join(__dirname, 'uploads', 'products');
  
  if (fs.existsSync(uploadsDir)) {
    console.log('✅ Uploads directory exists:', uploadsDir);
    
    const files = fs.readdirSync(uploadsDir);
    console.log('📁 Files in uploads:', files.length);
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`📄 ${file} (${stats.size} bytes)`);
    });
    
    if (files.length > 0) {
      console.log('\n🌐 Test URLs:');
      files.forEach(file => {
        console.log(`- http://localhost:5000/uploads/products/${file}`);
      });
    } else {
      console.log('❌ No files found in uploads directory');
    }
  } else {
    console.log('❌ Uploads directory does not exist');
  }
}

testImages();
