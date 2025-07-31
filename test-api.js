// 简单的API测试脚本
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8787';

async function testAPI() {
  console.log('测试hai-backend API连接...\n');

  const tests = [
    { name: '获取工具分类', url: `${BASE_URL}/api/tool-categories` },
    { name: '获取工具列表', url: `${BASE_URL}/api/tools` },
    { name: '获取精选工具', url: `${BASE_URL}/api/tools/featured` },
    { name: '获取热门工具', url: `${BASE_URL}/api/tools/trending` },
    { name: '获取工具标签', url: `${BASE_URL}/api/tools/tags` },
  ];

  for (const test of tests) {
    try {
      console.log(`🧪 ${test.name}...`);
      const response = await fetch(test.url);
      
      if (!response.ok) {
        console.log(`❌ 失败: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      console.log(`✅ 成功: ${JSON.stringify(data).substring(0, 100)}...`);
    } catch (error) {
      console.log(`❌ 错误: ${error.message}`);
    }
    console.log('');
  }
}

testAPI().catch(console.error);