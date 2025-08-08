# Google登录+工具收录申请系统设计

## 核心流程

### 1. 用户认证流程
```
用户 -> Google OAuth -> 获取用户信息 -> 创建/更新用户记录 -> 生成JWT Token -> 前端存储Token
```

### 2. 工具申请流程  
```
登录用户 -> 填写工具信息 -> URL预览 -> 提交申请 -> 管理员审核 -> 通过/拒绝 -> 展示/通知
```

## 数据库设计分析

### 现有表结构优势
- `tools` 表已支持完整工具申请流程（status、submitter_id、admin_notes等）
- `tool_previews` 表支持URL预览功能
- `tool_notifications` 表支持通知系统
- `tool_history` 表支持审核历史追踪

### 需要补充的表结构
1. **用户表增强** - 支持Google OAuth
2. **OAuth令牌表** - 管理认证令牌
3. **管理员权限表** - 区分管理员用户

## API设计

### 认证相关API
- `POST /api/auth/google` - Google OAuth登录
- `POST /api/auth/refresh` - 刷新Token
- `GET /api/auth/profile` - 获取用户信息
- `POST /api/auth/logout` - 登出

### 工具申请API
- `POST /api/tools/submit` - 申请收录工具
- `GET /api/tools/my-submissions` - 用户的申请记录
- `PUT /api/tools/submissions/:id` - 修改申请

### 管理员审核API
- `GET /api/admin/submissions` - 获取待审核申请
- `PUT /api/admin/submissions/:id/approve` - 批准申请
- `PUT /api/admin/submissions/:id/reject` - 拒绝申请
- `GET /api/admin/submissions/stats` - 审核统计

## 前端功能模块

### hai-toolset 用户端
- Google登录按钮
- 工具申请表单（URL预览）
- 我的申请记录页面
- 申请状态通知

### hai-admin 管理端
- 申请审核列表
- 申请详情页面
- 批量审核操作
- 审核统计仪表板

## 技术实现要点

### Google OAuth集成
- 使用 `google-auth-library` 验证ID Token
- 安全存储OAuth配置
- 实现Token刷新机制

### 权限控制
- JWT中间件验证
- 基于角色的访问控制(RBAC)
- 管理员权限检查

### URL预览增强
- 支持多种网站类型
- 截图生成功能  
- 元数据提取优化

## 安全考虑

1. **认证安全**
   - Google ID Token验证
   - JWT签名验证
   - Token过期处理

2. **数据验证**
   - URL格式验证
   - XSS防护
   - SQL注入防护

3. **权限控制**
   - 用户只能操作自己的申请
   - 管理员权限严格验证
   - 敏感操作日志记录

## 用户体验优化

1. **申请体验**
   - 实时URL预览
   - 表单自动填充
   - 进度状态展示

2. **审核体验**
   - 批量操作支持
   - 快速审核界面
   - 历史记录追踪

3. **通知体验**
   - 实时状态更新
   - 邮件通知（可选）
   - 移动端适配