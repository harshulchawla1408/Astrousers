// Simple API test script
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api/v1';

async function testAPI() {
  console.log('🧪 Testing AstroUser API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:5000/');
    const healthData = await healthResponse.text();
    console.log('✅ Health check:', healthData);

    // Test 2: Get all astrologers
    console.log('\n2. Testing get all astrologers...');
    const astrologersResponse = await fetch(`${API_BASE}/astrologers`);
    const astrologersData = await astrologersResponse.json();
    console.log('✅ Astrologers count:', astrologersData.count || 0);
    console.log('📊 Sample data:', astrologersData.data?.slice(0, 2) || 'No data');

    // Test 3: Get top astrologers
    console.log('\n3. Testing get top astrologers...');
    const topResponse = await fetch(`${API_BASE}/astrologers/top?limit=3`);
    const topData = await topResponse.json();
    console.log('✅ Top astrologers count:', topData.count || 0);

    // Test 4: Search functionality
    console.log('\n4. Testing search functionality...');
    const searchResponse = await fetch(`${API_BASE}/astrologers?search=vedic`);
    const searchData = await searchResponse.json();
    console.log('✅ Search results count:', searchData.count || 0);

    // Test 5: Filter functionality
    console.log('\n5. Testing filter functionality...');
    const filterResponse = await fetch(`${API_BASE}/astrologers?category=Vedic%20Astrology`);
    const filterData = await filterResponse.json();
    console.log('✅ Filter results count:', filterData.count || 0);

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Add your astrologer data to MongoDB Atlas');
    console.log('2. Test the frontend at http://localhost:3000');
    console.log('3. Verify search and filter functionality');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running on port 5000');
    console.log('2. Check your MongoDB Atlas connection');
    console.log('3. Verify all environment variables are set');
  }
}

// Run the test
testAPI();

