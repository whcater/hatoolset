import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from '@/components/ui/button';
import { ToolCard } from '@/components/ToolCard';
import { categories } from '@/data/tools';
import { Search, Filter, X } from 'lucide-react';
import type { GetStaticProps } from 'next';

export default function SearchPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // 获取所有工具和标签
  const allTools = useMemo(() => {
    return categories.flatMap(category => 
      category.tools.map(tool => ({
        ...tool,
        category: category.name,
        categoryId: category.id
      }))
    );
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allTools.forEach(tool => {
      if (tool.tags) {
        tool.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [allTools]);

  const allCategories = useMemo(() => {
    return categories.map(cat => ({ id: cat.id, name: cat.name }));
  }, []);

  // 过滤工具
  const filteredTools = useMemo(() => {
    let filtered = allTools;

    // 搜索关键词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // 分类过滤
    if (selectedCategory) {
      filtered = filtered.filter(tool => tool.categoryId === selectedCategory);
    }

    // 标签过滤
    if (selectedTags.length > 0) {
      filtered = filtered.filter(tool =>
        tool.tags && selectedTags.every(tag => tool.tags!.includes(tag))
      );
    }

    return filtered;
  }, [allTools, searchQuery, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('search.title', '搜索工具')}</h1>
        <p className="text-lg text-gray-600">{t('search.subtitle', '发现适合您的工具')}</p>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索输入框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('search.placeholder', '搜索工具名称、描述或标签...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 过滤器按钮 */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {t('search.filters', '过滤器')}
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(selectedCategory ? 1 : 0) + selectedTags.length + (searchQuery ? 1 : 0)}
              </span>
            )}
          </Button>

          {/* 清除过滤器 */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-600"
            >
              <X className="w-4 h-4" />
              {t('search.clearFilters', '清除')}
            </Button>
          )}
        </div>

        {/* 过滤器面板 */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 分类过滤 */}
              <div>
                <h3 className="font-semibold mb-3">{t('search.category', '分类')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="mr-2"
                    />
                    {t('search.allCategories', '所有分类')}
                  </label>
                  {allCategories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* 标签过滤 */}
              <div>
                <h3 className="font-semibold mb-3">{t('search.tags', '标签')}</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 搜索结果 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {t('search.results', '搜索结果')} ({filteredTools.length})
          </h2>
          
          {/* 当前筛选条件显示 */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  关键词: {searchQuery}
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  分类: {allCategories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 工具网格 */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            {t('search.noResults', '未找到相关工具')}
          </h3>
          <p className="text-gray-400 mb-6">
            {t('search.noResultsDesc', '尝试调整搜索条件或浏览其他分类')}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            {t('search.browseAll', '浏览所有工具')}
          </Button>
        </div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
}; 