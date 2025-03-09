-- 创建管理员用户 (密码: Admin123)
INSERT OR IGNORE INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@example.com', '$2a$10$JcX7GH6D.dUi0Ov2KEXUk.4WMrPF8CkjYb/hjh4wMPhkJCGNUVIJy', 'admin');

-- 创建测试用户 (密码: Test123)
INSERT OR IGNORE INTO users (username, email, password_hash, role)
VALUES ('testuser', 'test@example.com', '$2a$10$JcX7GH6D.dUi0Ov2KEXUk.4WMrPF8CkjYb/hjh4wMPhkJCGNUVIJy', 'user'); 