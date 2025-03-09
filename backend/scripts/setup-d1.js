const { execSync } = require('child_process');
const path = require('path');

console.log('开始设置D1数据库...');

try {
  // 创建数据库
  console.log('创建数据库...');
  execSync('wrangler d1 create coredb', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // 执行迁移
  console.log('执行数据库迁移...');
  execSync('npm run db:migrate', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // 添加种子数据
  console.log('添加种子数据...');
  execSync('wrangler d1 execute coredb --file=./src/db/seeds/users.sql', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('数据库设置成功!');
} catch (error) {
  console.error('数据库设置失败:', error.message);
  process.exit(1);
} 