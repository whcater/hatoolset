import userService from '../services/userService.js';

export default {
  async getUser(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(req, userId);
      
      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const userId = await userService.createUser(req, userData);
      
      return res.status(201).json({ 
        message: '用户创建成功', 
        userId 
      });
    } catch (error) {
      next(error);
    }
  },
  
  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const userData = req.body;
      
      // 检查是否有权限更新用户
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: '没有权限更新此用户' });
      }
      
      const success = await userService.updateUser(req, userId, userData);
      
      if (!success) {
        return res.status(404).json({ message: '用户不存在或无更新内容' });
      }
      
      return res.status(200).json({ message: '用户更新成功' });
    } catch (error) {
      next(error);
    }
  },
  
  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      
      // 检查是否有权限删除用户
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: '没有权限删除此用户' });
      }
      
      const success = await userService.deleteUser(req, userId);
      
      if (!success) {
        return res.status(404).json({ message: '用户不存在' });
      }
      
      return res.status(200).json({ message: '用户删除成功' });
    } catch (error) {
      next(error);
    }
  },
  
  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await userService.getAllUsers(req, page, limit);
      
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}; 