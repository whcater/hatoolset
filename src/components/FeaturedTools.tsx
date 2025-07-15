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
        // API返回的是 {success: true, data: Array} 结构
        if (response && response.success && Array.isArray(response.data)) {
          setTools(response.data)
        } else {
          console.warn('API returned unexpected format:', response)
          setTools([])
        }
      } catch (err) {
        console.error('Failed to fetch featured tools:', err)
        setError('Failed to load featured tools. Please try again later.')
        
        // 如果API失败，显示示例数据
        const mockTools: Tool[] = [
          {
            id: 1,
            name: 'GitHub Copilot',
            description: 'AI-powered code completion tool that helps you write code faster and more efficiently.',
            url: 'https://github.com/features/copilot',
            category_id: 1,
            category_name: 'Development',
            category_icon: '💻',
            category_color: 'blue',
            tags: ['AI', 'Coding', 'Productivity'],
            rating: 4.8,
            views: 15420,
            clicks: 3240,
            shares: 890,
            favorites: 1250,
            featured: true,
            trending: false,
            verified: true,
            pricing: 'freemium' as const,
            platform: 'web',
            icon_url: 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
            screenshot_url: 'https://github.githubassets.com/images/modules/site/copilot/copilot-editor.png',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            name: 'Figma',
            description: 'Collaborative interface design tool with real-time collaboration features.',
            url: 'https://figma.com',
            category_id: 2,
            category_name: 'Design',
            category_icon: '🎨',
            category_color: 'purple',
            tags: ['Design', 'UI/UX', 'Collaboration'],
            rating: 4.9,
            views: 23100,
            clicks: 5670,
            shares: 1234,
            favorites: 2890,
            featured: true,
            trending: true,
            verified: true,
            pricing: 'freemium' as const,
            platform: 'web',
            icon_url: 'https://cdn.worldvectorlogo.com/logos/figma-1.svg',
            screenshot_url: 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png',
            created_at: '2024-01-14T14:20:00Z',
            updated_at: '2024-01-14T14:20:00Z'
          },
          {
            id: 3,
            name: 'Notion',
            description: 'All-in-one workspace for notes, tasks, wikis, and databases.',
            url: 'https://notion.so',
            category_id: 3,
            category_name: 'Productivity',
            category_icon: '⚡',
            category_color: 'green',
            tags: ['Productivity', 'Notes', 'Database'],
            rating: 4.7,
            views: 18750,
            clicks: 4560,
            shares: 980,
            favorites: 2340,
            featured: true,
            trending: false,
            verified: true,
            pricing: 'freemium' as const,
            platform: 'web',
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
            screenshot_url: 'https://www.notion.so/cdn-cgi/image/format=webp,width=1200/https://images.ctfassets.net/spoqsaf9291f/6tWu5qvgDCzELqVbkzYQ4M/081388e5a9f51b8b0b8e6f4f0a5b0f2e/notion-app.png',
            created_at: '2024-01-13T09:15:00Z',
            updated_at: '2024-01-13T09:15:00Z'
          },
          {
            id: 4,
            name: 'Vercel',
            description: 'Platform for frontend frameworks and static sites with seamless deployment.',
            url: 'https://vercel.com',
            category_id: 1,
            category_name: 'Development',
            category_icon: '💻',
            category_color: 'blue',
            tags: ['Deployment', 'Frontend', 'Hosting'],
            rating: 4.6,
            views: 12300,
            clicks: 2890,
            shares: 654,
            favorites: 1890,
            featured: true,
            trending: false,
            verified: true,
            pricing: 'free' as const,
            platform: 'web',
            icon_url: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png',
            screenshot_url: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/repository-open-graph-template.png',
            created_at: '2024-01-12T16:45:00Z',
            updated_at: '2024-01-12T16:45:00Z'
          },
          {
            id: 5,
            name: 'Tailwind CSS',
            description: 'Utility-first CSS framework for rapidly building custom designs.',
            url: 'https://tailwindcss.com',
            category_id: 1,
            category_name: 'Development',
            category_icon: '💻',
            category_color: 'blue',
            tags: ['CSS', 'Framework', 'Utility'],
            rating: 4.8,
            views: 28900,
            clicks: 7890,
            shares: 2345,
            favorites: 4560,
            featured: true,
            trending: true,
            verified: true,
            pricing: 'free' as const,
            platform: 'web',
            icon_url: 'https://tailwindcss.com/favicon-32x32.png',
            screenshot_url: 'https://tailwindcss.com/_next/static/media/docs@75.8bb955b2.jpg',
            created_at: '2024-01-11T11:20:00Z',
            updated_at: '2024-01-11T11:20:00Z'
          },
          {
            id: 6,
            name: 'ChatGPT',
            description: 'AI chatbot that can help with various tasks and questions.',
            url: 'https://chat.openai.com',
            category_id: 4,
            category_name: 'AI Tools',
            category_icon: '🤖',
            category_color: 'indigo',
            tags: ['AI', 'Chatbot', 'Assistant'],
            rating: 4.9,
            views: 45600,
            clicks: 12300,
            shares: 3456,
            favorites: 8900,
            featured: true,
            trending: true,
            verified: true,
            pricing: 'freemium' as const,
            platform: 'web',
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
            screenshot_url: 'https://cdn.openai.com/API/docs/images/chat-completions-screenshot.png',
            created_at: '2024-01-10T08:30:00Z',
            updated_at: '2024-01-10T08:30:00Z'
          }
        ]
        setTools(mockTools)
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