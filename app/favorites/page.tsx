'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Star, Trash2, Share2, Download, Filter, User } from 'lucide-react'
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
  const [sortBy, setSortBy] = useState('recent')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'views', label: 'Most Viewed' }
  ]

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
    .filter(tool => selectedCategory === 'all' || tool.category_name === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'views':
          return b.views - a.views
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const removeFavorite = async (toolId: number) => {
    try {
      await toolService.removeFromFavorites(toolId)
      setFavorites(favorites.filter(tool => tool.id !== toolId))
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
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
            {/* Header Section */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-pink-500 mr-2" />
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {t('favorites.title', 'My Favorites')}
                    </h1>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t('favorites.subtitle', 'Your curated collection of favorite tools, always at your fingertips')}
                  </p>
                </div>

                {/* Stats and Actions */}
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <span>{favorites.length} {t('favorites.toolsCount', 'tools saved')}</span>
                      <span>{new Set(favorites.map(f => f.category_name).filter(Boolean)).size} {t('favorites.categoriesCount', 'categories')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={exportFavorites}
                        className="flex items-center space-x-2 px-4 py-2 bg-background/80 backdrop-blur rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">{t('favorites.export', 'Export')}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">{t('favorites.share', 'Share')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 bg-background/80 backdrop-blur rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? t('favorites.allCategories', 'All Categories') : category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 bg-background/80 backdrop-blur rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {t(`favorites.sortBy.${option.value}`, option.label)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="container mx-auto px-4 py-12">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFavorites.map((tool) => (
                    <div key={tool.id} className="relative group">
                      <ToolCard tool={tool} viewMode="grid" onFavorite={removeFavorite} />
                      
                      {/* Favorite Actions Overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => removeFavorite(tool.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                            title={t('favorites.remove', 'Remove from favorites')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Favorite Metadata */}
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>{t('favorites.added', 'Added')}: {new Date(tool.created_at).toLocaleDateString()}</span>
                          <span>{t('favorites.views', 'Views')}: {tool.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedCategory === 'all' 
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
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="inline-flex items-center px-6 py-3 border border-border bg-background hover:bg-accent rounded-lg transition-colors"
                      >
                        {t('favorites.showAll', 'Show All Categories')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {favorites.length > 0 && (
              <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                      {t('favorites.quickActions', 'Quick Actions')}
                    </h2>
                    <p className="text-muted-foreground">
                      {t('favorites.quickActionsDesc', 'Manage your favorite tools collection')}
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={exportFavorites}
                      className="flex items-center space-x-2 px-6 py-3 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <Download className="h-5 w-5" />
                      <span>{t('favorites.exportAll', 'Export All Favorites')}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span>{t('favorites.shareCollection', 'Share Collection')}</span>
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}