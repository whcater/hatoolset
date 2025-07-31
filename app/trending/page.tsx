'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, Flame, BarChart3, Clock, Star, Users } from 'lucide-react'
import Layout from '../../src/components/Layout'
import ToolCard from '../../src/components/ToolCard'
import LoadingSpinner from '../../src/components/ui/LoadingSpinner'
import { toolService } from '../../src/services/toolService'
import type { Tool } from '../../src/services/toolService'

const trendingStats = [
  { label: 'Total Views', value: '2.4M', icon: BarChart3, change: '+12%' },
  { label: 'Active Users', value: '45.2K', icon: Users, change: '+8%' },
  { label: 'New Tools', value: '23', icon: Clock, change: '+15%' },
  { label: 'Avg Rating', value: '4.7', icon: Star, change: '+2%' }
]

export default function TrendingPage() {
  const { t } = useTranslation()
  const [trendingTools, setTrendingTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingTools = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await toolService.getTrendingTools()
        if (response && response.success && Array.isArray(response.data)) {
          setTrendingTools(response.data)
        } else if (Array.isArray(response)) {
          setTrendingTools(response)
        } else {
          setTrendingTools([])
        }
      } catch (err) {
        console.error('Failed to fetch trending tools:', err)
        setError('Failed to load trending tools. Please try again later.')
        setTrendingTools([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingTools()
  }, [])

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
      const tool = trendingTools.find(t => t.id === toolId)
      if (tool) {
        const shareUrl = `${window.location.origin}/tools/${toolId}`
        await navigator.clipboard.writeText(shareUrl)
      }
    } catch (err) {
      console.error('Failed to share tool:', err)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Flame className="h-8 w-8 text-orange-500 mr-2" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {t('trending.title', 'Trending Tools')}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('trending.subtitle', 'Discover the hottest tools that are gaining popularity in our community')}
              </p>
            </div>
          </div>
        </div>

        {/* Trending Stats */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {trendingStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="bg-background/80 backdrop-blur rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Top Trending Tools */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <TrendingUp className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('trending.topTools', 'Top Trending Tools')}
              </h2>
            </div>
            
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
            ) : trendingTools.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  No trending tools available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    variant="trending"
                    onView={handleToolView}
                    onShare={handleToolShare}
                    showStats={true}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Trending Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('trending.categories', 'Trending Categories')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('trending.categoriesDesc', 'Categories experiencing the highest growth this week')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Productivity', 'Development', 'Payment'].map((category, index) => (
                <div
                  key={category}
                  className="text-center p-8 bg-background/60 backdrop-blur rounded-2xl border border-border hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{category}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t(`trending.${category.toLowerCase()}Desc`, `Hot ${category.toLowerCase()} tools trending now`)}
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <span className="text-green-600 font-medium">
                      +{150 + index * 30}% growth
                    </span>
                    <span className="text-muted-foreground">
                      {8 + index * 2} tools
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}