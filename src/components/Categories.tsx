'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Code, 
  Palette, 
  Zap, 
  Settings, 
  Bot, 
  Shield, 
  DollarSign, 
  GraduationCap,
  Grid3X3,
  Wrench,
  Camera,
  Globe,
  ArrowRight,
  Search
} from 'lucide-react'
import { toolService } from '../services/toolService'
import LoadingSpinner from './ui/LoadingSpinner'
import type { Category } from '../services/toolService'

export default function Categories() {
  const { t } = useTranslation()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Icon mapping for categories
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'development': Code,
    'design': Palette,
    'productivity': Zap,
    'utilities': Settings,
    'ai': Bot,
    'security': Shield,
    'finance': DollarSign,
    'education': GraduationCap,
    'web-tools': Globe,
    'image-tools': Camera,
    'text-tools': Grid3X3,
    'system-tools': Wrench,
  }

  // Color mapping for categories
  const colorMap: { [key: string]: string } = {
    'development': 'from-blue-500 to-blue-600',
    'design': 'from-purple-500 to-purple-600',
    'productivity': 'from-green-500 to-green-600',
    'utilities': 'from-gray-500 to-gray-600',
    'ai': 'from-orange-500 to-orange-600',
    'security': 'from-red-500 to-red-600',
    'finance': 'from-emerald-500 to-emerald-600',
    'education': 'from-indigo-500 to-indigo-600',
    'web-tools': 'from-cyan-500 to-cyan-600',
    'image-tools': 'from-pink-500 to-pink-600',
    'text-tools': 'from-yellow-500 to-yellow-600',
    'system-tools': 'from-slate-500 to-slate-600',
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await toolService.getCategories()
        if (response.success && Array.isArray(response.data)) {
          setCategories(response.data)
        } else if (Array.isArray(response)) {
          // 处理直接返回数组的情况
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

  const handleCategoryClick = (category: Category) => {
    // Use direct window navigation to ensure hash parameter is properly handled
    window.location.href = `/tools#category=${category.id.toString()}`
  }

  const getIcon = (categoryName: string) => {
    const key = categoryName.toLowerCase().replace(/\s+/g, '-')
    return iconMap[key] || Settings
  }

  const getColor = (categoryName: string) => {
    const key = categoryName.toLowerCase().replace(/\s+/g, '-')
    return colorMap[key] || 'from-gray-500 to-gray-600'
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
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          No categories available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => {
        const Icon = getIcon(category.name)
        const colorClass = getColor(category.name)
        
        return (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="group block cursor-pointer"
          >
            <div className="h-full p-6 bg-background border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClass} mb-4`}>
                {category.icon ? (
                  <span className="text-2xl">{category.icon}</span>
                ) : (
                  <Icon className="h-6 w-6 text-white" />
                )}
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {category.tool_count}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore tools</span>
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 