const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 确保wrangler.toml存在
if (!fs.existsSync(path.join(__dirname, '../wrangler.toml'))) {
  console.error('错误: wrangler.toml 文件不存在');
  process.exit(1);
}

console.log('开始部署后端到Cloudflare Workers...');

try {
  // 执行wrangler发布命令
  execSync('wrangler publish', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('后端部署成功!');
} catch (error) {
  console.error('部署失败:', error.message);
  process.exit(1);
} 