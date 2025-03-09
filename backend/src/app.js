import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import docsRoutes from './routes/docsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { openApiDocument } from './openapi.js';

const app = express();

// 中间件
app.use(express.json());
app.use(cors());
app.use(helmet());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api-docs/json', docsRoutes);

// 提供静态文件
app.use('/api-docs', express.static('public'));

// 确保路由处理器都正确结束
app.get('/api/test', (req, res) => {
  res.json({ message: 'test' }); // 确保发送响应
});

// OpenAPI 文档路由
app.get('/api-docs/json', (req, res) => {
  res.json(openApiDocument);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: '服务器错误' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: '未找到' });
});

export default app; 