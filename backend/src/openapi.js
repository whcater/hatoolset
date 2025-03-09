const openapi = {
  openapi: '3.0.0',
  info: {
    title: '高可用工具集 API',
    version: '1.0.0',
    description: '为独立开发者提供工具和技术栈指南的API'
  },
  servers: [
    {
      url: '/api',
      description: 'API基本路径'
    }
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: '用户注册',
        tags: ['认证'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email'
                  },
                  password: {
                    type: 'string',
                    minLength: 6
                  },
                  name: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: '注册成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string'
                    },
                    user: {
                      $ref: '#/components/schemas/User'
                    },
                    token: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: '请求错误',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: '用户登录',
        tags: ['认证'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email'
                  },
                  password: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '登录成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string'
                    },
                    user: {
                      $ref: '#/components/schemas/User'
                    },
                    token: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: '认证失败',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/auth/me': {
      get: {
        summary: '获取当前用户信息',
        tags: ['认证'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: '成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: '未认证',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          email: {
            type: 'string',
            format: 'email'
          },
          name: {
            type: 'string'
          },
          roles: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          errors: {
            type: 'object'
          }
        }
      }
    }
  }
};

module.exports = openapi; 