'use client'

import { Suspense, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Grid, List } from 'lucide-react'
import Layout from '../../src/components/Layout'
import ToolCard from '../../src/components/ToolCard'
import LoadingSpinner from '../../src/components/ui/LoadingSpinner'
import Categories from '../../src/components/Categories'
import { toolService } from '../../src/services/toolService'
import type { Tool, Category } from '../../src/services/toolService'

export default function ToolsPage() {
  const { t } = useTranslation()
  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 同时获取工具和分类
        const [toolsResponse, categoriesResponse] = await Promise.all([
          toolService.getTools({
            page,
            limit: 20,
            q: searchTerm || undefined,
            category: selectedCategory === 'all' ? undefined : selectedCategory
          }),
          toolService.getCategories()
        ])
        
        // 设置工具数据
        if (toolsResponse) {
          setTools(toolsResponse.tools || [])
          setTotalPages(toolsResponse.totalPages || 1)
        }
        
        // 设置分类数据
        if (categoriesResponse && categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data)
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
  }, [page, searchTerm, selectedCategory])
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // 重置到第一页
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1) // 重置到第一页
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('tools.title', 'All Tools')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('tools.subtitle', 'Discover our comprehensive collection of productivity and development tools designed to enhance your workflow')}
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <form onSubmit={handleSearch}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('tools.searchPlaceholder', 'Search tools...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm bg-background/80 backdrop-blur rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                    />
                  </form>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-4 py-3 bg-background/80 backdrop-blur rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm min-w-[140px]"
                  >
                    <option value="all">{t('tools.allCategories', 'All Categories')}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex bg-background/80 backdrop-blur rounded-xl border border-border p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid/List */}
        <div className="container mx-auto px-4 py-12">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {loading ? 
                t('tools.loading', 'Loading tools...') :
                t('tools.resultsCount', `Showing ${tools.length} tools`)
              }
            </p>
          </div>

          {/* Tools Display */}
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
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {tools.map((tool) => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    viewMode={viewMode}
                    onView={handleToolView}
                    onShare={handleToolShare}
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

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('tools.browseCategories', 'Browse by Category')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('tools.browseCategoriesDesc', 'Explore tools organized by category to find exactly what you need')}
              </p>
            </div>
            <Categories />
          </div>
        </section>
      </div>
    </Layout>
  )
}