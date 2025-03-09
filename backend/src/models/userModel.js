import db from '../config/database.js';

export default {
  async findById(request, id) {
    const conn = db.getConnection(request);
    const user = await conn.prepare('SELECT id, username, email, role FROM users WHERE id = ?')
      .bind(id)
      .first();
    return user;
  },
  
  async findByEmail(request, email) {
    const conn = db.getConnection(request); 
    const user = await conn.prepare('SELECT id, username, email, password_hash, role FROM users WHERE email = ?')
      .bind(email)
      .first();
    return user;
  },
  
  async create(request, userData) {
    const conn = db.getConnection(request);
    const result = await conn.prepare(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
    )
    .bind(userData.username, userData.email, userData.passwordHash, userData.role || 'user')
    .run();
    
    return result.meta.last_row_id;
  },
  
  async update(request, id, userData) {
    const conn = db.getConnection(request);
    const fields = [];
    const values = [];
    
    // 动态构建更新字段
    if (userData.username) {
      fields.push('username = ?');
      values.push(userData.username);
    }
    
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    
    if (userData.passwordHash) {
      fields.push('password_hash = ?');
      values.push(userData.passwordHash);
    }
    
    if (userData.role) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    // 如果没有要更新的字段，则返回
    if (fields.length <= 1) {
      return false;
    }
    
    // 添加ID作为最后一个参数
    values.push(id);
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const result = await conn.prepare(query).bind(...values).run();
    
    return result.meta.changes > 0;
  },
  
  async delete(request, id) {
    const conn = db.getConnection(request);
    const result = await conn.prepare('DELETE FROM users WHERE id = ?')
      .bind(id)
      .run();
    
    return result.meta.changes > 0;
  },
  
  async findAll(request, page = 1, limit = 10) {
    const conn = db.getConnection(request);
    const offset = (page - 1) * limit;
    
    // 获取用户列表
    const users = await conn.prepare('SELECT id, username, email, role, created_at FROM users LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all();
    
    // 获取总数
    const countResult = await conn.prepare('SELECT COUNT(*) as total FROM users').first();
    
    return {
      users: users.results,
      pagination: {
        total: countResult.total,
        page,
        limit,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }
}; 