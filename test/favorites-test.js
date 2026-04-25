// Simple test file to verify favorites functionality
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8788';

async function testFavoritesAPI() {
  console.log('Testing favorites API...');
  
  try {
    // Test 1: Get user favorites (should work without auth for now)
    console.log('1. Testing get user favorites...');
    const favoritesRes = await fetch(`${API_BASE}/api/tools/favorites`);
    const favoritesData = await favoritesRes.json();
    console.log('✓ Favorites API response structure:');
    console.log('  - Has favorites array:', Array.isArray(favoritesData.favorites));
    console.log('  - Has pagination:', !!favoritesData.pagination);
    console.log('  - Sample favorite structure:', favoritesData.favorites?.[0] ? {
      id: favoritesData.favorites[0].id,
      user_id: favoritesData.favorites[0].user_id,
      tool_id: favoritesData.favorites[0].tool_id,
      has_tool_object: !!favoritesData.favorites[0].tool,
      tool_id_in_tool: favoritesData.favorites[0].tool?.id
    } : 'No favorites found');

    // Test 2: Test view tracking
    console.log('2. Testing view tracking...');
    const viewRes = await fetch(`${API_BASE}/api/tools/1/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const viewData = await viewRes.json();
    console.log('✓ View tracking response:', viewData.success ? 'OK' : 'FAILED');

    // Test 3: Test view tracking duplicate (same day)
    console.log('3. Testing duplicate view prevention...');
    const viewRes2 = await fetch(`${API_BASE}/api/tools/1/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const viewData2 = await viewRes2.json();
    console.log('✓ Duplicate view prevention:', viewData2.already_recorded ? 'OK' : 'FAILED');

    // Test 4: Test favorite/unfavorite functionality
    console.log('4. Testing favorite functionality...');
    const favoriteRes = await fetch(`${API_BASE}/api/tools/1/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const favoriteData = await favoriteRes.json();
    console.log('✓ Add to favorites response:', favoriteData.success ? 'OK' : 'FAILED');

    const unfavoriteRes = await fetch(`${API_BASE}/api/tools/1/favorite`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const unfavoriteData = await unfavoriteRes.json();
    console.log('✓ Remove from favorites response:', unfavoriteData.success ? 'OK' : 'FAILED');

    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run tests if called directly
if (require.main === module) {
  testFavoritesAPI();
}

module.exports = { testFavoritesAPI };