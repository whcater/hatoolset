import { Tool } from '../types';
import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink, Star, Heart } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  showActions?: boolean;
}

export const ToolCard = ({ tool, showActions = false }: ToolCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // TODO: 实现收藏功能API调用
  };

  const openExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tool.path) {
      window.open(tool.path, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Link 
      href={`/tools/${tool.id}`} 
      className="group block"
    >
      <div className="relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
        {/* 新工具标识 */}
        {tool.isNew && (
          <div className="absolute -top-2 -right-2 z-10">
            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full shadow-sm">
              NEW
            </span>
          </div>
        )}

        {/* 操作按钮组 */}
        {showActions && (
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={toggleFavorite}
              className={`p-1.5 rounded-full transition-colors ${
                isFavorited 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
              }`}
              title="收藏"
            >
              <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={openExternalLink}
              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              title="直接访问"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          {/* 工具图标 */}
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            {!imageLoaded && !imageError && (
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
            )}
            
            {tool.icon && !imageError ? (
              <img 
                src={tool.icon} 
                alt={tool.name}
                className={`w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {tool.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* 工具名称 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {tool.name}
          </h3>

          {/* 工具描述 */}
          <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
            {tool.description}
          </p>

          {/* 标签 */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mb-3">
              {tool.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200">
                  +{tool.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* 评分显示 */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3 h-3 text-yellow-400 fill-current"
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">5.0</span>
          </div>
        </div>

        {/* 底部渐变效果 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
}; 