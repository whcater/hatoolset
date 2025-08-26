'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Heart, 
  Star, 
  Trash2, 
  Share2, 
  Download, 
  Filter, 
  User, 
  ExternalLink,
  Folder,
  FolderOpen,
  Search,
  Grid3X3,
  List,
  Plus,
  MoreHorizontal,
  Eye,
  ChevronRight,
  Bookmark,
  CheckSquare,
  Square,
  Move,
  Clock,
  TrendingUp as TrendingUpIcon,
  Zap,
  Tag,
  Globe,
  Image,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import Layout from '../../src/components/Layout'
import ToolCard from '../../src/components/ToolCard'
import LoadingSpinner from '../../src/components/ui/LoadingSpinner'
import { useAuth } from '../../src/contexts/AuthContext'
import { toolService } from '../../src/services/toolService'
import type { Tool } from '../../src/services/toolService'

export default function FavoritesPage() {
  const { t } = useTranslation()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<Tool[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'bookmarks' | 'grid'>('bookmarks')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [selectedTool, setSelectedTool] = useState<number | null>(null)
  
  // Batch operations
  const [selectedTools, setSelectedTools] = useState<Set<number>>(new Set())
  const [isBatchMode, setIsBatchMode] = useState(false)
  
  // Smart groupings
  const [showSmartGroups, setShowSmartGroups] = useState(true)

  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'category', label: 'Category' },
    { value: 'usage', label: 'Most Used' }
  ]

  // Smart grouping logic
  const getSmartGroups = () => {
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
    
    return {
      recentlyAdded: favorites.filter(tool => 
        new Date(tool.created_at).getTime() > oneWeekAgo
      ).slice(0, 5),
      mostUsed: favorites
        .filter(tool => tool.views > 0)
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
      trending: favorites
        .filter(tool => tool.featured || tool.views > 1000)
        .slice(0, 5),
    }
  }

  // Keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault()
            document.querySelector<HTMLInputElement>('input[placeholder="Search name, description, or URL..."]')?.focus()
            break
          case 'e':
            e.preventDefault()
            exportFavorites()
            break
          case '1':
            e.preventDefault()
            setViewMode('bookmarks')
            break
          case '2':
            e.preventDefault()
            setViewMode('grid')
            break
          case 'a':
            if (isBatchMode) {
              e.preventDefault()
              selectAllTools()
            }
            break
        }
      }
      
      // Delete key for batch removal
      if (e.key === 'Delete' && isBatchMode && selectedTools.size > 0) {
        e.preventDefault()
        batchRemoveFavorites()
      }
      
      // Escape to clear search or exit batch mode
      if (e.key === 'Escape') {
        if (isBatchMode) {
          clearSelection()
        } else {
          setSearchTerm('')
          setSelectedCategory('all')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isBatchMode, selectedTools.size])

  useEffect(() => {
    // 只有在用户认证状态确定且已登录时才获取收藏
    if (!authLoading && isAuthenticated) {
      const fetchFavorites = async () => {
        try {
          setLoading(true)
          setError(null)
          
          console.log('Fetching favorites for user:', user?.id)
          const response = await toolService.getUserFavorites()
          console.log('Favorites API response:', response)
          
          if (response && response.success && Array.isArray(response.data)) {
            console.log('Found', response.data.length, 'favorite tools')
            setFavorites(response.data)
            
            // 提取所有分类
            const uniqueCategories = Array.from(new Set(
              response.data.map(tool => tool.category_name || 'Other')
            ))
            setCategories(['all', ...uniqueCategories])
          } else {
            console.log('No favorites data or invalid response:', response)
            setFavorites([])
            setCategories(['all'])
          }
        } catch (err) {
          console.error('Failed to fetch favorites:', err)
          setError('Failed to load favorites. Please try again later.')
          setFavorites([])
          setCategories(['all'])
        } finally {
          setLoading(false)
        }
      }

      fetchFavorites()
    }
  }, [authLoading, isAuthenticated, user])

  const filteredFavorites = favorites
    .filter(tool => {
      if (searchTerm === '') return selectedCategory === 'all' || tool.category_name === selectedCategory
      
      const searchLower = searchTerm.toLowerCase()
      const matchesName = tool.name.toLowerCase().includes(searchLower)
      const matchesDescription = tool.description.toLowerCase().includes(searchLower)
      const matchesCategoryName = tool.category_name?.toLowerCase().includes(searchLower)
      const matchesUrl = tool.url.toLowerCase().includes(searchLower)
      
      const matchesSearch = matchesName || matchesDescription || matchesCategoryName || matchesUrl
      const matchesCategory = selectedCategory === 'all' || tool.category_name === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'category':
          return (a.category_name || 'Other').localeCompare(b.category_name || 'Other')
        case 'usage':
          return b.views - a.views
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  // Group favorites by category for bookmark view
  const groupedFavorites = filteredFavorites.reduce((acc, tool) => {
    const category = tool.category_name || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(tool)
    return acc
  }, {} as Record<string, Tool[]>)

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories)
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category)
    } else {
      newCollapsed.add(category)
    }
    setCollapsedCategories(newCollapsed)
  }

  const removeFavorite = async (toolId: number) => {
    try {
      await toolService.removeFromFavorites(toolId)
      setFavorites(favorites.filter(tool => tool.id !== toolId))
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  // Batch operations
  const toggleToolSelection = (toolId: number) => {
    const newSelected = new Set(selectedTools)
    if (newSelected.has(toolId)) {
      newSelected.delete(toolId)
    } else {
      newSelected.add(toolId)
    }
    setSelectedTools(newSelected)
  }

  const selectAllTools = () => {
    setSelectedTools(new Set(filteredFavorites.map(tool => tool.id)))
  }

  const clearSelection = () => {
    setSelectedTools(new Set())
    setIsBatchMode(false)
  }

  const batchRemoveFavorites = async () => {
    try {
      const promises = Array.from(selectedTools).map(toolId => 
        toolService.removeFromFavorites(toolId)
      )
      await Promise.all(promises)
      setFavorites(favorites.filter(tool => !selectedTools.has(tool.id)))
      clearSelection()
    } catch (error) {
      console.error('Failed to batch remove favorites:', error)
    }
  }

  // Search highlighting function
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50 px-0.5 rounded text-foreground">{part}</mark> : 
        part
    )
  }

  const exportFavorites = () => {
    const data = JSON.stringify(favorites, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-favorite-tools.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Enhanced Bookmark Component with batch selection and rich information
  const BookmarkItem = ({ tool }: { tool: Tool }) => {
    const [isHovered, setIsHovered] = useState(false)
    const isSelected = selectedTools.has(tool.id)
    
    // Safely extract domain from URL
    const getDomain = (url: string) => {
      try {
        return new URL(url).hostname.replace('www.', '')
      } catch {
        return url.length > 30 ? url.substring(0, 27) + '...' : url
      }
    }

    // Get favicon URL
    const getFaviconUrl = (url: string) => {
      try {
        const domain = new URL(url).origin
        return `${domain}/favicon.ico`
      } catch {
        return null
      }
    }
    
    return (
      <div 
        className={`group flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 ${
          isSelected ? 'bg-primary/10 border border-primary/20' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Selection checkbox */}
        {isBatchMode && (
          <div className="flex-shrink-0">
            <button
              onClick={() => toggleToolSelection(tool.id)}
              className="p-1 rounded hover:bg-accent transition-colors"
            >
              {isSelected ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        )}
        
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
            {/* Try to show favicon first, fallback to bookmark icon */}
            {getFaviconUrl(tool.url) ? (
              <img
                src={getFaviconUrl(tool.url)!}
                alt=""
                className="h-4 w-4 object-contain"
                onError={(e) => {
                  // Fallback to bookmark icon on error
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <Bookmark className={`h-3.5 w-3.5 text-primary ${getFaviconUrl(tool.url) ? 'hidden' : ''}`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 flex items-center space-x-3">
          <Link
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate flex-1"
            title={`${tool.name} - ${tool.description}\n🔗 ${tool.url}`}
          >
            {highlightSearchTerm(tool.name, searchTerm)}
          </Link>
          
          {/* Enhanced Quick Info */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {tool.views > 5000 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Zap className="h-3 w-3 mr-0.5" />
                Hot
              </span>
            )}
            {tool.featured && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                ★ Featured
              </span>
            )}
            
            {/* Show tags if available */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="h-3 w-3" />
                <span className="truncate max-w-16">{tool.tags[0]}</span>
                {tool.tags.length > 1 && <span>+{tool.tags.length - 1}</span>}
              </div>
            )}
            
            {/* Domain and stats */}
            <div className={`flex items-center space-x-1 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-60'
            }`}>
              <Globe className="h-3 w-3" />
              <span className="text-xs text-muted-foreground truncate max-w-20" title={tool.url}>
                {getDomain(tool.url)}
              </span>
              <span className="text-muted-foreground">•</span>
              <Eye className="h-3 w-3" />
              <span>{tool.views > 999 ? `${(tool.views / 1000).toFixed(1)}k` : tool.views}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Actions - show on hover */}
        <div className={`flex items-center space-x-1 transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          {!isBatchMode && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsBatchMode(true)
                toggleToolSelection(tool.id)
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              title="Select for batch operations"
            >
              <CheckSquare className="h-3.5 w-3.5" />
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Quick preview could be implemented here
              console.log('Quick preview for:', tool.name)
            }}
            className="p-1 rounded-md text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            title="Quick preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              removeFavorite(tool.id)
            }}
            className="p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Remove from favorites"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          
          <Link
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Open tool in new tab"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* 认证检查 */}
        {authLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : !isAuthenticated ? (
          <div className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto">
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">
                  {t('favorites.loginRequired', 'Please log in to view your favorites')}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t('favorites.loginDescription', 'Sign in with Google to save and manage your favorite tools')}
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('favorites.signIn', 'Sign In with Google')}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Compact Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Bookmark className="h-5 w-5 text-primary" />
                      <h1 className="text-xl font-bold">
                        {t('favorites.title', 'My Favorites')}
                      </h1>
                      <span className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">
                        {favorites.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search name, description, or URL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 w-80 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center rounded-md border bg-background">
                      <button
                        onClick={() => setViewMode('bookmarks')}
                        className={`p-2 rounded-l-md transition-colors ${
                          viewMode === 'bookmarks' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Bookmark View"
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-r-md transition-colors ${
                          viewMode === 'grid' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Grid View"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {t(`favorites.sortBy.${option.value}`, option.label)}
                        </option>
                      ))}
                    </select>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {/* Batch mode toggle */}
                      <button
                        onClick={() => {
                          if (isBatchMode) {
                            clearSelection()
                          } else {
                            setIsBatchMode(true)
                          }
                        }}
                        className={`p-2 rounded-md transition-colors ${
                          isBatchMode
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                        title={isBatchMode ? 'Exit batch mode' : 'Enter batch mode'}
                      >
                        <CheckSquare className="h-4 w-4" />
                      </button>

                      {/* Smart groups toggle */}
                      <button
                        onClick={() => setShowSmartGroups(!showSmartGroups)}
                        className={`p-2 rounded-md transition-colors ${
                          showSmartGroups
                            ? 'bg-accent text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                        title={showSmartGroups ? 'Hide smart groups' : 'Show smart groups'}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={exportFavorites}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        title="Export"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Operations Bar */}
            {isBatchMode && selectedTools.size > 0 && (
              <div className="bg-primary/10 border-b border-primary/20">
                <div className="container mx-auto px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">
                        {selectedTools.size} selected
                      </span>
                      <button
                        onClick={selectAllTools}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Select All ({filteredFavorites.length})
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={batchRemoveFavorites}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove Selected</span>
                      </button>
                      <button
                        onClick={clearSelection}
                        className="px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Groups Section */}
            {showSmartGroups && filteredFavorites.length > 0 && !searchTerm && (
              <div className="bg-muted/20 border-b">
                <div className="container mx-auto px-4 py-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Quick Access</span>
                  </h3>
                  
                  {(() => {
                    const smartGroups = getSmartGroups()
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Recent */}
                        {smartGroups.recentlyAdded.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Recently Added</span>
                            </h4>
                            <div className="space-y-1">
                              {smartGroups.recentlyAdded.map(tool => (
                                <div key={`recent-${tool.id}`} className="flex items-center space-x-2 p-2 rounded bg-card hover:bg-accent/50 transition-colors">
                                  <img
                                    src={`${tool.url.match(/^https?:\/\/[^\/]+/)?.[0] || tool.url}/favicon.ico`}
                                    alt=""
                                    className="h-4 w-4 rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                  <Link
                                    href={tool.url}
                                    target="_blank"
                                    className="flex-1 truncate text-sm font-medium hover:text-primary"
                                    title={tool.name}
                                  >
                                    {tool.name}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Most Used */}
                        {smartGroups.mostUsed.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center space-x-2">
                              <TrendingUpIcon className="h-4 w-4" />
                              <span>Most Used</span>
                            </h4>
                            <div className="space-y-1">
                              {smartGroups.mostUsed.map(tool => (
                                <div key={`popular-${tool.id}`} className="flex items-center space-x-2 p-2 rounded bg-card hover:bg-accent/50 transition-colors">
                                  <img
                                    src={`${tool.url.match(/^https?:\/\/[^\/]+/)?.[0] || tool.url}/favicon.ico`}
                                    alt=""
                                    className="h-4 w-4 rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                  <Link
                                    href={tool.url}
                                    target="_blank"
                                    className="flex-1 truncate text-sm font-medium hover:text-primary"
                                    title={tool.name}
                                  >
                                    {tool.name}
                                  </Link>
                                  <span className="text-xs text-muted-foreground">
                                    {tool.views > 999 ? `${(tool.views/1000).toFixed(1)}k` : tool.views}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Trending */}
                        {smartGroups.trending.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center space-x-2">
                              <Zap className="h-4 w-4" />
                              <span>Featured & Trending</span>
                            </h4>
                            <div className="space-y-1">
                              {smartGroups.trending.map(tool => (
                                <div key={`trending-${tool.id}`} className="flex items-center space-x-2 p-2 rounded bg-card hover:bg-accent/50 transition-colors">
                                  <img
                                    src={`${tool.url.match(/^https?:\/\/[^\/]+/)?.[0] || tool.url}/favicon.ico`}
                                    alt=""
                                    className="h-4 w-4 rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                  <Link
                                    href={tool.url}
                                    target="_blank"
                                    className="flex-1 truncate text-sm font-medium hover:text-primary"
                                    title={tool.name}
                                  >
                                    {tool.name}
                                  </Link>
                                  {tool.featured && <span className="text-xs text-yellow-600">★</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
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
              ) : filteredFavorites.length > 0 ? (
                viewMode === 'bookmarks' ? (
                  // Bookmark Tree View
                  <div className="max-w-4xl">
                    {Object.entries(groupedFavorites).map(([category, tools]) => (
                      <div key={category} className="mb-4">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="flex items-center space-x-2 w-full p-3 bg-card rounded-t-lg border hover:bg-accent/30 transition-colors group"
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            {collapsedCategories.has(category) ? (
                              <Folder className="h-4 w-4 text-amber-500" />
                            ) : (
                              <FolderOpen className="h-4 w-4 text-amber-500" />
                            )}
                            <span className="font-medium text-foreground">
                              {category}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-muted rounded text-muted-foreground">
                              {tools.length}
                            </span>
                          </div>
                          <ChevronRight 
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              collapsedCategories.has(category) ? '' : 'rotate-90'
                            }`}
                          />
                        </button>
                        
                        {!collapsedCategories.has(category) && (
                          <div className="bg-card border border-t-0 rounded-b-lg">
                            <div className="p-2 space-y-1">
                              {tools.map((tool) => (
                                <BookmarkItem key={tool.id} tool={tool} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Grid View
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFavorites.map((tool) => (
                      <ToolCard 
                        key={tool.id} 
                        tool={tool} 
                        variant="compact"
                        onFavorite={removeFavorite}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-16">
                  <Bookmark className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    {searchTerm 
                      ? t('favorites.noSearchResults', `No favorites found for "${searchTerm}"`)
                      : selectedCategory === 'all' 
                        ? t('favorites.noFavorites', 'No favorites yet')
                        : t('favorites.noFavoritesInCategory', `No favorites in ${selectedCategory}`)
                    }
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t('favorites.noFavoritesDesc', 'Start exploring our tools and save your favorites by clicking the heart icon')}
                  </p>
                  <div className="space-x-4">
                    <a
                      href="/tools"
                      className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {t('favorites.browseTools', 'Browse Tools')}
                    </a>
                    {(searchTerm || selectedCategory !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedCategory('all')
                        }}
                        className="inline-flex items-center px-6 py-3 border border-border bg-background hover:bg-accent rounded-lg transition-colors"
                      >
                        {t('favorites.showAll', 'Show All')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced keyboard shortcuts with search and batch mode shortcuts */}
            {filteredFavorites.length > 0 && (
              <div className="fixed bottom-4 right-4 z-20">
                <div className="bg-card/90 backdrop-blur border rounded-lg p-3 shadow-lg text-xs text-muted-foreground max-w-64">
                  <div className="font-medium mb-2 flex items-center space-x-1">
                    <span>Shortcuts:</span>
                    {isBatchMode && (
                      <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-xs">
                        Batch Mode
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div>⌘/Ctrl + F - Search</div>
                    <div>⌘/Ctrl + E - Export</div>
                    <div>⌘/Ctrl + 1/2 - Switch view</div>
                    {isBatchMode && (
                      <>
                        <div>⌘/Ctrl + A - Select all</div>
                        <div>Del - Remove selected</div>
                      </>
                    )}
                    <div>Esc - Clear {isBatchMode ? 'selection' : 'search'}</div>
                    <div className="pt-1 border-t border-border/50">
                      <div className="text-primary">💡 Tip: Hover items for quick actions</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tags Cloud Sidebar - Only show when not in search mode */}
            {!searchTerm && filteredFavorites.length > 5 && (
              <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10">
                <div className="bg-card/90 backdrop-blur border rounded-lg p-4 shadow-lg max-w-48">
                  <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <span>Popular Tags</span>
                  </h4>
                  
                  {(() => {
                    // Generate tag cloud from all tools
                    const tagCounts = new Map<string, number>()
                    favorites.forEach(tool => {
                      if (tool.tags) {
                        tool.tags.forEach(tag => {
                          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
                        })
                      }
                      // Also count categories as tags
                      if (tool.category_name) {
                        tagCounts.set(tool.category_name, (tagCounts.get(tool.category_name) || 0) + 1)
                      }
                    })

                    const sortedTags = Array.from(tagCounts.entries())
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 8)

                    return (
                      <div className="flex flex-wrap gap-1">
                        {sortedTags.map(([tag, count]) => (
                          <button
                            key={tag}
                            onClick={() => setSearchTerm(tag)}
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs transition-all hover:scale-105 ${
                              count > 3 
                                ? 'bg-primary/20 text-primary border border-primary/30 font-medium' 
                                : count > 1 
                                  ? 'bg-accent text-accent-foreground' 
                                  : 'bg-muted text-muted-foreground'
                            }`}
                            title={`${count} tools with this tag`}
                          >
                            {tag}
                            <span className="ml-1 text-xs opacity-70">
                              {count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )
                  })()}

                  {/* Quick stats */}
                  <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="font-medium">{favorites.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categories</span>
                      <span className="font-medium">{new Set(favorites.map(f => f.category_name).filter(Boolean)).size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This week</span>
                      <span className="font-medium text-green-600">
                        {getSmartGroups().recentlyAdded.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}