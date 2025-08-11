'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  Search, 
  Plus, 
  Eye, 
  Check, 
  X, 
  AlertCircle,
  Loader2,
  Upload,
  Camera,
  ExternalLink,
  BookOpen,
  Tag
} from 'lucide-react';
import { toolService } from '../services/toolService';

interface ToolPreview {
  url: string;
  title: string;
  description: string;
  favicon?: string;
  screenshot?: string;
  meta_tags: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    image?: string;
  };
  status: 'success' | 'error' | 'timeout';
  error_message?: string;
}

interface ToolSubmissionForm {
  url: string;
  name: string;
  description: string;
  category_id: number;
  tags: string[];
  pricing: 'free' | 'paid' | 'freemium';
  platform: 'web' | 'desktop' | 'mobile' | 'api';
}

export function ToolSubmission() {
  const { t } = useTranslation();
  const [step, setStep] = useState<'url' | 'preview' | 'details' | 'submit'>('url');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [url, setUrl] = useState('');
  const [toolPreview, setToolPreview] = useState<ToolPreview | null>(null);
  const [formData, setFormData] = useState<ToolSubmissionForm>({
    url: '',
    name: '',
    description: '',
    category_id: 0,
    tags: [],
    pricing: 'free',
    platform: 'web'
  });

  // Categories and tags
  const [categories, setCategories] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await toolService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await toolService.getTags();
      if (response.success) {
        setAvailableTags(response.data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Validate URL format
      const urlRegex = /^https?:\/\/.+/i;
      if (!urlRegex.test(url)) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }

      // Get tool preview
      const preview = await toolService.getToolPreview(url);
      setToolPreview(preview);
      
      // Auto-fill form data from preview
      setFormData(prev => ({
        ...prev,
        url: url,
        name: preview.title || '',
        description: preview.description || ''
      }));

      setStep('preview');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch website information');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Tool name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Tool description is required');
      }
      if (!formData.category_id) {
        throw new Error('Please select a category');
      }

      // Submit tool
      await toolService.submitTool({
        name: formData.name,
        description: formData.description,
        url: formData.url,
        category_id: formData.category_id,
        tags: formData.tags
      });

      setStep('submit');
    } catch (err: any) {
      setError(err.message || 'Failed to submit tool');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const reset = () => {
    setStep('url');
    setUrl('');
    setToolPreview(null);
    setFormData({
      url: '',
      name: '',
      description: '',
      category_id: 0,
      tags: [],
      pricing: 'free',
      platform: 'web'
    });
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Submit a Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Share an amazing tool with the community. We'll automatically collect information from the website.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {[
              { id: 'url', label: 'Enter URL', icon: Globe },
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'details', label: 'Details', icon: BookOpen },
              { id: 'submit', label: 'Submit', icon: Check }
            ].map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step === stepItem.id 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : index < ['url', 'preview', 'details', 'submit'].indexOf(step)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500'
                }`}>
                  <stepItem.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step === stepItem.id 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {stepItem.label}
                </span>
                {index < 3 && (
                  <div className={`ml-4 w-16 h-0.5 ${
                    index < ['url', 'preview', 'details', 'submit'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: URL Input */}
          {step === 'url' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Enter Tool URL
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Enter the website URL of the tool you'd like to submit. We'll automatically fetch information about it.
                </p>
              </div>

              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Analyze Website
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && toolPreview && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Website Preview
                </h2>
                <button
                  onClick={() => setStep('url')}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ← Back
                </button>
              </div>

              {toolPreview.status === 'success' ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    {toolPreview.favicon && (
                      <img 
                        src={toolPreview.favicon} 
                        alt="Favicon"
                        className="w-12 h-12 rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {toolPreview.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {toolPreview.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <ExternalLink className="w-4 h-4" />
                        {toolPreview.url}
                      </div>
                    </div>
                  </div>

                  {toolPreview.screenshot && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Screenshot
                      </h4>
                      <img 
                        src={toolPreview.screenshot} 
                        alt="Website screenshot"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-6">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="font-medium">Preview Failed</h3>
                  </div>
                  <p className="text-red-600 dark:text-red-300">
                    {toolPreview.error_message || 'Could not fetch website information'}
                  </p>
                </div>
              )}

              <button
                onClick={() => setStep('details')}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* Step 3: Details Form */}
          {step === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tool Details
                </h2>
                <button
                  onClick={() => setStep('preview')}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ← Back
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Tool Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pricing Model
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['free', 'paid', 'freemium'].map((pricing) => (
                      <label key={pricing} className="flex items-center">
                        <input
                          type="radio"
                          name="pricing"
                          value={pricing}
                          checked={formData.pricing === pricing}
                          onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value as any }))}
                          className="mr-2"
                        />
                        <span className="text-sm capitalize">{pricing}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['web', 'desktop', 'mobile', 'api'].map((platform) => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="radio"
                          name="platform"
                          value={platform}
                          checked={formData.platform === platform}
                          onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value as any }))}
                          className="mr-2"
                        />
                        <span className="text-sm capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  
                  {/* Add new tag */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(newTag);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addTag(newTag)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Popular tags */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Popular tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.slice(0, 10).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected tags */}
                  {formData.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-blue-900 dark:hover:text-blue-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Tool'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'submit' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Tool Submitted Successfully!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Thank you for submitting a tool. Your submission has been received and will be processed accordingly.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={reset}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Another Tool
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}