import { verifyToken } from '../utils/auth.js';

export const authenticate = (req, res, next) => {
  try {
    // 获取请求头中的Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }
    
    // 提取令牌
    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const decoded = verifyToken(token);
    
    // 将用户信息添加到请求对象
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: '无效的认证令牌' });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }
    
    next();
  };
};

// 添加requireAuth方法，用于验证用户是否已登录
export const requireAuth = (req, res, next) => {
  authenticate(req, res, next);
};

export default {
  authenticate,
  authorize,
  requireAuth
}; 