export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // 默认错误状态码和消息
  let statusCode = 500;
  let message = '服务器内部错误';
  
  // 处理特定类型的错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = '未授权';
  }
  
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}; 