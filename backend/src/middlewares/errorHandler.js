/**
 * 全局错误处理中间件
 */
function errorHandler(err, req, res, next) {
  console.error('错误详情:', err);
  
  // 处理Prisma错误
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(400).json({
        message: '提供的数据违反了唯一性约束'
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        message: '未找到请求的资源'
      });
    }
  }
  
  // 处理JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: '无效的令牌'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: '令牌已过期'
    });
  }
  
  // 处理验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: '验证错误',
      errors: err.errors
    });
  }
  
  // 默认错误响应
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler; 