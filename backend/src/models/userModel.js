const { prisma } = require('../prisma/client');

class User {
  /**
   * 通过ID查找用户
   * @param {string} id 用户ID
   */
  static async findById(id) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  /**
   * 通过邮箱查找用户
   * @param {string} email 用户邮箱
   */
  static async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * 创建新用户
   * @param {Object} userData 用户数据
   */
  static async create(userData) {
    return prisma.user.create({
      data: userData
    });
  }

  /**
   * 更新用户信息
   * @param {string} id 用户ID
   * @param {Object} userData 更新的用户数据
   */
  static async update(id, userData) {
    return prisma.user.update({
      where: { id },
      data: userData
    });
  }

  /**
   * 查找用户的收藏工具
   * @param {string} userId 用户ID
   */
  static async getFavoriteTools(userId) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { tool: true }
    });
  }
  
  /**
   * 添加工具到收藏
   * @param {string} userId 用户ID
   * @param {string} toolId 工具ID
   */
  static async addFavoriteTool(userId, toolId) {
    return prisma.favorite.create({
      data: {
        userId,
        toolId
      }
    });
  }
  
  /**
   * 从收藏中移除工具
   * @param {string} userId 用户ID
   * @param {string} toolId 工具ID
   */
  static async removeFavoriteTool(userId, toolId) {
    return prisma.favorite.delete({
      where: {
        userId_toolId: {
          userId,
          toolId
        }
      }
    });
  }
}

module.exports = {
  User
}; 