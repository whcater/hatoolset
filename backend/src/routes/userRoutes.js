import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: 用户唯一ID
 *         name:
 *           type: string
 *           description: 用户名称
 *         email:
 *           type: string
 *           format: email
 *           description: 用户邮箱
 *         role:
 *           type: string
 *           description: 用户角色
 *           enum: [user, admin]
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: 获取所有用户
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    // 查询用户
    const { results } = await req.db.prepare('SELECT * FROM users').all();
    // 发送响应
    res.json(results);
  } catch (error) {
    // 出错时传递给错误处理中间件
    next(error);
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: 获取单个用户
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 用户ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 用户不存在
 */
router.get('/:id', authenticate, userController.getUser);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: 创建新用户
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               role:
 *                 type: string
 *                 description: 用户角色
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: 用户创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 无效的请求数据
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 */
router.post('/', authenticate, userController.createUser);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: 更新用户信息
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 用户ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 用户名称
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用户邮箱
 *               role:
 *                 type: string
 *                 description: 用户角色
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: 用户更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 无效的请求数据
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 用户不存在
 */
router.put('/:id', authenticate, userController.updateUser);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: 删除用户
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 用户ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 用户删除成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 用户不存在
 */
router.delete('/:id', authenticate, userController.deleteUser);

export default router; 