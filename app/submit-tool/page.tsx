'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Globe, Tag, DollarSign, Monitor, FileText, Eye, Send, AlertCircle } from 'lucide-react'
import Layout from '../../src/components/Layout'
import GoogleLogin from '../../src/components/GoogleLogin'
import LoadingSpinner from '../../src/components/ui/LoadingSpinner'
import { useAuth, useAuthenticatedFetch } from '../../src/contexts/AuthContext'

interface Category {
  id: number
  name: string
  icon?: string
}

interface ToolFormData {
  name: string
  description: string
  url: string
  category_id: number
  tags: string[]
  pricing: 'free' | 'paid' | 'freemium'
  platform: 'web' | 'desktop' | 'mobile' | 'api'
}

interface UrlPreview {
  title?: string
  description?: string
  image?: string
  favicon?: string
}

export default function SubmitToolPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, login } = useAuth()
  const authenticatedFetch = useAuthenticatedFetch()

  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    description: '',
    url: '',
    category_id: 0,
    tags: [],
    pricing: 'free',
    platform: 'web'
  })
  const [currentTag, setCurrentTag] = useState('')
  const [urlPreview, setUrlPreview] = useState<UrlPreview | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 加载分类
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/tool-categories')
        const result = await response.json()

        if (result.success && result.data) {
          setCategories(result.data)
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    loadCategories()
  }, [])

  // URL预览
  const generatePreview = async (url: string) => {
    if (!url || !isValidUrl(url)) return

    setIsPreviewLoading(true)
    try {
      const response = await fetch('/api/tool-previews/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        setUrlPreview({
          title: result.data.title,
          description: result.data.description,
          image: result.data.meta_image,
          favicon: result.data.favicon_url
        })

        // 自动填充标题和描述（如果为空）
        if (!formData.name && result.data.title) {
          setFormData(prev => ({ ...prev, name: result.data.title }))
        }
        if (!formData.description && result.data.description) {
          setFormData(prev => ({ ...prev, description: result.data.description }))
        }
      }
    } catch (error) {
      console.error('Preview generation failed:', error)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  // URL验证
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // 处理表单变化
  const handleInputChange = (field: keyof ToolFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)

    // URL变化时生成预览
    if (field === 'url' && value && isValidUrl(value)) {
      const timeoutId = setTimeout(() => generatePreview(value), 1000)
      return () => clearTimeout(timeoutId)
    }
  }

  // 添加标签
  const addTag = () => {
    const tag = currentTag.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setCurrentTag('')
    }
  }

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setError('Please sign in to submit a tool')
      return
    }

    // 验证表单
    if (!formData.name || !formData.description || !formData.url || !formData.category_id) {
      setError('Please fill in all required fields')
      return
    }

    if (!isValidUrl(formData.url)) {
      setError('Please enter a valid URL')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await authenticatedFetch('/api/tools/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Submission failed')
      }

      setSuccess(true)

      // 3秒后跳转到我的申请页面
      setTimeout(() => {
        router.push('/my-submissions')
      }, 3000)

    } catch (error) {
      console.error('Submission error:', error)
      setError(error instanceof Error ? error.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Google登录成功处理
  const handleGoogleLoginSuccess = async (userData: any) => {
    try {
      await login(userData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  // 如果正在加载认证状态
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  // 如果未登录，显示登录界面
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">
                  {t('submit.loginRequired', 'Sign In Required')}
                </h1>
                <p className="text-muted-foreground">
                  {t('submit.loginDescription', 'Please sign in with Google to submit a tool for review')}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={(error) => setError(error)}
                />

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // 成功提交后的界面
  if (success) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-green-600">
                {t('submit.success', 'Submission Successful!')}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t('submit.successDescription', 'Your tool has been submitted for review. You will be notified once it has been reviewed.')}
              </p>
              <div className="text-sm text-muted-foreground">
                {t('submit.redirecting', 'Redirecting to your submissions...')}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('submit.title', 'Submit Your Tool')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('submit.subtitle', 'Share your amazing tool with our community. All submissions are reviewed by our team.')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-background/80 backdrop-blur rounded-xl border border-border p-6">
                  <form onSubmit={handleSubmit} className="space-y-6"> 
                    {/* Tool URL */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Globe className="inline h-4 w-4 mr-1" />
                        {t('submit.toolUrl', 'Tool URL')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://example.com"
                        required
                      />
                      {isPreviewLoading && (
                        <div className="mt-2 flex items-center text-sm text-muted-foreground">
                          <LoadingSpinner className="h-4 w-4 mr-2" />
                          {t('submit.generatingPreview', 'Generating preview...')}
                        </div>
                      )}
                    </div>
                    {/* Tool Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('submit.toolName', 'Tool Name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder={t('submit.toolNamePlaceholder', 'Enter tool name')}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <FileText className="inline h-4 w-4 mr-1" />
                        {t('submit.description', 'Description')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder={t('submit.descriptionPlaceholder', 'Describe what your tool does and why it\'s useful')}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('submit.category', 'Category')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value={0}>{t('submit.selectCategory', 'Select a category')}</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Tag className="inline h-4 w-4 mr-1" />
                        {t('submit.tags', 'Tags')} ({formData.tags.length}/5)
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder={t('submit.addTag', 'Add a tag')}
                          disabled={formData.tags.length >= 5}
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          disabled={!currentTag.trim() || formData.tags.length >= 5}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('submit.add', 'Add')}
                        </button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 hover:text-primary/70"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing & Platform */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <DollarSign className="inline h-4 w-4 mr-1" />
                          {t('submit.pricing', 'Pricing')}
                        </label>
                        <select
                          value={formData.pricing}
                          onChange={(e) => handleInputChange('pricing', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="free">{t('submit.free', 'Free')}</option>
                          <option value="paid">{t('submit.paid', 'Paid')}</option>
                          <option value="freemium">{t('submit.freemium', 'Freemium')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Monitor className="inline h-4 w-4 mr-1" />
                          {t('submit.platform', 'Platform')}
                        </label>
                        <select
                          value={formData.platform}
                          onChange={(e) => handleInputChange('platform', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="web">{t('submit.web', 'Web')}</option>
                          <option value="desktop">{t('submit.desktop', 'Desktop')}</option>
                          <option value="mobile">{t('submit.mobile', 'Mobile')}</option>
                          <option value="api">{t('submit.api', 'API')}</option>
                        </select>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner className="h-4 w-4" />
                          {t('submit.submitting', 'Submitting...')}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {t('submit.submitTool', 'Submit Tool')}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <div className="bg-background/80 backdrop-blur rounded-xl border border-border p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      {t('submit.preview', 'Preview')}
                    </h3>

                    {urlPreview ? (
                      <div className="space-y-4">
                        {urlPreview.image && (
                          <img
                            src={urlPreview.image}
                            alt="Tool preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}

                        <div className="flex items-start gap-3">
                          {urlPreview.favicon && (
                            <img
                              src={urlPreview.favicon}
                              alt="Favicon"
                              className="w-6 h-6 rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {urlPreview.title || formData.name || 'Tool Name'}
                            </h4>
                            {urlPreview.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                                {urlPreview.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          {t('submit.previewHint', 'Enter a URL to see preview')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Guidelines */}
                  <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      {t('submit.guidelines', 'Submission Guidelines')}
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• {t('submit.guideline1', 'Ensure your tool is functional and accessible')}</li>
                      <li>• {t('submit.guideline2', 'Provide accurate and detailed descriptions')}</li>
                      <li>• {t('submit.guideline3', 'Choose appropriate categories and tags')}</li>
                      <li>• {t('submit.guideline4', 'Review typically takes 1-3 business days')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
