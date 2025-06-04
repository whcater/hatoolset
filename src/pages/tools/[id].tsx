import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Star, Heart, Share2 } from 'lucide-react';
import { categories } from '@/data/tools';
import { Tool } from '@/types';
import { useState } from 'react';
import type { GetStaticProps, GetStaticPaths } from 'next';

interface ToolDetailProps {
  tool: Tool | null;
}

export default function ToolDetail({ tool }: ToolDetailProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [rating, setRating] = useState(0);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('tools.notFound', '工具未找到')}</h1>
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('tools.backHome', '返回首页')}
          </Button>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: 实现收藏功能API调用
  };

  const shareUrl = () => {
    if (navigator.share) {
      navigator.share({
        title: tool.name,
        text: tool.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: 显示复制成功提示
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <Button 
        onClick={() => router.back()} 
        variant="ghost" 
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('common.back', '返回')}
      </Button>

      {/* 工具头部信息 */}
      <div className="bg-white rounded-xl border shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 工具图标和基本信息 */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
              {tool.icon ? (
                <img 
                  src={tool.icon} 
                  alt={tool.name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-xs">{tool.name[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* 工具信息 */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{tool.description}</p>
                
                {/* 标签 */}
                {tool.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFavorite}
                  className={isFavorited ? 'text-red-600' : ''}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={shareUrl}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 评分 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 cursor-pointer ${
                      star <= rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {rating > 0 ? `${rating}/5` : t('tools.rateThis', '为此工具评分')}
              </span>
            </div>

            {/* 访问按钮 */}
            <Button 
              onClick={() => window.open(tool.path || '#', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('tools.visitTool', '访问工具')}
            </Button>
          </div>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要内容 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 功能特性 */}
          {tool.features && tool.features.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{t('tools.features')}</h2>
              <ul className="space-y-2">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 使用要求 */}
          {tool.requirements && tool.requirements.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{t('tools.requirements')}</h2>
              <ul className="space-y-2">
                {tool.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 分类信息 */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold mb-3">{t('tools.category')}</h3>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {tool.category || '其他'}
            </span>
          </div>

          {/* 相关工具推荐 */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold mb-4">{t('tools.relatedTools', '相关工具')}</h3>
            <div className="space-y-3">
              {/* TODO: 实现相关工具推荐逻辑 */}
              <p className="text-sm text-gray-500">{t('tools.noRelatedTools', '暂无相关工具')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // 获取所有工具的ID
  const allTools = categories.flatMap(category => category.tools);
  const paths = allTools.map(tool => ({
    params: { id: tool.id }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const toolId = params?.id as string;
  
  // 查找工具
  let foundTool: Tool | null = null;
  for (const category of categories) {
    const tool = category.tools.find(t => t.id === toolId);
    if (tool) {
      foundTool = { ...tool, category: category.name };
      break;
    }
  }

  if (!foundTool) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      tool: foundTool,
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
    revalidate: 3600, // 1小时重新生成
  };
}; 