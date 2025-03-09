import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const STATIC_DIR = './public';

// 遍历目录
function walkDir(dir) {
  let results = [];
  const list = readdirSync(dir);
  
  list.forEach(file => {
    const filePath = join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      results.push(filePath);
    }
  });
  
  return results;
}

// 上传文件到 KV
const files = walkDir(STATIC_DIR);
files.forEach(file => {
  const key = file.replace(STATIC_DIR + '/', '');
  const contentType = getContentType(file);
  
  console.log(`上传 ${file} 到 KV，键名: ${key}`);
  
  // 使用 wrangler 命令行上传
  execSync(`wrangler kv:key put --binding=STATIC_FILES "${key}" "${file}" --path`);
});

console.log('静态文件上传完成'); 