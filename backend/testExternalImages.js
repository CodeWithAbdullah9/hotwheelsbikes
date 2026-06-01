const axios = require('axios');

async function testExternalImages() {
  try {
    console.log('🔍 Testing external image URLs...');
    
    const testUrls = [
      'https://hotwheelsbikes.com/wp-content/uploads/2024/01/wheelset.png',
      'https://hotwheelsbikes.com/wp-content/uploads/2023/01/Rectangle-1-1.png',
      'https://hotwheelsbikes.com/wp-content/uploads/2023/01/Rectangle-2-1.png'
    ];
    
    for (const url of testUrls) {
      try {
        console.log('🔄 Testing:', url);
        const response = await axios.head(url, { timeout: 5000 });
        console.log('✅ Accessible:', response.status, response.headers['content-type']);
      } catch (error) {
        console.log('❌ Not accessible:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testExternalImages();
