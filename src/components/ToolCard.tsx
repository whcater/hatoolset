'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { 
  ExternalLink, 
  Heart, 
  Star, 
  Eye, 
  Tag, 
  TrendingUp,
  Share2,
  Crown,
  Globe,
  Monitor,
  Smartphone,
  Link2,
  CheckCircle
} from 'lucide-react'
import { Tool } from '../types/index'
import { toolService } from '../services/toolService'
import { useAuth } from '../contexts/AuthContext'

interface ToolCardProps {
  tool: Tool
  onFavorite?: (toolId: number) => void
  onShare?: (toolId: number) => void
  onView?: (toolId: number) => void
  showStats?: boolean
  variant?: 'default' | 'compact' | 'featured' | 'trending'
  viewMode?: 'grid' | 'list'
}

export default function ToolCard({ 
  tool, 
  onFavorite, 
  onShare, 
  onView,
  showStats = true,
  variant = 'default',
  viewMode = 'grid'
}: ToolCardProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)

  // 检查收藏状态
  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus()
    }
  }, [isAuthenticated, tool.id])

  const checkFavoriteStatus = async () => {
    try {
      const favorited = await toolService.isFavorited(tool.id)
      setIsFavorited(favorited)
    } catch (error) {
      console.error('Failed to check favorite status:', error)
    }
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      // 可以在这里触发登录提示
      console.log('Please login to add favorites')
      return
    }

    setIsLoadingFavorite(true)
    try {
      if (isFavorited) {
        await toolService.removeFromFavorites(tool.id)
        setIsFavorited(false)
      } else {
        await toolService.addToFavorites(tool.id)
        setIsFavorited(true)
      }
      onFavorite?.(tool.id)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare?.(tool.id)
  }

  const handleView = () => {
    onView?.(tool.id)
  }

  const getPricingBadge = () => {
    switch (tool.pricing) {
      case 'free':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Free
          </span>
        )
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            Paid
          </span>
        )
      case 'freemium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            Freemium
          </span>
        )
      default:
        return null
    }
  }

  const getPlatformIcon = () => {
    switch (tool.platform) {
      case 'web':
        return <Globe className="h-4 w-4" />
      case 'desktop':
        return <Monitor className="h-4 w-4" />
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'api':
        return <Link2 className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const renderRating = () => {
    if (!tool.rating) return null
    
    const stars = []
    const fullStars = Math.floor(tool.rating)
    const hasHalfStar = tool.rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />)
    }
    
    const emptyStars = 5 - Math.ceil(tool.rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-muted-foreground">
          {tool.rating.toFixed(1)}
        </span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="p-4 bg-card rounded-xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        {/* Header with icon, title and badges */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
              {getPlatformIcon()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              {!!tool.featured && <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
              {!!tool.trending && <TrendingUp className="h-4 w-4 text-red-500 flex-shrink-0" />}
              {!!tool.verified && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="capitalize">{tool.platform}</span>
              {tool.category_name && (
                <>
                  <span>•</span>
                  <span>{tool.category_name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description - 2 lines */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
          {tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tool.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {tool.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                +{tool.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer with pricing, rating and actions */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-1">
            {getPricingBadge()}
            {renderRating()}
          </div>
          
          <div className="flex items-center space-x-1">
            {showStats && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{tool.views}</span>
              </div>
            )}
            {isAuthenticated && (
              <button
                onClick={handleFavorite}
                disabled={isLoadingFavorite}
                className={`p-1.5 rounded-md transition-colors text-xs ${
                  isFavorited 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Heart className={`h-3 w-3 ${isFavorited ? 'fill-current' : ''} ${isLoadingFavorite ? 'animate-pulse' : ''}`} />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs"
            >
              <Share2 className="h-3 w-3" />
            </button>
            <Link
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleView}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="flex items-start space-x-4 p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
        {/* Tool Icon */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
            {getPlatformIcon()}
          </div>
        </div>
        
        {/* Tool Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground text-lg">{tool.name}</h3>
                {!!tool.featured && <Crown className="h-4 w-4 text-yellow-500" />}
                {!!tool.trending && <TrendingUp className="h-4 w-4 text-red-500" />}
                {!!tool.verified && (
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-2">{tool.description}</p>
              
              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {tool.tags.slice(0, 4).map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {tool.tags.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                      +{tool.tags.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-md transition-colors ${
                  isFavorited 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Category and Pricing */}
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {tool.category_name}
                </span>
                {getPricingBadge()}
              </div>
              
              {/* Rating */}
              {renderRating()}
              
              {/* Stats */}
              {showStats && (
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{tool.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{tool.favorites.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Visit Button */}
            <Link
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`group relative bg-card rounded-xl border transition-all duration-300 overflow-hidden ${
        variant === 'featured' 
          ? 'shadow-lg hover:shadow-xl' 
          : 'shadow-sm hover:shadow-md'
      } ${isHovered ? 'border-primary/50' : 'border-border'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with badges */}
      <div className="relative p-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
              {getPlatformIcon()}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground text-lg leading-tight">
                  {tool.name}
                </h3>
                {!!tool.featured && <Crown className="h-4 w-4 text-yellow-500" />}
                {!!tool.trending && <TrendingUp className="h-4 w-4 text-red-500" />}
                {!!tool.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="capitalize">{tool.platform}</span>
                {tool.category_name && (
                  <>
                    <span>•</span>
                    <span>{tool.category_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFavorite}
              disabled={isLoadingFavorite}
              className={`p-2 rounded-md transition-colors ${
                isFavorited 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' 
                  : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''} ${isLoadingFavorite ? 'animate-pulse' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tool Info */}
      <div className="px-6 pb-6">
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tool.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                +{tool.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Pricing and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getPricingBadge()}
          </div>
          {renderRating()}
        </div>

        {/* Stats and Actions */}
        {showStats && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{tool.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{tool.favorites.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="h-4 w-4" />
                <span>{tool.shares.toLocaleString()}</span>
              </div>
            </div>
            
            <Link
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleView}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 