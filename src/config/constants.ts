// 应用配置
export const APP_CONFIG = {
  name: 'Hai ToolSet',
  description: 'High availability tool set navigation site',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
  version: '1.0.0',
  author: 'HAI Team',
  email: 'support@hai-toolset.com',
  social: {
    twitter: 'https://twitter.com/hai_toolset',
    github: 'https://github.com/hai-toolset',
    linkedin: 'https://linkedin.com/company/hai-toolset'
  }
};

// API 端点
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    verifyToken: '/api/auth/verify-token',
    verifyEmail: '/api/auth/verify-email',
    resetPassword: '/api/auth/reset-password',
    github: '/api/auth/github'
  },
  users: {
    profile: '/api/users/me',
    updateProfile: '/api/users/me',
    changePassword: '/api/users/me/password',
    settings: '/api/users/me/settings'
  },
  tools: {
    list: '/api/tools',
    create: '/api/tools',
    update: '/api/tools',
    delete: '/api/tools',
    categories: '/api/tool-categories',
    tags: '/api/tools/tags',
    search: '/api/tools/search',
    featured: '/api/tools/featured',
    trending: '/api/tools/trending',
    submit: '/api/tools/submit',
    preview: '/api/tool-previews'
  },
  admin: {
    dashboard: '/api/admin/dashboard',
    users: '/api/admin/users',
    tools: '/api/admin/tools',
    categories: '/api/admin/categories',
    analytics: '/api/admin/analytics'
  }
};

// 工具分类
export const TOOL_CATEGORIES = [
  { id: 'development', name: '开发工具', name_en: 'Development', icon: '💻' },
  { id: 'design', name: '设计工具', name_en: 'Design', icon: '🎨' },
  { id: 'productivity', name: '生产力工具', name_en: 'Productivity', icon: '⚡' },
  { id: 'marketing', name: '营销工具', name_en: 'Marketing', icon: '📊' },
  { id: 'analytics', name: '分析工具', name_en: 'Analytics', icon: '📈' },
  { id: 'security', name: '安全工具', name_en: 'Security', icon: '🔒' },
  { id: 'communication', name: '沟通工具', name_en: 'Communication', icon: '💬' },
  { id: 'finance', name: '财务工具', name_en: 'Finance', icon: '💰' },
  { id: 'education', name: '教育工具', name_en: 'Education', icon: '📚' },
  { id: 'ai', name: 'AI工具', name_en: 'AI Tools', icon: '🤖' },
  { id: 'other', name: '其他工具', name_en: 'Other', icon: '🔧' }
];

// 工具标签
export const TOOL_TAGS = [
  'free', 'paid', 'open-source', 'web-based', 'desktop', 'mobile',
  'api', 'integration', 'collaboration', 'automation', 'cloud',
  'real-time', 'dashboard', 'analytics', 'reporting', 'monitoring'
];

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPageSize: 100
};

// 搜索配置
export const SEARCH_CONFIG = {
  minQueryLength: 2,
  maxQueryLength: 100,
  debounceDelay: 300,
  maxResults: 50
};

// 本地存储键名
export const STORAGE_KEYS = {
  authToken: 'toolset_token',
  user: 'toolset_user',
  theme: 'toolset_theme',
  language: 'toolset_language',
  searchHistory: 'toolset_search_history',
  favorites: 'toolset_favorites',
  recentlyViewed: 'toolset_recently_viewed'
};

// 主题配置
export const THEME_CONFIG = {
  defaultTheme: 'light',
  themes: ['light', 'dark', 'system']
};

// 语言配置
export const LANGUAGE_CONFIG = {
  defaultLanguage: 'en',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' }
  ]
};

// 文件上传配置
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles: 5
};

// 工具状态
export const TOOL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived'
};

// 用户角色
export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// 权限定义
export const PERMISSIONS = {
  TOOLS: {
    CREATE: 'tools:create',
    READ: 'tools:read',
    UPDATE: 'tools:update',
    DELETE: 'tools:delete',
    APPROVE: 'tools:approve'
  },
  USERS: {
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    MANAGE: 'users:manage'
  },
  ADMIN: {
    DASHBOARD: 'admin:dashboard',
    ANALYTICS: 'admin:analytics',
    SETTINGS: 'admin:settings'
  }
};

// 通知类型
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// 工具评级
export const TOOL_RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0
};

// 工具预览配置
export const PREVIEW_CONFIG = {
  timeout: 10000, // 10秒超时
  maxRetries: 3,
  screenshotDelay: 2000, // 2秒延迟
  viewport: {
    width: 1280,
    height: 720
  }
};

