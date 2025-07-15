// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'moderator' | 'admin';
  bio?: string;
  company?: string;
  position?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

// 工具相关类型
export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  icon?: string;
  screenshot?: string;
  pricing: 'free' | 'paid' | 'freemium';
  platform: 'web' | 'desktop' | 'mobile' | 'api';
  rating: number;
  views: number;
  clicks: number;
  favorites: number;
  shares: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
  featured: boolean;
  trending: boolean;
  verified: boolean;
  submitter_id: string;
  submitter?: User;
  created_at: string;
  updated_at: string;
}

// 工具分类类型
export interface Category {
  id: string;
  name: string;
  name_en: string;
  description?: string;
  icon: string;
  color?: string;
  tools_count: number;
  created_at: string;
  updated_at: string;
}

// 工具标签类型
export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// 工具提交表单类型
export interface ToolSubmission {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: 'free' | 'paid' | 'freemium';
  platform: 'web' | 'desktop' | 'mobile' | 'api';
  icon_url?: string;
  additional_info?: string;
}

// 工具预览信息类型
export interface ToolPreview {
  url: string;
  title: string;
  description: string;
  favicon?: string;
  screenshot?: string;
  meta_tags: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    image?: string;
  };
  status: 'success' | 'error' | 'timeout';
  error_message?: string;
  created_at: string;
}

// 搜索结果类型
export interface SearchResult {
  tools: Tool[];
  categories: Category[];
  tags: Tag[];
  total: number;
  query: string;
  filters: SearchFilters;
  pagination: Pagination;
}

// 搜索过滤器类型
export interface SearchFilters {
  category?: string;
  tags?: string[];
  pricing?: 'free' | 'paid' | 'freemium';
  platform?: 'web' | 'desktop' | 'mobile' | 'api';
  rating?: number;
  sort?: 'name' | 'created_at' | 'updated_at' | 'rating' | 'views' | 'favorites';
  order?: 'asc' | 'desc';
}

// 分页类型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_prev: boolean;
  has_next: boolean;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: Pagination;
}

// 认证相关类型
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  token: string;
  expires_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// 评论类型
