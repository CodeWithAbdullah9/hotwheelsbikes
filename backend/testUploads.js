const fs = require('fs');
const path = require('path');

function testUploads() {
  console.log('🔍 Testing uploads directory...');
  
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
      console.log(`- Local: http://localhost:5002/uploads/products/${files[0]}`);
      console.log(`- Should be accessible at: http://localhost:5002/uploads/products/`);
    } else {
      console.log('❌ No files found in uploads directory');
    }
  } else {
    console.log('❌ Uploads directory does not exist');
  }
}

testUploads();
