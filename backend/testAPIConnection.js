const axios = require('axios');

async function testAPIConnection() {
  try {
    console.log('🔄 Testing API connection...');
    const response = await axios.get('http://localhost:5001/api/products');
    console.log('✅ API Response successful');
    console.log('📦 Products count:', response.data.products?.length || 0);
    console.log('🔍 Sample product:', response.data.products?.[0]?.name || 'No products');
  } catch (error) {
    console.error('❌ API Connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('🔧 Backend server is not running on port 5001');
    } else if (error.response) {
      console.log('🔧 Server responded with error:', error.response.status);
      console.log('📋 Error data:', error.response.data);
    }
  }
}

testAPIConnection();