// 缓存配置
export const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5分钟
  searchTTL: 60 * 1000, // 1分钟
  userTTL: 15 * 60 * 1000, // 15分钟
  toolsTTL: 10 * 60 * 1000 // 10分钟
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error, please try again',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Permission denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Server error, please try again later'
};

// 成功消息
export const SUCCESS_MESSAGES = {
  TOOL_CREATED: 'Tool created successfully',
  TOOL_UPDATED: 'Tool updated successfully',
  TOOL_DELETED: 'Tool deleted successfully',
  USER_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_VERIFIED: 'Email verified successfully'
};

// 社交分享配置
export const SOCIAL_SHARE_CONFIG = {
  twitter: {
    via: 'hai_toolset',
    hashtags: ['tools', 'productivity', 'webdev']
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
  },
  linkedin: {
    title: 'Check out this amazing tool',
    summary: 'Discover high-quality tools for your projects'
  }
};

// SEO配置
export const SEO_CONFIG = {
  defaultTitle: 'Hai ToolSet - High Availability Tool Set',
  titleTemplate: '%s | Hai ToolSet',
  defaultDescription: 'Discover and share high-quality tools for developers, designers, and creators',
  keywords: ['tools', 'productivity', 'development', 'design', 'utilities', 'resources'],
  author: 'HAI Team',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Hai ToolSet'
  },
  twitter: {
    handle: '@hai_toolset',
    site: '@hai_toolset',
    cardType: 'summary_large_image'
  }
};

// 分析配置
export const ANALYTICS_CONFIG = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  events: {
    TOOL_VIEW: 'tool_view',
    TOOL_CLICK: 'tool_click',
    SEARCH: 'search',
    CATEGORY_FILTER: 'category_filter',
    TAG_FILTER: 'tag_filter',
    SHARE: 'share',
    FAVORITE: 'favorite',
    SUBMIT_TOOL: 'submit_tool'
  }
};

// 工具提交表单配置
export const TOOL_FORM_CONFIG = {
  name: {
    minLength: 2,
    maxLength: 100,
    required: true
  },
  description: {
    minLength: 10,
    maxLength: 500,
    required: true
  },
  url: {
    required: true,
    pattern: /^https?:\/\/.+/
  },
  tags: {
    maxCount: 10,
    maxLength: 20
  },
  category: {
    required: true
  }
};

// 工具导出格式
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  XML: 'xml'
};

// 工具排序选项
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name', label_zh: '名称' },
  { value: 'created_at', label: 'Date Added', label_zh: '添加时间' },
  { value: 'updated_at', label: 'Last Updated', label_zh: '更新时间' },
  { value: 'rating', label: 'Rating', label_zh: '评分' },
  { value: 'views', label: 'Views', label_zh: '浏览量' },
  { value: 'favorites', label: 'Favorites', label_zh: '收藏数' }
];

// 工具筛选选项
export const FILTER_OPTIONS = {
  status: ['all', 'approved', 'pending', 'rejected'],
  pricing: ['all', 'free', 'paid', 'freemium'],
  platform: ['all', 'web', 'desktop', 'mobile', 'api']
};

// 工具详情页标签
export const TOOL_DETAIL_TABS = [
  { id: 'overview', label: 'Overview', label_zh: '概述' },
  { id: 'features', label: 'Features', label_zh: '功能' },
  { id: 'reviews', label: 'Reviews', label_zh: '评价' },
  { id: 'similar', label: 'Similar Tools', label_zh: '相似工具' },
  { id: 'changelog', label: 'Changelog', label_zh: '更新日志' }
];

// 工具统计字段
export const TOOL_STATS_FIELDS = [
  'views',
  'clicks',
  'favorites',
  'shares',
  'submissions',
  'rating'
];

// 管理员仪表板小部件
export const ADMIN_DASHBOARD_WIDGETS = [
  { id: 'total_tools', title: 'Total Tools', title_zh: '工具总数' },
  { id: 'pending_tools', title: 'Pending Review', title_zh: '待审核' },
  { id: 'active_users', title: 'Active Users', title_zh: '活跃用户' },
  { id: 'monthly_submissions', title: 'Monthly Submissions', title_zh: '月度提交' },
  { id: 'popular_categories', title: 'Popular Categories', title_zh: '热门分类' },
  { id: 'recent_activity', title: 'Recent Activity', title_zh: '最近活动' }
];

// 响应式断点
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// 动画持续时间
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
};

// 颜色主题
export const COLOR_THEMES = {
  primary: 'hsl(222.2 47.4% 11.2%)',
  secondary: 'hsl(210 40% 96%)',
  accent: 'hsl(210 40% 96%)',
  destructive: 'hsl(0 84.2% 60.2%)',
  success: 'hsl(142 71% 45%)',
  warning: 'hsl(38 92% 50%)',
  info: 'hsl(199 89% 48%)'
};

