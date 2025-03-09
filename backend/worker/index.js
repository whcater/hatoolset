import { createAdapter } from './adapter.js';
import app from '../src/app.js';
import { staticFiles } from '../src/staticFiles.js';

// 根据文件扩展名获取 Content-Type
function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf'
  };
  return types[ext] || 'application/octet-stream';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理静态文件请求
    if (url.pathname.startsWith('/static/')) {
      const fileName = url.pathname.replace('/static/', '');
      const content = staticFiles[fileName];
      
      if (!content) {
        return new Response('Not Found', { status: 404 });
      }
      
      const contentType = getContentType(fileName);
      return new Response(content, {
        headers: { 'Content-Type': contentType }
      });
    }
    
    // 处理 API 文档主页
    if (url.pathname === '/api-docs' || url.pathname === '/api-docs/') {
      return new Response(staticFiles['index.html'], {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // 将D1数据库实例注入到请求中
    request.db = env.DB;
    console.log('createAdapter',env);
    return createAdapter(app)(request);
  }
};