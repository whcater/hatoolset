const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi');
const errorHandler = require('./middlewares/errorHandler');
const { authenticate } = require('./middlewares/auth');
const authController = require('./controllers/authController');

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 认证路由
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authenticate, authController.getCurrentUser);

// 错误处理
app.use(errorHandler);

// 处理未找到的路由
app.use((req, res) => {
  res.status(404).json({ message: '未找到请求的资源' });
});

module.exports = app; 