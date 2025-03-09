export const staticFiles = {
  'index.html': `<!DOCTYPE html>
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
</html>`,

  'style.css': `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
#swagger-ui {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}`,

  'openapi.json': `{
  "openapi": "3.0.0",
  "info": {
    "title": "我的 API",
    "version": "1.0.0",
    "description": "API 文档"
  },
  "servers": [
    {
      "url": "http://localhost:8787",
      "description": "local 服务器"
    },
    {
      "url": "https://backend-api.cater-wh.workers.dev",
      "description": "API 服务器"
    }
  ],
  "paths": {
    "/api/auth/login": {
      "post": {
        "summary": "用户登录",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email",
                  "password"
                ],
                "properties": {
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "用户邮箱"
                  },
                  "password": {
                    "type": "string",
                    "format": "password",
                    "description": "用户密码"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "登录成功",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "JWT认证令牌"
                    },
                    "user": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "无效的请求数据"
          },
          "401": {
            "description": "邮箱或密码错误"
          },
          "500": {
            "description": "服务器错误"
          }
        }
      }
    },
    "/api/auth/register": {
      "post": {
        "summary": "用户注册",
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "name",
                  "email",
                  "password"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "用户名称"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "用户邮箱"
                  },
                  "password": {
                    "type": "string",
                    "format": "password",
                    "description": "用户密码"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "注册成功",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "JWT认证令牌"
                    },
                    "user": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "无效的请求数据或邮箱已被注册"
          },
          "500": {
            "description": "服务器错误"
          }
        }
      }
    },
    "/api/users": {
      "get": {
        "summary": "获取所有用户",
        "tags": [
          "Users"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "用户列表",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "401": {
            "description": "未授权"
          },
          "500": {
            "description": "服务器错误"
          }
        }
      },
      "post": {
        "summary": "创建新用户",
        "tags": [
          "Users"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "name",
                  "email",
                  "password"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "用户名称"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "用户邮箱"
                  },
                  "password": {
                    "type": "string",
                    "format": "password",
                    "description": "用户密码"
                  },
                  "role": {
                    "type": "string",
                    "description": "用户角色",
                    "enum": [
                      "user",
                      "admin"
                    ],
                    "default": "user"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "用户创建成功",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "无效的请求数据"
          },
          "401": {
            "description": "未授权"
          },
          "403": {
            "description": "权限不足"
          }
        }
      }
    },
    "/api/users/{id}": {
      "get": {
        "summary": "获取单个用户",
        "tags": [
          "Users"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": {
              "type": "string"
            },
            "required": true,
            "description": "用户ID"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "用户信息",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "404": {
            "description": "用户不存在"
          }
        }
      },
      "put": {
        "summary": "更新用户信息",
        "tags": [
          "Users"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": {
              "type": "string"
            },
            "required": true,
            "description": "用户ID"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "用户名称"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "用户邮箱"
                  },
                  "role": {
                    "type": "string",
                    "description": "用户角色",
                    "enum": [
                      "user",
                      "admin"
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "用户更新成功",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "无效的请求数据"
          },
          "401": {
            "description": "未授权"
          },
          "403": {
            "description": "权限不足"
          },
          "404": {
            "description": "用户不存在"
          }
        }
      },
      "delete": {
        "summary": "删除用户",
        "tags": [
          "Users"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": {
              "type": "string"
            },
            "required": true,
            "description": "用户ID"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "用户删除成功"
          },
          "401": {
            "description": "未授权"
          },
          "403": {
            "description": "权限不足"
          },
          "404": {
            "description": "用户不存在"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "required": [
          "id",
          "name",
          "email"
        ],
        "properties": {
          "id": {
            "type": "string",
            "description": "用户唯一ID"
          },
          "name": {
            "type": "string",
            "description": "用户名称"
          },
          "email": {
            "type": "string",
            "format": "email",
            "description": "用户邮箱"
          },
          "role": {
            "type": "string",
            "description": "用户角色",
            "enum": [
              "user",
              "admin"
            ]
          }
        }
      }
    }
  },
  "tags": []
}`
};