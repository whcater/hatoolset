import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Globe, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  FileText
} from 'lucide-react';
import type { GetStaticProps } from 'next';

interface AnalysisResult {
  title: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  techStack: string[];
  screenshots: string[];
}

export default function SubmitTool() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const router = useRouter();
  
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 表单字段
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    features: '',
    requirements: '',
    pricing: '',
    contact: ''
  });

  const analyzeUrl = async () => {
    if (!url.trim()) return;
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      // 验证URL格式
      const urlObj = new URL(url);
      
      // 验证URL是否为有效的HTTP/HTTPS协议
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('请输入有效的HTTP或HTTPS链接');
      }
      
      // TODO: 调用后端API分析URL
      // 模拟分析过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟分析结果
      const mockResult: AnalysisResult = {
        title: '示例工具',
        description: '这是一个通过URL分析获得的工具描述',
        icon: '',
        category: 'productivity',
        tags: ['效率', '工具'],
        techStack: ['React', 'TypeScript'],
        screenshots: []
      };
      
      setAnalysisResult(mockResult);
      setFormData(prev => ({
        ...prev,
        name: mockResult.title,
        description: mockResult.description,
        category: mockResult.category,
        tags: mockResult.tags.join(', ')
      }));
      
    } catch (err) {
      setError('URL格式无效或分析失败，请检查URL是否正确');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // TODO: 调用后端API提交工具
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (err) {
      setError('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">提交成功！</h1>
        <p className="text-gray-600 mb-6">您的工具已提交，我们会在审核后尽快上线</p>
        <Button onClick={() => router.push('/')}>
          返回首页
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('submit.title', '提交工具')}</h1>
        <p className="text-lg text-gray-600">
          {t('submit.subtitle', '分享优质工具，让更多人受益')}
        </p>
      </div>

      {/* 登录提示 */}
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">需要登录</h3>
              <p className="text-yellow-700">请先登录后再提交工具</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => router.push('/login')}
              >
                立即登录
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* URL分析区域 */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            URL分析
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工具网站URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isAnalyzing}
                />
                <Button
                  onClick={analyzeUrl}
                  disabled={!url.trim() || isAnalyzing}
                  className="px-6"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    '分析'
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* 分析结果预览 */}
            {analysisResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  分析完成
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">标题：</span>{analysisResult.title}</p>
                  <p><span className="font-medium">描述：</span>{analysisResult.description}</p>
                  <p><span className="font-medium">分类：</span>{analysisResult.category}</p>
                  <p><span className="font-medium">标签：</span>{analysisResult.tags.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 工具信息表单 */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            工具信息
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工具名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工具描述 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">选择分类</option>
                <option value="productivity">效率工具</option>
                <option value="development">开发工具</option>
                <option value="design">设计工具</option>
                <option value="payment">支付工具</option>
                <option value="analytics">分析工具</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签 (用逗号分隔)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => updateFormData('tags', e.target.value)}
                placeholder="效率, 自动化, 免费"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主要功能
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => updateFormData('features', e.target.value)}
                rows={3}
                placeholder="列出工具的主要功能特性"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                使用要求
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => updateFormData('requirements', e.target.value)}
                rows={2}
                placeholder="系统要求、账户注册等"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                价格信息
              </label>
              <input
                type="text"
                value={formData.pricing}
                onChange={(e) => updateFormData('pricing', e.target.value)}
                placeholder="免费 / $10/月 / 一次性$99"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系方式 (可选)
              </label>
              <input
                type="email"
                value={formData.contact}
                onChange={(e) => updateFormData('contact', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={!formData.name || !formData.description || isSubmitting || !user}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  提交中...
                </>
              ) : (
                '提交工具'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* 提交指南 */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">提交指南</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">✅ 推荐提交的工具：</h4>
            <ul className="space-y-1">
              <li>• 功能实用、质量高的工具</li>
              <li>• 有独特价值或创新性</li>
              <li>• 界面美观、用户体验好</li>
              <li>• 活跃维护的项目</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">❌ 不建议提交：</h4>
            <ul className="space-y-1">
              <li>• 功能重复度高的工具</li>
              <li>• 长期停止维护的项目</li>
              <li>• 存在安全风险的工具</li>
              <li>• 违法违规内容</li>
            </ul>
          </div>
        </div>
      </div>
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