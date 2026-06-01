import axios from 'axios';

// Test the API directly from frontend
const testAPI = async () => {
  console.log('🔄 Testing API from frontend...');
  
  try {
    const response = await axios.get('/api/products');
    console.log('✅ API Response:', response.data);
    console.log('📦 Products received:', response.data.products?.length || 0);
    
    if (response.data.products && response.data.products.length > 0) {
      console.log('🔍 Sample products:');
      response.data.products.slice(0, 3).forEach((p, i) => {
        console.log(`${i+1}. ${p.name} (${p.category}) - Rs.${p.price}`);
      });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('Error details:', error.response?.data || error.message);
  }
};

testAPI();
