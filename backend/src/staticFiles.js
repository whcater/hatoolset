const path = require('path');
const fs = require('fs');

/**
 * 处理静态文件请求
 * @param {Request} request 请求对象
 * @returns {Response} 响应对象
 */
async function handleStaticFile(request) {
  const url = new URL(request.url);
  let filePath = url.pathname;
  
  // 如果是根路径，则返回index.html
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // 构建完整的文件路径
  const fullPath = path.join(process.cwd(), 'dist', filePath);
  
  // 检查文件是否存在
  try {
    const stat = await fs.promises.stat(fullPath);
    
    if (stat.isFile()) {
      // 读取文件内容
      const content = await fs.promises.readFile(fullPath);
      
      // 确定内容类型
      const contentType = getContentType(filePath);
      
      // 返回文件内容
      return new Response(content, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
  } catch (error) {
    // 文件不存在或其他错误
  }
  
  // 如果文件不存在，尝试返回index.html (SPA应用处理)
  try {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    const content = await fs.promises.readFile(indexPath);
    
    return new Response(content, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    // 如果index.html也不存在，返回404
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}

/**
 * 根据文件扩展名确定内容类型
 * @param {string} filePath 文件路径
 * @returns {string} 内容类型
 */
function getContentType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.webp': 'image/webp'
  };
  
  return contentTypes[extname] || 'application/octet-stream';
}

module.exports = {
  handleStaticFile
};