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
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived'
  featured: boolean
  trending: boolean
  verified: boolean
  submitter_id: number
  pricing: 'free' | 'paid' | 'freemium'
  platform: 'web' | 'desktop' | 'mobile' | 'api'
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
    
    if (params?.q) queryParams.append('search', params.q)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.tags?.length) queryParams.append('tags', params.tags.join(','))
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.featured) queryParams.append('featured', 'true')

    const url = `${API_ENDPOINTS.tools.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await apiClient.get<any>(url)
    
    // 处理hai-backend的响应格式
    if (response.success && response.data) {
      return {
        tools: response.data.tools || [],
        total: response.data.pagination?.total || 0,
        page: response.data.pagination?.page || 1,
        limit: response.data.pagination?.limit || 20,
        totalPages: response.data.pagination?.totalPages || 0
      }
    }
    
    // 如果直接返回工具数组
    if (Array.isArray(response)) {
      return {
        tools: response,
        total: response.length,
        page: 1,
        limit: response.length,
        totalPages: 1
      }
    }
    
    return {
      tools: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0
    }
  }

  // 获取精选工具
  async getFeaturedTools(): Promise<ApiResponse<Tool[]>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.tools.featured)
    
    // 处理hai-backend的响应格式
    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data.tools) ? response.data.tools : response.data
      }
    }
    
    // 如果直接返回工具数组
    if (Array.isArray(response)) {
      return {
        success: true,
        data: response
      }
    }
    
    return {
      success: false,
      data: []
    }
  }

  // 获取热门工具
  async getTrendingTools(): Promise<ApiResponse<Tool[]>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.tools.trending)
    
    // 处理hai-backend的响应格式
    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data.tools) ? response.data.tools : response.data
      }
    }
    
    // 如果直接返回工具数组
    if (Array.isArray(response)) {
      return {
        success: true,
        data: response
      }
    }
    
    return {
      success: false,
      data: []
    }
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
    const response = await apiClient.get<any>(`${API_ENDPOINTS.tools.categories}?include_stats=true`)
    
    // 处理hai-backend的响应格式
    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      }
    }
    
    // 如果直接返回分类数组
    if (Array.isArray(response)) {
      return {
        success: true,
        data: response
      }
    }
    
    return {
      success: false,
      data: []
    }
  }

  // 获取分类下的工具
  async getToolsByCategory(categoryId: number, params?: SearchParams): Promise<ToolsResponse> {
    return this.getTools({ ...params, category: categoryId.toString() })
  }

  // 获取标签列表
  async getTags(): Promise<ApiResponse<string[]>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.tools.tags)
    
    // 处理hai-backend的响应格式
    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      }
    }
    
    // 如果直接返回标签数组
    if (Array.isArray(response)) {
      return {
        success: true,
        data: response
      }
    }
    
    return {
      success: false,
      data: []
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

  // 获取用户收藏的工具
  async getUserFavorites(): Promise<ApiResponse<Tool[]>> {
    try {
      const response = await apiClient.get<any>('/api/tools/favorites')
      console.log('Raw favorites response:', response)
      
      // 处理hai-backend的响应格式
      if (response.success && response.data) {
        // 新的响应格式：{ data: { favorites: [...] } }
        if (response.data.data?.favorites && Array.isArray(response.data.data.favorites)) {
          const tools = response.data.data.favorites.map((fav: any) => {
            // 处理嵌套结构：favorites包含tool对象
            if (fav.tool) {
              return {
                ...fav.tool,
                id: fav.tool.id || fav.tool_id,
                user_id: fav.user_id,
                created_at: fav.created_at
              };
            } else {
              return fav;
            }
          });
          return {
            success: true,
            data: tools
          };
        }
        
        // 标准格式：{ favorites: [...] }
        if (response.data.favorites && Array.isArray(response.data.favorites)) {
          const tools = response.data.favorites.map((fav: any) => {
            if (fav.tool) {
              return {
                ...fav.tool,
                id: fav.tool.id || fav.tool_id,
                user_id: fav.user_id,
                created_at: fav.created_at
              };
            } else {
              return fav;
            }
          });
          return {
            success: true,
            data: tools
          };
        }
        
        // 直接返回工具数组
        if (Array.isArray(response.data)) {
          return {
            success: true,
            data: response.data
          };
        }
        
        // 其他格式
        if (Array.isArray(response)) {
          return {
            success: true,
            data: response
          };
        }
      }
      
      console.warn('Unexpected favorites response format:', response)
      return {
        success: false,
        data: []
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
      return {
        success: false,
        data: []
      }
    }
  }

  // 添加到收藏
  async addToFavorites(toolId: number): Promise<void> {
    return apiClient.post(`/api/tools/${toolId}/favorite`)
  }

  // 从收藏中移除
  async removeFromFavorites(toolId: number): Promise<void> {
    return apiClient.delete(`/api/tools/${toolId}/favorite`)
  }

  // 检查是否已收藏
  async isFavorited(toolId: number): Promise<boolean> {
    try {
      const response = await apiClient.get(`/api/tools/${toolId}/favorite/status`) as any
      return response.data?.is_favorite || false
    } catch (error) {
      return false
    }
  }
}

export const toolService = new ToolService()
export default toolService 