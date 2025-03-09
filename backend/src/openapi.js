export const openApiDocument = {
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
  paths: {
    '/api/users': {
      get: {
        summary: '获取所有用户',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: '用户列表',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },
      },
      // 其他路径...
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          // 其他属性...
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
}; 