'use client'

import { useState } from 'react'
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
  Bookmark,
  MoreHorizontal,
  Crown,
  Zap
} from 'lucide-react'
import { Tool } from '../types/index'

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
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    onFavorite?.(tool.id)
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
        return '🌐'
      case 'desktop':
        return '💻'
      case 'mobile':
        return '📱'
      case 'api':
        return '🔗'
      default:
        return '🌐'
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
      <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex-shrink-0">
          {tool.icon_url ? (
            <img 
              src={tool.icon_url} 
              alt={tool.name}
              className="h-10 w-10 rounded-lg object-cover"
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-lg">{getPlatformIcon()}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-foreground truncate">{tool.name}</h3>
            {tool.featured && <Crown className="h-4 w-4 text-yellow-500" />}
            {tool.trending && <TrendingUp className="h-4 w-4 text-red-500" />}
          </div>
          <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
          <div className="flex items-center space-x-2 mt-1">
            {getPricingBadge()}
            {tool.category_name && (
              <span className="text-xs text-muted-foreground">
                {tool.category_name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showStats && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{tool.views}</span>
            </div>
          )}
          <Link
            href={`/tools/${tool.id}`}
            onClick={handleView}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="flex items-start space-x-4 p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
        {/* Tool Icon */}
        <div className="flex-shrink-0">
          {tool.icon ? (
            <img 
              src={tool.icon} 
              alt={tool.name}
              className="h-12 w-12 rounded-lg object-cover"
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-xl">{getPlatformIcon()}</span>
            </div>
          )}
        </div>
        
        {/* Tool Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground text-lg">{tool.name}</h3>
                {tool.featured && <Crown className="h-4 w-4 text-yellow-500" />}
                {tool.trending && <TrendingUp className="h-4 w-4 text-red-500" />}
                {tool.verified && (
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
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  {tool.category}
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
      {/* Featured Badge */}
      {tool.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Featured
          </span>
        </div>
      )}

      {/* Trending Badge */}
      {tool.trending && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-red-400 to-pink-500 text-white">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </span>
        </div>
      )}

      {/* Tool Preview Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {tool.screenshot_url ? (
          <img 
            src={tool.screenshot_url}
            alt={tool.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">{getPlatformIcon()}</div>
              <div className="text-sm text-muted-foreground">{tool.platform}</div>
            </div>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              href={`/tools/${tool.id}`}
              onClick={handleView}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Tool Info */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {tool.icon_url && (
              <img 
                src={tool.icon_url} 
                alt={tool.name}
                className="h-8 w-8 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-foreground text-lg leading-tight">
                {tool.name}
              </h3>
              {tool.verified && (
                <div className="flex items-center space-x-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-600">Verified</span>
                </div>
              )}
            </div>
          </div>
          
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

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* Category and Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {tool.category_name && (
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                tool.category_color 
                  ? `bg-${tool.category_color}-100 text-${tool.category_color}-800` 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tool.category_icon && <span className="mr-1">{tool.category_icon}</span>}
                {tool.category_name}
              </span>
            )}
            {getPricingBadge()}
          </div>
          
          {renderRating()}
        </div>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tool.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
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

        {/* Stats */}
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
              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 