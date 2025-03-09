import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// JWT密钥，应该存储在环境变量中
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 密码加密
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 密码比较
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// 生成JWT令牌
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

// 验证JWT令牌
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.refreshExpiresIn });
}; 