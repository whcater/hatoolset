import authService from '../services/authService.js';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/userModel');

export default {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // 验证请求数据
      if (!email || !password) {
        return res.status(400).json({ message: '邮箱和密码不能为空' });
      }
      
      // 登录
      const result = await authService.login(req, email, password);
      
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === '用户不存在' || error.message === '密码错误') {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  },
  
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      
      // 检查邮箱是否已存在
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: '该邮箱已注册' });
      }
      
      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // 创建用户
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        roles: ['user']
      });
      
      // 生成令牌
      const token = generateToken(user.id);
      
      // 返回用户信息（不包含密码）
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: '注册成功',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error.message === '该邮箱已被注册' || error.message === '该用户名已被使用') {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  },
  
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      
      await authService.verifyEmail(token);
      
      return res.status(200).json({ message: '邮箱验证成功' });
    } catch (error) {
      if (error.message === '无效的验证链接') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },
  
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: '邮箱不能为空' });
      }
      
      await authService.forgotPassword(email);
      
      return res.status(200).json({ message: '重置密码链接已发送到您的邮箱' });
    } catch (error) {
      if (error.message === '用户不存在') {
        // 出于安全考虑，即使用户不存在也返回相同的消息
        return res.status(200).json({ message: '重置密码链接已发送到您的邮箱' });
      }
      next(error);
    }
  },
  
  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: '新密码不能为空' });
      }
      
      await authService.resetPassword(token, password);
      
      return res.status(200).json({ message: '密码重置成功' });
    } catch (error) {
      if (error.message === '无效或已过期的重置链接') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },
  
  async changePassword(req, res, next) {
    try {
      const userId = req.user.id; // 从JWT中获取
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: '当前密码和新密码不能为空' });
      }
      
      await authService.changePassword(userId, currentPassword, newPassword);
      
      return res.status(200).json({ message: '密码修改成功' });
    } catch (error) {
      if (error.message === '当前密码错误') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },
  
  // Google 登录回调
  async googleCallback(req, res, next) {
    try {
      const { code } = req.query;
      
      // 处理google登录逻辑...
      // 这里应该有一个函数来处理OAuth流程，获取用户信息
      const googleData = await getGoogleUserData(code);
      
      const result = await authService.oauthLogin(
        'google', 
        googleData.id, 
        {
          name: googleData.name,
          email: googleData.email,
          avatar: googleData.picture
        }
      );
      
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  
  // GitHub 登录回调
  async githubCallback(req, res, next) {
    try {
      const { code } = req.query;
      
      // 处理github登录逻辑...
      const githubData = await getGithubUserData(code);
      
      const result = await authService.oauthLogin(
        'github', 
        githubData.id.toString(),
        {
          name: githubData.name || githubData.login,
          email: githubData.email,
          avatar: githubData.avatar_url
        }
      );
      
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  
  // 微信登录回调
  async wechatCallback(req, res, next) {
    try {
      const { code } = req.query;
      
      // 处理微信登录逻辑...
      const wechatData = await getWechatUserData(code);
      
      const result = await authService.oauthLogin(
        'wechat', 
        wechatData.openid,
        {
          name: wechatData.nickname,
          email: `${wechatData.openid}@wechat.placeholder.com`, // 微信没有email，创建占位符
          avatar: wechatData.headimgurl
        }
      );
      
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * 获取当前用户信息
   */
  async getCurrentUser(req, res) {
    // 用户信息在authenticate中间件中已添加到req对象
    const { password: _, ...userWithoutPassword } = req.user;
    
    res.json({
      user: userWithoutPassword
    });
  }
};

// 这些函数需要根据实际的OAuth供应商API实现
async function getGoogleUserData(code) {
  // 实现获取Google用户数据的逻辑
}

async function getGithubUserData(code) {
  // 实现获取GitHub用户数据的逻辑
}

async function getWechatUserData(code) {
  // 实现获取微信用户数据的逻辑
}

/**
 * 生成JWT令牌
 */
function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
} 