export interface Comment {
  id: string;
  tool_id: string;
  user_id: string;
  user: User;
  content: string;
  rating?: number;
  parent_id?: string;
  replies?: Comment[];
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

// 收藏类型
export interface Favorite {
  id: string;
  user_id: string;
  tool_id: string;
  tool: Tool;
  created_at: string;
}

// 工具统计类型
export interface ToolStats {
  total_tools: number;
  active_tools: number;
  pending_tools: number;
  featured_tools: number;
  total_users: number;
  active_users: number;
  total_categories: number;
  total_tags: number;
  monthly_submissions: number;
  monthly_views: number;
  monthly_clicks: number;
  top_categories: Array<{
    category: string;
    count: number;
  }>;
  top_tags: Array<{
    tag: string;
    count: number;
  }>;
  recent_tools: Tool[];
  trending_tools: Tool[];
}

// 用户统计类型
export interface UserStats {
  total_submissions: number;
  approved_submissions: number;
  pending_submissions: number;
  rejected_submissions: number;
  total_favorites: number;
  total_comments: number;
  total_views: number;
  join_date: string;
  last_activity: string;
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 语言类型
export type Language = 'en' | 'zh';

// 通知类型
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// 工具推荐类型
export interface ToolRecommendation {
  tool: Tool;
  score: number;
  reason: string;
  similarity_factors: {
    category: number;
    tags: number;
    description: number;
    rating: number;
  };
}

// 工具分析类型
export interface ToolAnalytics {
  tool_id: string;
  views: number;
  clicks: number;
  favorites: number;
  shares: number;
  comments: number;
  rating: number;
  daily_stats: Array<{
    date: string;
    views: number;
    clicks: number;
    favorites: number;
    shares: number;
  }>;
  referrer_stats: Array<{
    source: string;
    count: number;
  }>;
  country_stats: Array<{
    country: string;
    count: number;
  }>;
}

// 工具导入/导出类型
export interface ToolImport {
  file: File;
  format: 'json' | 'csv' | 'xlsx';
  validate_only: boolean;
}

export interface ToolExport {
  format: 'json' | 'csv' | 'xlsx' | 'pdf';
  filters?: SearchFilters;
  fields?: string[];
}

// 工具状态更新类型
export interface ToolStatusUpdate {
  tool_id: string;
  status: 'approved' | 'rejected' | 'archived';
  reason?: string;
  admin_notes?: string;
}

// 工具审核类型
export interface ToolReview {
  id: string;
  tool_id: string;
  reviewer_id: string;
  reviewer: User;
  status: 'approved' | 'rejected' | 'pending';
  score: number;
  comments: string;
  criteria: {
    accuracy: number;
    completeness: number;
    usability: number;
    performance: number;
  };
  created_at: string;
  updated_at: string;
}

// 工具更新历史类型
export interface ToolHistory {
  id: string;
  tool_id: string;
  user_id: string;
  user: User;
  action: 'created' | 'updated' | 'approved' | 'rejected' | 'archived';
  changes: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  notes?: string;
  created_at: string;
}

// 工具报告类型
export interface ToolReport {
  id: string;
  tool_id: string;
  reporter_id: string;
  reporter: User;
  reason: 'inappropriate' | 'spam' | 'broken' | 'duplicate' | 'other';
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

// 工具集合类型
export interface ToolCollection {
  id: string;
  name: string;
  description: string;
  user_id: string;
  user: User;
  tools: Tool[];
  public: boolean;
  featured: boolean;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

// 工具配置类型
export interface ToolConfig {
  id: string;
  name: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  default_value: any;
  required: boolean;
  updated_at: string;
}

// 工具API密钥类型
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  last_used: string;
  expires_at?: string;
  created_at: string;
}

// 工具Webhook类型
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  last_triggered?: string;
  created_at: string;
}

// 工具备份类型
export interface ToolBackup {
  id: string;
  name: string;
  description: string;
  data: any;
  size: number;
  format: string;
  created_at: string;
}

// 工具日志类型
export interface ToolLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: any;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// 工具性能指标类型
export interface PerformanceMetrics {
  response_time: number;
  memory_usage: number;
  cpu_usage: number;
  disk_usage: number;
  network_io: number;
  database_queries: number;
  cache_hits: number;
  errors: number;
  timestamp: string;
}

// 工具健康检查类型
export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  services: {
    database: 'up' | 'down';
    cache: 'up' | 'down';
    external_apis: 'up' | 'down';
    file_storage: 'up' | 'down';
  };
  metrics: PerformanceMetrics;
  timestamp: string;
}

// 工具队列任务类型
export interface QueueJob {
  id: string;
  name: string;
  data: any;
  priority: number;
  attempts: number;
  max_attempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// 工具缓存类型
export interface CacheEntry {
  key: string;
  value: any;
  ttl: number;
  created_at: string;
  accessed_at: string;
  hit_count: number;
}

// 工具会话类型
export interface Session {
  id: string;
  user_id: string;
  data: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

// 工具活动类型
export interface Activity {
  id: string;
  user_id: string;
  user: User;
  type: string;
  description: string;
  metadata?: any;
  created_at: string;
}

// 工具事件类型
export interface Event {
  id: string;
  type: string;
  data: any;
  user_id?: string;
  ip_address?: string;
  created_at: string;
}

// 工具角色权限类型
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  created_at: string;
}

// 工具审计日志类型
export interface AuditLog {
  id: string;
  user_id: string;
  user: User;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: any;
  new_values?: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// 表单验证类型
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormState {
  loading: boolean;
  errors: ValidationError[];
  success: boolean;
  message?: string;
}

// 组件属性类型
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 模态框类型
export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// 按钮类型
export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// 输入框类型
export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

// 选择框类型
export interface SelectProps extends ComponentProps {
  options: Array<{
    value: string;
    label: string;
  }>;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

// 搜索框类型
export interface SearchProps extends ComponentProps {
  value?: string;
  placeholder?: string;
  debounce?: number;
  onSearch?: (query: string) => void;
  onClear?: () => void;
}

// 分页组件类型
export interface PaginationProps extends ComponentProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

// 卡片组件类型
export interface CardProps extends ComponentProps {
  title?: string;
  description?: string;
  image?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

// 标签组件类型
export interface TagProps extends ComponentProps {
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  onClose?: () => void;
}

// 头像组件类型
export interface AvatarProps extends ComponentProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  online?: boolean;
}

// 徽章组件类型
export interface BadgeProps extends ComponentProps {
  count?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  dot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// 工具提示类型
export interface TooltipProps extends ComponentProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
}

// 下拉菜单类型
export interface DropdownProps extends ComponentProps {
  trigger: React.ReactNode;
  items: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }>;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

// 抽屉组件类型
export interface DrawerProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// 面包屑类型
export interface BreadcrumbProps extends ComponentProps {
  items: Array<{
    title: string;
    href?: string;
    icon?: React.ReactNode;
  }>;
  separator?: React.ReactNode;
}

// 步骤条类型
export interface StepsProps extends ComponentProps {
  current: number;
  steps: Array<{
    title: string;
    description?: string;
    icon?: React.ReactNode;
    status?: 'wait' | 'process' | 'finish' | 'error';
  }>;
  direction?: 'horizontal' | 'vertical';
  onChange?: (current: number) => void;
}

// 时间轴类型
export interface TimelineProps extends ComponentProps {
  items: Array<{
    time: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  }>;
  mode?: 'left' | 'right' | 'alternate';
}

// 统计卡片类型
export interface StatCardProps extends ComponentProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

// 图表类型
export interface ChartProps extends ComponentProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: any[];
  width?: number;
  height?: number;
  options?: any;
}

// 表格类型
export interface TableProps extends ComponentProps {
  columns: Array<{
    key: string;
    title: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    render?: (value: any, record: any) => React.ReactNode;
  }>;
  data: any[];
  loading?: boolean;
  pagination?: PaginationProps;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onRowClick?: (record: any) => void;
}

// 文件上传类型
export interface UploadProps extends ComponentProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
  onUpload?: (files: File[]) => void;
  onRemove?: (file: File) => void;
  onError?: (error: string) => void;
}

// 编辑器类型
export interface EditorProps extends ComponentProps {
  value?: string;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
  language?: string;
  theme?: 'light' | 'dark';
  onChange?: (value: string) => void;
}

// 日历类型
export interface CalendarProps extends ComponentProps {
  value?: Date;
  mode?: 'single' | 'multiple' | 'range';
  disabled?: (date: Date) => boolean;
  onChange?: (date: Date | Date[]) => void;
}

// 颜色选择器类型
export interface ColorPickerProps extends ComponentProps {
  value?: string;
  presets?: string[];
  showAlpha?: boolean;
  onChange?: (color: string) => void;
}

// 评分组件类型
export interface RatingProps extends ComponentProps {
  value?: number;
  max?: number;
  readonly?: boolean;
  allowHalf?: boolean;
  character?: React.ReactNode;
  onChange?: (value: number) => void;
}

// 进度条类型
export interface ProgressProps extends ComponentProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showText?: boolean;
  striped?: boolean;
  animated?: boolean;
}

// 骨架屏类型
export interface SkeletonProps extends ComponentProps {
  loading?: boolean;
  lines?: number;
  height?: number;
  width?: number | string;
  animated?: boolean;
}

// 空状态类型
export interface EmptyProps extends ComponentProps {
  image?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

// 错误边界类型
export interface ErrorBoundaryProps extends ComponentProps {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

// 虚拟滚动类型
export interface VirtualScrollProps extends ComponentProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  onScroll?: (scrollTop: number) => void;
}

// 无限滚动类型
export interface InfiniteScrollProps extends ComponentProps {
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  onLoadMore?: () => void;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
} 