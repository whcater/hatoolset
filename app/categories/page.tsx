'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid3X3, TrendingUp, Users, Star } from 'lucide-react'
import Layout from '../../src/components/Layout'
import Categories from '../../src/components/Categories'
import LoadingSpinner from '../../src/components/ui/LoadingSpinner'
import { toolService } from '../../src/services/toolService'
import type { Category } from '../../src/services/toolService'

export default function CategoriesPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await toolService.getCategories()
        if (response && response.success && Array.isArray(response.data)) {
          setCategories(response.data)
        } else if (Array.isArray(response)) {
          setCategories(response)
        } else {
          setCategories([])
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Failed to load categories. Please try again later.')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // 获取前4个分类用于统计显示
  const topCategories = categories.slice(0, 4)
  const iconMap = {
    'Development': TrendingUp,
    'Design': Grid3X3, 
    'Productivity': Star,
    'AI Tools': Users,
    'Marketing': TrendingUp,
    'Analytics': Grid3X3,
    'Security': Star,
    'Communication': Users
  }
  
  const colorMap = {
    'Development': 'from-blue-500 to-blue-600',
    'Design': 'from-green-500 to-green-600', 
    'Productivity': 'from-purple-500 to-purple-600',
    'AI Tools': 'from-orange-500 to-orange-600',
    'Marketing': 'from-red-500 to-red-600',
    'Analytics': 'from-indigo-500 to-indigo-600',
    'Security': 'from-yellow-500 to-yellow-600',
    'Communication': 'from-pink-500 to-pink-600'
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {t('categories.title', 'Tool Categories')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('categories.subtitle', 'Explore our tools organized by category to quickly find what you need')}
              </p>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <section className="py-12">
          <div className="container mx-auto px-4">
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {topCategories.map((category) => {
                  const Icon = iconMap[category.name] || TrendingUp
                  const colorClass = colorMap[category.name] || 'from-gray-500 to-gray-600'
                  return (
                    <div
                      key={category.id}
                      className="bg-background/80 backdrop-blur rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center mb-4`}>
                        {category.icon ? (
                          <span className="text-2xl">{category.icon}</span>
                        ) : (
                          <Icon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground">
                        {t('categories.toolCount', `${category.tool_count} tools available`)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Main Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('categories.exploreTitle', 'Explore Categories')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('categories.exploreDesc', 'Click on any category to discover amazing tools tailored to your needs')}
              </p>
            </div>
            <Categories />
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('categories.popularTitle', 'Most Popular Categories')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('categories.popularDesc', 'Categories with the highest user engagement and most used tools')}
              </p>
            </div>
            
            {/* Popular categories grid */}
            {!loading && !error && categories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.slice(0, 3).map((category, index) => {
                  const Icon = iconMap[category.name] || TrendingUp
                  const colorClass = colorMap[category.name] || 'from-gray-500 to-gray-600'
                  return (
                    <div
                      key={category.id}
                      className="text-center p-8 bg-background/60 backdrop-blur rounded-2xl border border-border hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center mx-auto mb-6`}>
                        {category.icon ? (
                          <span className="text-3xl">{category.icon}</span>
                        ) : (
                          <Icon className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{category.name}</h3>
                      <p className="text-muted-foreground mb-4">
                        {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}Desc`, `Discover ${category.tool_count} amazing ${category.name.toLowerCase()} tools`)}
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          4.{8 + index}/5
                        </span>
                        <span>{category.tool_count} tools</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}