// 工具图标映射
export const TOOL_ICONS = {
  development: '💻',
  design: '🎨',
  productivity: '⚡',
  marketing: '📊',
  analytics: '📈',
  security: '🔒',
  communication: '💬',
  finance: '💰',
  education: '📚',
  ai: '🤖',
  other: '🔧'
};

// 工具徽章
export const TOOL_BADGES = {
  featured: { label: 'Featured', color: 'primary' },
  popular: { label: 'Popular', color: 'success' },
  trending: { label: 'Trending', color: 'warning' },
  new: { label: 'New', color: 'info' },
  updated: { label: 'Updated', color: 'secondary' }
};

// 工具提交状态
export const SUBMISSION_STATUS = {
  DRAFT: { label: 'Draft', color: 'muted' },
  SUBMITTED: { label: 'Submitted', color: 'info' },
  REVIEWING: { label: 'Under Review', color: 'warning' },
  APPROVED: { label: 'Approved', color: 'success' },
  REJECTED: { label: 'Rejected', color: 'destructive' },
  PUBLISHED: { label: 'Published', color: 'primary' }
};

// 工具质量评分标准
export const QUALITY_METRICS = {
  completeness: { weight: 0.3, label: 'Completeness' },
  accuracy: { weight: 0.25, label: 'Accuracy' },
  usability: { weight: 0.25, label: 'Usability' },
  performance: { weight: 0.2, label: 'Performance' }
};

// 默认用户头像
export const DEFAULT_AVATAR = '/images/default-avatar.png';

// 工具截图配置
export const SCREENSHOT_CONFIG = {
  width: 1200,
  height: 800,
  quality: 85,
  format: 'webp',
  timeout: 30000
};

// 工具验证规则
export const VALIDATION_RULES = {
  url: {
    required: true,
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/
  }
};

// 工具导入配置
export const IMPORT_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['json', 'csv', 'xlsx'],
  batchSize: 100,
  timeout: 60000
};

// 工具导出配置
export const EXPORT_CONFIG = {
  formats: ['json', 'csv', 'xlsx', 'pdf'],
  maxRecords: 10000,
  timeout: 120000
};

// 工具推荐算法配置
export const RECOMMENDATION_CONFIG = {
  maxResults: 10,
  similarity: {
    category: 0.4,
    tags: 0.3,
    description: 0.2,
    rating: 0.1
  }
};

// 工具搜索权重
export const SEARCH_WEIGHTS = {
  title: 3,
  description: 2,
  tags: 1.5,
  category: 1,
  content: 0.5
};

// 工具状态颜色
export const STATUS_COLORS = {
  active: 'green',
  inactive: 'gray',
  pending: 'yellow',
  suspended: 'red',
  maintenance: 'orange'
};

// 工具访问统计
export const ACCESS_STATS = {
  trackViews: true,
  trackClicks: true,
  trackSearches: true,
  trackShares: true,
  trackFavorites: true
};

// 工具缓存策略
export const CACHE_STRATEGIES = {
  tools: {
    ttl: 300000, // 5分钟
    strategy: 'stale-while-revalidate'
  },
  categories: {
    ttl: 3600000, // 1小时
    strategy: 'cache-first'
  },
  user: {
    ttl: 900000, // 15分钟
    strategy: 'network-first'
  }
};

// 工具API限制
export const API_LIMITS = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 每个IP最多100次请求
  },
  upload: {
    maxSize: '10mb',
    maxFiles: 5
  },
  search: {
    maxQueryLength: 200,
    maxResults: 100
  }
};

// 工具通知设置
export const NOTIFICATION_SETTINGS = {
  email: {
    newTool: true,
    toolUpdate: true,
    toolApproval: true,
    toolRejection: true,
    newsletter: false
  },
  push: {
    enabled: false,
    newTool: false,
    toolUpdate: false
  }
};

// 工具安全设置
export const SECURITY_SETTINGS = {
  csrfProtection: true,
  rateLimiting: true,
  inputValidation: true,
  outputSanitization: true,
  fileUploadSecurity: true
};

// 工具监控配置
export const MONITORING_CONFIG = {
  healthCheck: {
    enabled: true,
    interval: 60000, // 1分钟
    timeout: 10000   // 10秒
  },
  metrics: {
    enabled: true,
    interval: 300000 // 5分钟
  },
  logging: {
    level: 'info',
    format: 'json',
    retention: 30 // 30天
  }
}; 