'use client'

import { Suspense, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Grid, List, Send, Star, TrendingUp, Crown, Zap } from 'lucide-react'
import Link from 'next/link'
import Layout from '../../src/components/Layout'
import ToolCard from '../../src/components/ToolCard'
import LoadingSpinner from '../../src/components/ui/LoadingSpinner'
import SearchDropdown from '../../src/components/SearchDropdown'
import { toolService } from '../../src/services/toolService'
import type { Tool, Category } from '../../src/services/toolService'

export default function ToolsPage() {
  const { t } = useTranslation()
  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Initialize selectedCategory from hash if it exists
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash && hash.includes('category=')) {
        const match = hash.match(/category=([^&]+)/)
        if (match && match[1]) {
          return match[1]
        }
      }
    }
    return 'all'
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'trending'>('all')

  // 监听hash变化以更新category
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash && hash.includes('category=')) {
        const match = hash.match(/category=([^&]+)/)
        if (match && match[1]) {
          setSelectedCategory(match[1])
          // Reset to page 1 when category changes
          setPage(1)
        }
      } else {
        setSelectedCategory('all')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // 更新hash当category改变时
  useEffect(() => {
    if (selectedCategory !== 'all') {
      window.history.replaceState(null, '', `#category=${selectedCategory}`)
    } else {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [selectedCategory])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 根据选择的标签获取不同的数据
        let toolsResponse
        
        // 如果有特定的category选择，则忽略activeTab
        if (selectedCategory !== 'all') {
          toolsResponse = await toolService.getTools({
            page,
            limit: 24, // 增加每页显示数量
            q: searchTerm || undefined,
            category: selectedCategory
          })
        } else {
          // 根据activeTab获取数据
          switch (activeTab) {
            case 'featured':
              const featuredResponse = await toolService.getFeaturedTools()
              if (featuredResponse.success) {
                toolsResponse = {
                  tools: featuredResponse.data,
                  total: featuredResponse.data.length,
                  page: 1,
                  limit: featuredResponse.data.length,
                  totalPages: 1
                }
              }
              break
            case 'trending':
              const trendingResponse = await toolService.getTrendingTools()
              if (trendingResponse.success) {
                toolsResponse = {
                  tools: trendingResponse.data,
                  total: trendingResponse.data.length,
                  page: 1,
                  limit: trendingResponse.data.length,
                  totalPages: 1
                }
              }
              break
            default:
              toolsResponse = await toolService.getTools({
                page,
                limit: 24, // 增加每页显示数量
                q: searchTerm || undefined,
                category: undefined
              })
          }
        }
        
        // 获取分类数据
        const categoriesResponse = await toolService.getCategories()
        
        // 设置工具数据
        if (toolsResponse) {
          setTools(toolsResponse.tools || [])
          setTotalPages(toolsResponse.totalPages || 1)
        }
        
        // 设置分类数据
        if (categoriesResponse && categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data.slice(0, 12)) // 只显示前12个分类
        }
        
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load tools. Please try again later.')
        setTools([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, searchTerm, selectedCategory, activeTab])

  const handleToolView = async (toolId: number) => {
    try {
      await toolService.recordView(toolId)
    } catch (err) {
      console.error('Failed to record view:', err)
    }
  }

  const handleToolShare = async (toolId: number) => {
    try {
      await toolService.recordShare(toolId)
      const tool = tools.find(t => t.id === toolId)
      if (tool) {
        const shareUrl = `${window.location.origin}/tools/${toolId}`
        await navigator.clipboard.writeText(shareUrl)
      }
    } catch (err) {
      console.error('Failed to share tool:', err)
    }
  }

  const handleToolFavorite = async (toolId: number) => {
    try {
      // The ToolCard component handles the actual API calls
      // This is just a callback to refresh the tools list if needed
      console.log('Favorite toggled for tool:', toolId)
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // 重置到第一页
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1) // 重置到第一页
    setActiveTab('all') // 当选择分类时，重置标签为all
  }

  const handleTabChange = (tab: 'all' | 'featured' | 'trending') => {
    setActiveTab(tab)
    setPage(1)
    setSearchTerm('')
    setSelectedCategory('all')
    // 清除hash参数
    window.history.replaceState(null, '', window.location.pathname)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Compact Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('tools.title', 'All Tools')}
                </h1>
                <p className="text-muted-foreground">
                  {t('tools.subtitle', 'Discover our comprehensive collection of productivity tools')}
                </p>
              </div>
              
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <SearchDropdown 
                  placeholder={t('tools.searchPlaceholder', 'Search tools...')}
                  className="flex-1 lg:w-80"
                />
                <Link
                  href="/submit-tool"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium whitespace-nowrap"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('tools.submitTool', 'Submit')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Category Filter Tabs */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-card rounded-xl border p-4 sticky top-20">
                <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === 'all' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id.toString())}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        selectedCategory === category.id.toString() 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs opacity-70">{category.tool_count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Tab Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => handleTabChange('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'all' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All Tools
                  </button>
                  <button
                    onClick={() => handleTabChange('featured')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === 'featured' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Crown className="h-4 w-4" />
                    Featured
                  </button>
                  <button
                    onClick={() => handleTabChange('trending')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === 'trending' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {loading ? 'Loading...' : `${tools.length} tools`}
                  </span>
                  <div className="flex bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tools Grid/List */}
              <Suspense fallback={<LoadingSpinner />}>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : tools.length > 0 ? (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {tools.map((tool) => (
                      <ToolCard 
                        key={tool.id} 
                        tool={tool} 
                        viewMode={viewMode}
                        variant={viewMode === 'grid' ? 'compact' : 'default'}
                        onView={handleToolView}
                        onShare={handleToolShare}
                        onFavorite={handleToolFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {t('tools.noResults', 'No tools found')}
                      </h3>
                      <p className="text-muted-foreground">
                        {t('tools.noResultsDesc', 'Try adjusting your search terms or filters')}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                        setPage(1)
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {t('tools.clearFilters', 'Clear Filters')}
                    </button>
                  </div>
                )}
              </Suspense>
              
              {/* Pagination */}
              {!loading && !error && totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}