import { apiClient } from './apiClient'
import { API_ENDPOINTS } from '../config/constants'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface Tool {
  id: number
  name: string
  description: string
  url: string
  category_id: number
  category_name?: string
  category_icon?: string
  category_color?: string
  tags: string[]
  rating?: number
  views: number
  clicks: number
  shares: number
  favorites: number
  featured: boolean
  trending: boolean
  verified: boolean
  pricing: 'free' | 'paid' | 'freemium'
  platform: string
  icon_url: string 
  created_at: string
  updated_at: string
  user_id?: number
  screenshot_url?: string
  logo_url?: string
}

export interface Category {
  id: number
  name: string
  description: string
  icon?: string
  color?: string
  tool_count: number
  created_at: string
  updated_at: string
}

export interface ToolsResponse {
  tools: Tool[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchParams {
  q?: string
  category?: string
  tags?: string[]
  page?: number
  limit?: number
  sort?: 'relevance' | 'popular' | 'rating' | 'newest' | 'updated'
  featured?: boolean
}

class ToolService {
  // 获取工具列表
  async getTools(params?: SearchParams): Promise<ToolsResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.q) queryParams.append('q', params.q)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.tags?.length) queryParams.append('tags', params.tags.join(','))
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.featured) queryParams.append('featured', 'true')

    const url = `${API_ENDPOINTS.tools.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get<ToolsResponse>(url)
  }

  // 获取精选工具
  async getFeaturedTools(): Promise<ApiResponse<Tool[]>> {
    return apiClient.get<ApiResponse<Tool[]>>(API_ENDPOINTS.tools.featured)
  }

  // 获取热门工具
  async getTrendingTools(): Promise<ApiResponse<Tool[]>> {
    return apiClient.get<ApiResponse<Tool[]>>(API_ENDPOINTS.tools.trending)
  }

  // 搜索工具
  async searchTools(query: string, params?: Omit<SearchParams, 'q'>): Promise<ToolsResponse> {
    return this.getTools({ ...params, q: query })
  }

  // 获取单个工具详情
  async getToolById(id: number): Promise<Tool> {
    return apiClient.get<Tool>(`${API_ENDPOINTS.tools.list}/${id}`)
  }

  // 记录工具点击
  async recordClick(toolId: number): Promise<void> {
    return apiClient.post(`${API_ENDPOINTS.tools.list}/${toolId}/click`)
  }

  // 记录工具查看
  async recordView(toolId: number): Promise<void> {
    return apiClient.post(`${API_ENDPOINTS.tools.list}/${toolId}/view`)
  }

  // 记录工具分享
  async recordShare(toolId: number): Promise<void> {
    return apiClient.post(`${API_ENDPOINTS.tools.list}/${toolId}/share`)
  }

  // 获取工具统计
  async getToolStats(toolId: number): Promise<{
    views: number
    clicks: number
    shares: number
    rating: number
  }> {
    return apiClient.get(`${API_ENDPOINTS.tools.list}/${toolId}/stats`)
  }

  // 提交新工具
  async submitTool(toolData: {
    name: string
    description: string
    url: string
    category_id: number
    tags: string[]
  }): Promise<Tool> {
    return apiClient.post<Tool>(API_ENDPOINTS.tools.create, toolData)
  }

  // 获取分类列表
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      return await apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.tools.categories)
    } catch (error) {
      console.warn('Categories API not available, using mock data')
      // 返回模拟数据
      return {
        success: true,
        data: [
          { id: 1, name: 'Development', description: 'Development tools and utilities', icon: '💻', color: 'blue', tool_count: 45, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
          { id: 2, name: 'Design', description: 'Design and creative tools', icon: '🎨', color: 'purple', tool_count: 32, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
          { id: 3, name: 'Productivity', description: 'Productivity and organization tools', icon: '⚡', color: 'green', tool_count: 28, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
          { id: 4, name: 'AI Tools', description: 'Artificial intelligence tools', icon: '🤖', color: 'indigo', tool_count: 15, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
          { id: 5, name: 'Utilities', description: 'General utilities and helpers', icon: '🔧', color: 'gray', tool_count: 20, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
        ]
      }
    }
  }

  // 获取分类下的工具
  async getToolsByCategory(categoryId: number, params?: SearchParams): Promise<ToolsResponse> {
    return this.getTools({ ...params, category: categoryId.toString() })
  }

  // 获取标签列表
  async getTags(): Promise<ApiResponse<string[]>> {
    try {
      return await apiClient.get<ApiResponse<string[]>>(API_ENDPOINTS.tools.tags)
    } catch (error) {
      console.warn('Tags API not available, using mock data')
      // 返回模拟数据
      return {
        success: true,
        data: [
          'free', 'paid', 'freemium', 'open-source', 'web-based', 'desktop', 'mobile',
          'api', 'integration', 'collaboration', 'automation', 'cloud', 'real-time',
          'dashboard', 'analytics', 'reporting', 'monitoring', 'development', 'design',
          'productivity', 'ai', 'machine-learning', 'coding', 'ui-ux', 'frontend',
          'backend', 'database', 'security', 'testing', 'deployment'
        ]
      }
    }
  }

  // 获取工具预览
  async getToolPreview(url: string): Promise<{
    title: string
    description: string
    image: string
    favicon: string
  }> {
    return apiClient.post(API_ENDPOINTS.tools.preview, { url })
  }
}

export const toolService = new ToolService()
export default toolService 