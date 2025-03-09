import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';

const router = express.Router();

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
        url: 'https://backend-api.cater-wh.workers.dev',
        description: 'API 服务器',
      },
    ],
  },
  // 指定包含 JSDoc 注释的文件路径
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

// 生成 OpenAPI 规范
router.get('/', (req, res) => {
  try {
    const openapiSpecification = swaggerJsdoc(options);
    res.json(openapiSpecification);
  } catch (error) {
    console.error('生成 OpenAPI 文档失败:', error);
    res.status(500).json({ error: '生成文档失败' });
  }
});

export default router; 