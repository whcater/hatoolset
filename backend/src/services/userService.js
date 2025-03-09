import userModel from '../models/userModel.js';
import { hashPassword } from '../utils/auth.js';

export default {
  async getUserById(req, userId) {
    return await userModel.findById(req, userId);
  },
  
  async createUser(req, userData) {
    // 密码加密
    const passwordHash = await hashPassword(userData.password);
    
    // 创建用户
    const userId = await userModel.create(req, {
      username: userData.username,
      email: userData.email,
      passwordHash
    });
    
    return userId;
  },
  
  async updateUser(req, userId, userData) {
    return await userModel.update(req, userId, userData);
  },
  
  async deleteUser(req, userId) {
    return await userModel.delete(req, userId);
  },
  
  async getAllUsers(req, page = 1, limit = 10) {
    return await userModel.findAll(req, page, limit);
  }
}; 