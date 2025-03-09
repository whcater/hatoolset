export default {
  // D1数据库配置
  getConnection: (request) => {
    // 从请求中获取D1实例
    return request.db;
  }
}; 