const axios = require('axios');

async function testApiProxy() {
  console.log('🧪 Testing hai-toolset API proxy after fix...\n');
  
  // Test 1: Direct backend connection
  try {
    console.log('1. Testing direct backend connection...');
    const backendResponse = await axios.get('http://localhost:8787/api/tool-categories', {
      timeout: 5000
    });
    console.log('✅ Backend direct connection successful');
    console.log('   Status:', backendResponse.status);
    console.log('   Data type:', typeof backendResponse.data);
    console.log('   Data preview:', JSON.stringify(backendResponse.data).substring(0, 100) + '...\n');
  } catch (error) {
    console.log('❌ Backend direct connection failed:', error.message);
    console.log('   This means hai-backend is not running on port 8787\n');
    return;
  }

  // Test 2: Next.js API route proxy
  try {
    console.log('2. Testing Next.js API route proxy...');
    const proxyResponse = await axios.get('http://localhost:3002/api/tool-categories', {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ API proxy connection successful');
    console.log('   Status:', proxyResponse.status);
    console.log('   Data type:', typeof proxyResponse.data);
    console.log('   Data preview:', JSON.stringify(proxyResponse.data).substring(0, 100) + '...\n');
    
    // Verify the data structure
    if (proxyResponse.data && typeof proxyResponse.data === 'object') {
      console.log('✅ Response data is properly formatted as JSON');
      
      if (Array.isArray(proxyResponse.data) || (proxyResponse.data.success && proxyResponse.data.data)) {
        console.log('✅ Response structure looks correct for categories API');
      } else {
        console.log('⚠️  Response structure might need adjustment');
      }
    } else {
      console.log('❌ Response data is not properly formatted');
    }
    
  } catch (error) {
    console.log('❌ API proxy connection failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Response:', error.response.data);
    }
    console.log('   This means the Next.js proxy is not working correctly\n');
  }

  // Test 3: Test POST request (if applicable)
  try {
    console.log('3. Testing POST request proxy...');
    const postResponse = await axios.post('http://localhost:3002/api/tools/search', {
      q: 'test',
      limit: 5
    }, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ POST request proxy successful');
    console.log('   Status:', postResponse.status);
    console.log('   Data type:', typeof postResponse.data);
  } catch (error) {
    console.log('⚠️  POST request test failed (this might be expected if endpoint doesn\'t exist)');
    console.log('   Error:', error.message);
  }
}

// Run the test
testApiProxy().catch(console.error);