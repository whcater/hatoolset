import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

// OpenAPI 规范选项
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '我的 API',
      version: '1.0.0',
      description: 'API 文档',
    },
    servers: [
        {
            url: 'http://localhost:8787',
            description: 'local 服务器',
          }, 
      {
        url: 'https://backend-api.cater-wh.workers.dev',
        description: 'API 服务器',
      }
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

// 生成规范
const openapiSpecification = swaggerJsdoc(options);

// 将规范写入到 staticFiles.js 文件中
const staticFilesTemplate = `export const staticFiles = {
  'index.html': \`<!DOCTYPE html>
<html>
<head>
  <title>API 文档</title>
  <link rel="stylesheet" href="/static/style.css">
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/static/openapi.json",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    }
  </script>
</body>
</html>\`,

  'style.css': \`body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
#swagger-ui {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}\`,

  'openapi.json': \`${JSON.stringify(openapiSpecification, null, 2)}\`
};`;

// 写入文件
fs.writeFileSync(
  path.resolve('./src/staticFiles.js'),
  staticFilesTemplate
);

console.log('OpenAPI 文档已生成并内联到 src/staticFiles.js');

// 同时也保存一份到 public 目录（可选）
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync(
  path.resolve('./public/openapi.json'),
  JSON.stringify(openapiSpecification, null, 2)
);

console.log('OpenAPI 文档也已保存到 public/openapi.json'); 