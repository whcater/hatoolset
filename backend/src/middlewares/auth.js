const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

/**
 * 身份验证中间件
 * 验证JWT令牌并将用户信息附加到请求对象
 */
async function authenticate(req, res, next) {
  try {
    // 从请求头中获取令牌
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    
    // 将用户信息附加到请求对象
    req.user = user;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    return res.status(401).json({ message: '认证失败' });
  }
}

/**
 * 可选认证中间件
 * 如果提供了令牌则验证，但不强制要求
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

/**
 * 角色验证中间件
 * 验证用户是否具有特定角色
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }
    
    if (!req.user.roles.includes(role)) {
      return res.status(403).json({ message: '权限不足' });
    }
    
    next();
  };
}

module.exports = {
  authenticate,
  optionalAuthenticate,
  requireRole
}; 