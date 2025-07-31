'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ToolCard from './ToolCard'
import LoadingSpinner from './ui/LoadingSpinner'
import { toolService } from '../services/toolService'
import type { Tool } from '../services/toolService'

export default function FeaturedTools() {
  const { t } = useTranslation()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedTools = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 获取精选工具
        const response = await toolService.getFeaturedTools() 
        
        if (response && response.success && Array.isArray(response.data)) {
          setTools(response.data)
        } else if (response && Array.isArray(response)) {
          // 处理直接返回数组的情况
          setTools(response)
        } else {
          console.warn('API returned unexpected format:', response)
          setTools([])
        }
      } catch (err) {
        console.error('Failed to fetch featured tools:', err)
        setError('Failed to load featured tools. Please try again later.')
        setTools([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTools()
  }, [])

  const handleToolView = async (toolId: number) => {
    try {
      await toolService.recordView(toolId)
    } catch (err) {
      console.error('Failed to record view:', err)
    }
  }

  const handleToolFavorite = async (toolId: number) => {
    try {
      // 这里可以实现收藏功能
      console.log('Favorite tool:', toolId)
    } catch (err) {
      console.error('Failed to favorite tool:', err)
    }
  }

  const handleToolShare = async (toolId: number) => {
    try {
      await toolService.recordShare(toolId)
      
      // 复制链接到剪贴板
      const tool = tools.find(t => t.id === toolId)
      if (tool) {
        const shareUrl = `${window.location.origin}/tools/${toolId}`
        await navigator.clipboard.writeText(shareUrl)
        
        // 这里可以显示成功提示
        console.log('Link copied to clipboard')
      }
    } catch (err) {
      console.error('Failed to share tool:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          No featured tools available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          variant="featured"
          onView={handleToolView}
          onFavorite={handleToolFavorite}
          onShare={handleToolShare}
          showStats={true}
        />
      ))}
    </div>
  )
} 