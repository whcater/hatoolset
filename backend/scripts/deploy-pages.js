import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('开始部署前端到Cloudflare Pages...');

try {
  // 在 ES 模块中获取当前文件的目录
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // 假设前端目录在项目根目录的frontend文件夹中
  const frontendDir = path.join(__dirname, '../../');
  
  // 使用 npm 的完整路径
  const npmPath = '/usr/local/bin/npm'; // 或者通过 'which npm' 获取的路径
  const wranglerPath = '/usr/local/bin/wrangler'; // 或者通过 'which wrangler' 获取的路径
  
  // 构建前端
  console.log('构建前端...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: frontendDir,
    env: process.env // 确保环境变量传递
  });
  
  // 部署到Cloudflare Pages
  console.log('部署到Cloudflare Pages...');
  execSync('wrangler pages deploy dist', { 
    stdio: 'inherit',
    cwd: frontendDir,
    env: process.env // 确保环境变量传递
  });
  
  console.log('前端部署成功!');
} catch (error) {
  console.error('部署失败:', error.message);
  process.exit(1);
} 