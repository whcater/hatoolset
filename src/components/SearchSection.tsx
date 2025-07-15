'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, X, Tag, Star, Clock, TrendingUp, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toolService } from '../services/toolService'
import ToolCard from './ToolCard'
import LoadingSpinner from './ui/LoadingSpinner'
import type { Tool, Category, ToolsResponse } from '../services/toolService'

export default function SearchSection() {
  const { t } = useTranslation()
  const router = useRouter()
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('relevance')
  const [priceFilter, setPriceFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  
  // Data state
  const [categories, setCategories] = useState<Category[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'updated', label: 'Recently Updated' },
  ]

  const priceOptions = [
    { value: '', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
    { value: 'freemium', label: 'Freemium' },
  ]

  const platformOptions = [
    { value: '', label: 'All Platforms' },
    { value: 'web', label: 'Web' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'api', label: 'API' },
  ]

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          toolService.getCategories(),
          toolService.getTags()
        ])
        
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data)
        }
        
        if (tagsResponse.success && Array.isArray(tagsResponse.data)) {
          setPopularTags(tagsResponse.data.slice(0, 8))
        }
      } catch (err) {
        console.error('Failed to load initial data:', err)
      }
    }

    loadInitialData()
  }, [])

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim() || selectedCategory || selectedTags.length > 0) {
        performSearch()
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery, selectedCategory, selectedTags, sortBy, priceFilter, platformFilter, currentPage])

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim() && !selectedCategory && selectedTags.length === 0) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchParams = {
        q: searchQuery.trim(),
        category: selectedCategory,
        tags: selectedTags,
        sort: sortBy as 'relevance' | 'popular' | 'rating' | 'newest' | 'updated',
        pricing: priceFilter,
        platform: platformFilter,
        page: currentPage,
        limit: 12
      }

      const response: ToolsResponse = await toolService.searchTools(searchQuery, searchParams)
      
      setSearchResults(response.tools)
      setTotalPages(response.totalPages)
      setTotalResults(response.total)
      setHasSearched(true)
    } catch (err) {
      console.error('Search failed:', err)
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory, selectedTags, sortBy, priceFilter, platformFilter, currentPage])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedTags([])
    setSortBy('relevance')
    setPriceFilter('')
    setPlatformFilter('')
    setCurrentPage(1)
  }

  const handleQuickFilter = (type: 'featured' | 'trending' | 'recent') => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedTags([])
    setCurrentPage(1)
    
    switch (type) {
      case 'featured':
        // Get featured tools
        toolService.getFeaturedTools().then(response => {
          if (response.success && Array.isArray(response.data)) {
            setSearchResults(response.data)
          } else {
            setSearchResults([])
          }
          setHasSearched(true)
        })
        break
      case 'trending':
        // Get trending tools
        toolService.getTrendingTools().then(response => {
          if (response.success && Array.isArray(response.data)) {
            setSearchResults(response.data)
          } else {
            setSearchResults([])
          }
          setHasSearched(true)
        })
        break
      case 'recent':
        setSortBy('newest')
        performSearch()
        break
    }
  }

  const handleToolView = async (toolId: number) => {
    try {
      await toolService.recordView(toolId)
      router.push(`/tools/${toolId}`)
    } catch (err) {
      console.error('Failed to record view:', err)
    }
  }

  const handleToolFavorite = async (toolId: number) => {
    try {
      // Implement favorite functionality
      console.log('Favorite tool:', toolId)
    } catch (err) {
      console.error('Failed to favorite tool:', err)
    }
  }

  const handleToolShare = async (toolId: number) => {
    try {
      await toolService.recordShare(toolId)
      
      const tool = searchResults.find(t => t.id === toolId)
      if (tool) {
        const shareUrl = `${window.location.origin}/tools/${toolId}`
        await navigator.clipboard.writeText(shareUrl)
        // TODO: Show success toast
      }
    } catch (err) {
      console.error('Failed to share tool:', err)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tools, categories, or tags..."
              className="w-full pl-12 pr-24 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button 
              onClick={() => handleQuickFilter('featured')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium hover:from-yellow-500 hover:to-orange-600 transition-all"
            >
              <Star className="h-4 w-4" />
              <span>Featured</span>
            </button>
            <button 
              onClick={() => handleQuickFilter('trending')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full text-sm font-medium hover:from-red-500 hover:to-pink-600 transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </button>
            <button 
              onClick={() => handleQuickFilter('recent')}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              <Clock className="h-4 w-4" />
              <span>Recently Added</span>
            </button>
            {popularTags.slice(0, 4).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border hover:bg-accent'
                }`}
              >
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-background border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Advanced Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {priceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {platformOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Selected Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleTagToggle(tag)}
                          className="ml-2 hover:bg-primary/80 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              <div className="mt-6 text-right">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={performSearch}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && hasSearched && (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Search Results</h3>
                  <p className="text-sm text-muted-foreground">
                    {totalResults} tools found
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>
              </div>

              {/* Results Grid */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {searchResults.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onView={handleToolView}
                      onFavorite={handleToolFavorite}
                      onShare={handleToolShare}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No tools found matching your criteria.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
} 