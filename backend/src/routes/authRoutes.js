import express from 'express';
import authController from '../controllers/authController.js';
import {  requireAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用户邮箱
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 用户密码
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT认证令牌
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 无效的请求数据
 *       401:
 *         description: 邮箱或密码错误
 *       500:
 *         description: 服务器错误
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: 用户名称
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用户邮箱
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 用户密码
 *     responses:
 *       201:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT认证令牌
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 无效的请求数据或邮箱已被注册
 *       500:
 *         description: 服务器错误
 */
router.post('/register', authController.register);

// 邮箱验证
router.get('/verify-email/:token', authController.verifyEmail);

// 密码重置
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/change-password', requireAuth, authController.changePassword);

// 第三方登录
router.get('/google', (req, res) => {
  const redirectUrl = 'https://accounts.google.com/o/oauth2/v2/auth?'
    + 'client_id=YOUR_GOOGLE_CLIENT_ID'
    + '&redirect_uri=YOUR_REDIRECT_URI'
    + '&response_type=code'
    + '&scope=email profile';
  
  res.redirect(redirectUrl);
});
router.get('/google/callback', authController.googleCallback);

router.get('/github', (req, res) => {
  const redirectUrl = 'https://github.com/login/oauth/authorize?'
    + 'client_id=YOUR_GITHUB_CLIENT_ID'
    + '&redirect_uri=YOUR_REDIRECT_URI'
    + '&scope=user:email';
  
  res.redirect(redirectUrl);
});
router.get('/github/callback', authController.githubCallback);

router.get('/wechat', (req, res) => {
  const redirectUrl = 'https://open.weixin.qq.com/connect/qrconnect?'
    + 'appid=YOUR_WECHAT_APPID'
    + '&redirect_uri=YOUR_REDIRECT_URI'
    + '&response_type=code'
    + '&scope=snsapi_login';
  
  res.redirect(redirectUrl);
});
router.get('/wechat/callback', authController.wechatCallback);

export default router; 