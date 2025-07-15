'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, 
  Heart, 
  Share2, 
  Star, 
  Eye, 
  MousePointer, 
  Calendar,
  Tag,
  Globe,
  Download,
  Github,
  Twitter,
  Facebook,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { Tool, toolService } from '../services/toolService';
import { ToolCard } from './ToolCard';
import { CommentSection } from './CommentSection';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ToolDetailProps {
  tool: Tool;
}

export function ToolDetail({ tool }: ToolDetailProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);
  const [toolStats, setToolStats] = useState<any>(null);
  const [similarTools, setSimilarTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadToolStats();
    loadSimilarTools();
    checkFavoriteStatus();
  }, [tool.id]);

  const loadToolStats = async () => {
    try {
      const stats = await toolService.getToolStats(tool.id);
      setToolStats(stats);
    } catch (error) {
      console.error('Error loading tool stats:', error);
    }
  };

  const loadSimilarTools = async () => {
    try {
      const response = await toolService.getToolsByCategory(tool.category_id, { limit: 6 });
      setSimilarTools(response.tools.filter(t => t.id !== tool.id).slice(0, 4));
    } catch (error) {
      console.error('Error loading similar tools:', error);
    }
  };

  const checkFavoriteStatus = () => {
    // Check if tool is favorited (implement with localStorage or API)
    const favorites = JSON.parse(localStorage.getItem('toolset_favorites') || '[]');
    setIsFavorited(favorites.includes(tool.id));
  };

  const handleFavorite = async () => {
    try {
      setLoading(true);
      const favorites = JSON.parse(localStorage.getItem('toolset_favorites') || '[]');
      
      if (isFavorited) {
        // Remove from favorites
        const updatedFavorites = favorites.filter((id: number) => id !== tool.id);
        localStorage.setItem('toolset_favorites', JSON.stringify(updatedFavorites));
        setIsFavorited(false);
      } else {
        // Add to favorites
        const updatedFavorites = [...favorites, tool.id];
        localStorage.setItem('toolset_favorites', JSON.stringify(updatedFavorites));
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVisit = async () => {
    try {
      await toolService.recordClick(tool.id);
      window.open(tool.url, '_blank');
    } catch (error) {
      console.error('Error recording click:', error);
      window.open(tool.url, '_blank');
    }
  };

  const handleShare = async (platform?: string) => {
    try {
      await toolService.recordShare(tool.id);
      
      const shareUrl = `${window.location.origin}/tools/${tool.id}`;
      const shareText = `Check out ${tool.name} - ${tool.description}`;
      
      if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      } else if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
      } else {
        // Web Share API or fallback
        if (navigator.share) {
          await navigator.share({
            title: tool.name,
            text: shareText,
            url: shareUrl
          });
        } else {
          navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: t('tabs.overview'), icon: BookOpen },
    { id: 'features', label: t('tabs.features'), icon: Zap },
    { id: 'reviews', label: t('tabs.reviews'), icon: MessageSquare },
    { id: 'similar', label: t('tabs.similar'), icon: TrendingUp }
  ];

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'paid': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'freemium': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tool Logo/Screenshot */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
              {tool.icon_url ? (
                <img 
                  src={tool.icon_url} 
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">{tool.category_icon || '🔧'}</div>
              )}
            </div>
          </div>

          {/* Tool Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {tool.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {tool.featured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
                {tool.trending && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
                    Trending
                  </span>
                )}
                {tool.verified && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Pricing and Platform */}
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPricingColor(tool.pricing)}`}>
                {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                {tool.platform}
              </span>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm">{tool.rating || 'N/A'}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{tool.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MousePointer className="w-4 h-4" />
                <span className="text-sm">{tool.clicks?.toLocaleString() || 0} clicks</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{tool.favorites?.toLocaleString() || 0} favorites</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleVisit}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </button>
              
              <button
                onClick={handleFavorite}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                  isFavorited 
                    ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900 dark:border-red-800 dark:text-red-300' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </button>
              
              <div className="relative group">
                <button
                  onClick={() => handleShare()}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                
                {/* Share dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <Globe className="w-4 h-4" />
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Section */}
      {tool.screenshot_url && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Preview
          </h3>
          <div className="rounded-lg overflow-hidden">
            <img 
              src={tool.screenshot_url} 
              alt={`${tool.name} screenshot`}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Tool Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tool Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {tool.category_name || 'Uncategorized'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Platform</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {tool.platform}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Added</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(tool.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(tool.updated_at).toLocaleDateString()}
                    </dd>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Feature information will be available soon. Visit the tool's website to learn more about its features.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <CommentSection toolId={tool.id} />
          )}

          {activeTab === 'similar' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Similar Tools
              </h3>
              {similarTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {similarTools.map((similarTool) => (
                    <ToolCard key={similarTool.id} tool={similarTool} variant="compact" />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  No similar tools found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}