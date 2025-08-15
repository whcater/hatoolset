# Favorites API Structure Update

## 概述

根据真实API返回的数据结构，更新了收藏功能相关的类型定义和数据处理逻辑。

## 真实API结构

### 完整API响应
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": 8,
        "user_id": 1,
        "tool_id": 13,
        "created_at": "2025-08-12 07:01:42",
        "tool": {
          "id": 13,
          "name": "LM Studio - Download and run LLMs on your computer",
          "description": "Run gpt-oss, Llama, Gemma, Qwen, and DeepSeek locally and privately.",
          "url": "https://lmstudio.ai/",
          "icon_url": "https://lmstudio.ai/_next/static/media/android-chrome-192x192.3a60873f.png",
          "screenshot_url": null,
          "pricing": "free",
          "platform": "desktop",
          "rating": 0,
          "views": 0,
          "clicks": 0,
          "favorites": 2,
          "shares": 0,
          "featured": false,
          "trending": false,
          "verified": false,
          "category_name": "AI",
          "category_icon": "🤖",
          "category_color": "#7C3AED"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1,
      "has_prev": false,
      "has_next": false
    }
  }
}
```

### apiClient.get() 处理后的结构
由于 `apiClient.get()` 返回 `response.data`，服务层实际接收到的结构是：
```json
{
  "favorites": [...],
  "pagination": {...}
}
```

## 主要更改

### 1. 更新 UserFavorite 接口 (`src/services/userInteractionService.ts`)

**之前:**
```typescript
export interface UserFavorite {
  id: string;
  user_id: string;
  tool_id: number;
  tool: any; // Tool object
  created_at: string;
}
```

**之后:**
```typescript
export interface UserFavorite {
  id: number;
  user_id: number;
  tool_id: number;
  tool: {
    id: number;
    name: string;
    description: string;
    url: string;
    icon_url: string;
    screenshot_url?: string;
    pricing: 'free' | 'paid' | 'freemium';
    platform: 'web' | 'desktop' | 'mobile' | 'api';
    rating: number;
    views: number;
    clicks: number;
    favorites: number;
    shares: number;
    featured: boolean;
    trending: boolean;
    verified: boolean;
    category_name: string;
    category_icon: string;
    category_color: string;
  };
  created_at: string;
}
```

### 2. 更新 getUserFavorites 方法

**userInteractionService.ts:**
- 添加了对真实API结构的处理
- 支持 `has_prev` 和 `has_next` 分页字段
- 处理嵌套的 `{ favorites: [...], pagination: {...} }` 结构

**toolService.ts:**
- 更新了数据处理逻辑以适应新结构
- 添加了 `favorite_id` 和 `favorite_created_at` 字段到返回的工具对象中
- 保持向后兼容性

### 3. 更新 UserProfile 组件

**修复的问题:**
- `removeFavorite` 函数中使用正确的 `favorite.tool.id` 而不是 `favorite.tool_id`
- 收藏列表渲染中的按钮点击事件使用正确的工具ID

### 4. 更新测试文件

**favorites-test.js:**
- 添加了更详细的API结构验证
- 增加了收藏/取消收藏功能测试

**新增 favorites-structure-test.js:**
- 专门测试数据结构的验证
- 模拟真实API响应进行测试

## 数据流

1. **API调用**: `GET /api/tools/favorites`
2. **API响应**: `{ favorites: [...], pagination: {...} }`
3. **服务层处理**: `userInteractionService.getUserFavorites()` 处理响应结构
4. **组件使用**: `UserProfile` 组件接收处理后的数据
5. **渲染**: 使用 `favorite.tool` 对象渲染 `ToolCard`
6. **交互**: 使用 `favorite.tool.id` 进行收藏操作

## 兼容性

- 保持了向后兼容性，支持多种可能的API响应格式
- 如果API结构发生变化，服务层会自动适配
- 组件层使用标准化的数据结构

## 测试

运行以下命令测试更改：

```bash
# 测试API结构
node test/favorites-structure-test.js

# 测试API功能
node test/favorites-test.js
```

## 注意事项

1. **ID类型**: 所有ID字段现在都是 `number` 类型，与API保持一致
2. **嵌套结构**: 收藏对象包含完整的工具信息，减少额外的API调用
3. **分页信息**: 支持完整的分页信息，包括 `has_prev` 和 `has_next`
4. **错误处理**: 保持了原有的错误处理和回退机制