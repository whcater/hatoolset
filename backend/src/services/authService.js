import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../config/database.js';
import config from '../config/config.js';
import emailService from './emailService.js';

let currentUser = null;
let authStateListeners = [];
// 简单的认证服务
export const authService = () => { 

  const signIn = async (email, password) => {
    // Simulate successful authentication
    if (email && password) {
      currentUser = {
        uid: 'user-' + Math.random().toString(36).substring(2, 9),
        email: email,
        name: email.split('@')[0],
        photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
        createdAt: new Date().toISOString(),
      };

      // Notify listeners
      authStateListeners.forEach(listener => listener(currentUser));

      return currentUser;
    }

    throw new Error('Invalid credentials');
  };

  const signOut = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    currentUser = null;

    // Notify listeners
    authStateListeners.forEach(listener => listener(null));
  };

  const getCurrentUser = () => {
    return currentUser;
  };

  const onAuthStateChanged = (callback) => {
    // Add listener
    authStateListeners.push(callback);

    // Initial callback with current state
    callback(currentUser);

    // Return unsubscribe function
    return () => {
      authStateListeners = authStateListeners.filter(listener => listener !== callback);
    };
  };

  return {
    signIn,
    signOut,
    getCurrentUser,
    onAuthStateChanged
  };
}

export default {
  async login(req, email, password) {
    // 查找用户
    const user = await db.getConnection(req).prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }
    
    // 生成JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // 获取用户设置
    const settingsStmt = await db.getConnection(req).prepare('SELECT * FROM user_settings WHERE user_id = ?').bind(user.id);
    const settings = await settingsStmt.first();
    
    // 删除敏感信息
    delete user.password_hash;
    delete user.verification_token;
    delete user.reset_password_token;
    delete user.reset_password_expires;
    
    return {
      user,
      settings,
      token
    };
  },
  
  async register(req, userData) {
    // 检查邮箱是否已存在
    const existingUserStmt = await db.getConnection(req).prepare('SELECT * FROM users WHERE email = ?').bind(userData.email);
    const existingUser = await existingUserStmt.first();
    
    if (existingUser) {
      throw new Error('该邮箱已被注册');
    }
    
    // 检查用户名是否已存在
    const existingUsernameStmt = await db.getConnection(req).prepare('SELECT * FROM users WHERE username = ?').bind(userData.username);
    const existingUsername = await existingUsernameStmt.first();
    
    if (existingUsername) {
      throw new Error('该用户名已被使用');
    }
    
    // 生成密码哈希
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);
    
    // 生成邮箱验证token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // 创建用户
    const insertUserStmt = await db.getConnection(req).prepare(
      `INSERT INTO users (
        username, email, password_hash, 
        bio, company, position, website, 
        verification_token, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      userData.username, 
      userData.email, 
      passwordHash,
      userData.bio || null,
      userData.company || null,
      userData.position || null,
      userData.website || null,
      verificationToken,
      'user'
    );
    
    const result = await insertUserStmt.run();
    const userId = result.meta.last_row_id;
    
    // 创建用户设置
    const insertSettingsStmt = await db.getConnection(req).prepare(
      'INSERT INTO user_settings (user_id) VALUES (?)'
    ).bind(userId);
    
    await insertSettingsStmt.run();
    
    // 发送验证邮件
    await emailService.sendVerificationEmail(userData.email, verificationToken);
    
    return userId;
  },
  
  async verifyEmail(token) {
    const user = await db.getConnection(req).prepare('SELECT * FROM users WHERE verification_token = ?').bind(token).run();
    if (!user) {
      throw new Error('无效的验证链接');
    }
    
    await db.run(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE id = ?',
      [user.id]
    );
    
    return true;
  },
  
  async forgotPassword(email) {
    const user = await db.getConnection(req).prepare('SELECT * FROM users WHERE email = ?').bind(email).run();
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 生成重置密码token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1小时有效期
    
    await db.run(
      'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
      [resetToken, resetExpires.toISOString(), user.id]
    );
    
    // 发送重置密码邮件
    await emailService.sendPasswordResetEmail(email, resetToken);
    
    return true;
  },
  
  async resetPassword(token, newPassword) {
    const now = new Date().toISOString();
    const user = await db.getConnection(req).prepare(
      'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?').bind(token, now).run();
    
    if (!user) {
      throw new Error('无效或已过期的重置链接');
    }
    
    // 生成新密码哈希
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await db.run(
      'UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
      [passwordHash, user.id]
    );
    
    return true;
  },
  
  async changePassword(userId, currentPassword, newPassword) {
    const user = await db.getConnection(req).prepare('SELECT * FROM users WHERE id = ?').bind(userId).run();
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 验证当前密码
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('当前密码错误');
    }
    
    // 生成新密码哈希
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await db.run(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, userId]
    );
    
    return true;
  },
  
  async oauthLogin(provider, providerUserId, userData) {
    // 检查该第三方账号是否已关联用户
    const oauthAccount = await db.getConnection(req).prepare(
      'SELECT * FROM oauth_accounts WHERE provider = ? AND provider_user_id = ?').bind(provider, providerUserId).run();
    
    let userId;
    
    if (oauthAccount) {
      // 已存在关联，直接获取用户ID
      userId = oauthAccount.user_id;
    } else {
      // 检查邮箱是否已存在
      const existingUser = await db.getConnection(req).prepare('SELECT * FROM users WHERE email = ?').bind(userData.email).run();
      
      if (existingUser) {
        // 邮箱已存在，关联到现有账号
        userId = existingUser.id;
      } else {
        // 创建新用户
        const username = userData.name || `${provider}_user_${Date.now()}`;
        // 生成随机密码（用户不需要知道）
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);
        
        const result = await db.run(
          `INSERT INTO users (
            username, email, password_hash, 
            email_verified, role, avatar
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            username,
            userData.email,
            passwordHash,
            true, // 第三方登录不需要验证邮箱
            'user',
            userData.avatar || null
          ]
        );
        
        userId = result.lastID;
        
        // 创建用户设置
        await db.run(
          'INSERT INTO user_settings (user_id) VALUES (?)',
          [userId]
        );
      }
      
      // 创建OAuth关联
      await db.run(
        `INSERT INTO oauth_accounts (
          user_id, provider, provider_user_id, provider_data
        ) VALUES (?, ?, ?, ?)`,
        [
          userId,
          provider,
          providerUserId,
          JSON.stringify(userData)
        ]
      );
    }
    
    // 获取用户信息
    const user = await db.getConnection(req).prepare('SELECT * FROM users WHERE id = ?').bind(userId).run();
    
    // 生成JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // 获取用户设置
    const settings = await db.getConnection(req).prepare('SELECT * FROM user_settings WHERE user_id = ?').bind(user.id).run();
    
    // 删除敏感信息
    delete user.password_hash;
    delete user.verification_token;
    delete user.reset_password_token;
    delete user.reset_password_expires;
    
    return {
      user,
      settings,
      token
    };
  }
};