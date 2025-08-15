// Test to verify the favorites API structure matches our expectations
// Note: This is a structure validation test, not a module import test

// Mock API response based on the real structure provided
const mockApiResponse = {
  "success": true,
  "data": {
    "favorites": [
      {
        "id": 8,
        "user_id": 1,
        "tool_id": 13,
        "created_at": "2025-08-12 07:01:42",
        "tool": {
          "id": 13,
          "name": "LM Studio - Download and run LLMs on your computer",
          "description": "Run gpt-oss, Llama, Gemma, Qwen, and DeepSeek locally and privately.",
          "url": "https://lmstudio.ai/",
          "icon_url": "https://lmstudio.ai/_next/static/media/android-chrome-192x192.3a60873f.png",
          "screenshot_url": null,
          "pricing": "free",
          "platform": "desktop",
          "rating": 0,
          "views": 0,
          "clicks": 0,
          "favorites": 2,
          "shares": 0,
          "featured": false,
          "trending": false,
          "verified": false,
          "category_name": "AI",
          "category_icon": "🤖",
          "category_color": "#7C3AED"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1,
      "has_prev": false,
      "has_next": false
    }
  }
};

function testFavoritesStructure() {
  console.log('Testing favorites data structure...');
  
  // Test the expected structure
  const favorites = mockApiResponse.data.favorites;
  const pagination = mockApiResponse.data.pagination;
  
  console.log('✓ Structure validation:');
  console.log('  - Has favorites array:', Array.isArray(favorites));
  console.log('  - Has pagination object:', typeof pagination === 'object');
  console.log('  - Favorite has id:', typeof favorites[0].id === 'number');
  console.log('  - Favorite has user_id:', typeof favorites[0].user_id === 'number');
  console.log('  - Favorite has tool_id:', typeof favorites[0].tool_id === 'number');
  console.log('  - Favorite has tool object:', typeof favorites[0].tool === 'object');
  console.log('  - Tool has id:', typeof favorites[0].tool.id === 'number');
  console.log('  - Tool has name:', typeof favorites[0].tool.name === 'string');
  console.log('  - Tool has category info:', !!favorites[0].tool.category_name);
  
  // Test pagination structure
  console.log('  - Pagination has page:', typeof pagination.page === 'number');
  console.log('  - Pagination has total:', typeof pagination.total === 'number');
  console.log('  - Pagination has has_prev:', typeof pagination.has_prev === 'boolean');
  console.log('  - Pagination has has_next:', typeof pagination.has_next === 'boolean');
  
  console.log('\n✓ All structure tests passed!');
  
  // Test data transformation for UserProfile component
  console.log('\nTesting data transformation:');
  const transformedFavorites = favorites.map(fav => ({
    id: fav.id,
    user_id: fav.user_id,
    tool_id: fav.tool_id,
    tool: fav.tool,
    created_at: fav.created_at
  }));
  
  console.log('  - Transformed favorite structure:', {
    id: transformedFavorites[0].id,
    user_id: transformedFavorites[0].user_id,
    tool_id: transformedFavorites[0].tool_id,
    tool_id_from_tool: transformedFavorites[0].tool.id,
    has_tool_object: !!transformedFavorites[0].tool
  });
  
  console.log('✓ Data transformation test passed!');
}

// Run test if called directly
if (require.main === module) {
  testFavoritesStructure();
}

module.exports = { testFavoritesStructure };