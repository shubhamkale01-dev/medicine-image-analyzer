const axios = require('axios');

async function testBackend() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('Testing backend endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✅ Health:', health.data);
    
    // Test search endpoint
    console.log('\n2. Testing search endpoint...');
    const search = await axios.get(`${baseURL}/search/paracetamol`);
    console.log('✅ Search:', search.data);
    
    // Test test endpoint
    console.log('\n3. Testing test endpoint...');
    const test = await axios.get(`${baseURL}/test/aspirin`);
    console.log('✅ Test:', test.data);
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testBackend();