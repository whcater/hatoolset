'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Clock, TrendingUp, Tag, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { toolService } from '../services/toolService'
import type { Tool, Category } from '../services/toolService'

interface SearchDropdownProps {
  placeholder?: string
  className?: string
}

export default function SearchDropdown({ 
  placeholder = 'Search tools, categories...', 
  className = '' 
}: SearchDropdownProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<{
    tools: Tool[]
    categories: Category[]
    suggestions: string[]
  }>({
    tools: [],
    categories: [],
    suggestions: []
  })
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 加载最近搜索
  useEffect(() => {
    const saved = localStorage.getItem('hai-toolset-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5))
      } catch (e) {
        console.error('Failed to parse recent searches:', e)
      }
    }
  }, [])

  // 搜索结果获取
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true)
        try {
          const [toolsResponse, categoriesResponse] = await Promise.all([
            toolService.getTools({ q: query, limit: 5 }),
            toolService.getCategories()
          ])
          
          const filteredCategories = categoriesResponse.success 
            ? categoriesResponse.data.filter(cat => 
                cat.name.toLowerCase().includes(query.toLowerCase())
              ).slice(0, 3)
            : []

          // 生成搜索建议
          const suggestions = [
            ...new Set([
              ...toolsResponse.tools.map(tool => tool.name),
              ...toolsResponse.tools.flatMap(tool => tool.tags || []),
              ...filteredCategories.map(cat => cat.name)
            ])
          ].slice(0, 4)

          setResults({
            tools: toolsResponse.tools,
            categories: filteredCategories,
            suggestions
          })
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setResults({ tools: [], categories: [], suggestions: [] })
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [query])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      // 保存到最近搜索
      const newRecentSearches = [
        searchTerm,
        ...recentSearches.filter(item => item !== searchTerm)
      ].slice(0, 5)
      
      setRecentSearches(newRecentSearches)
      localStorage.setItem('hai-toolset-recent-searches', JSON.stringify(newRecentSearches))
      
      // 跳转到搜索页面
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('hai-toolset-recent-searches')
  }

  const showDropdown = isOpen && (
    query.trim().length >= 2 || 
    recentSearches.length > 0 ||
    results.tools.length > 0
  )

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </form>

      {/* 下拉搜索结果 */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {/* 加载状态 */}
          {loading && (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <div className="mt-2 text-sm">Searching...</div>
            </div>
          )}

          {/* 搜索结果 */}
          {!loading && (
            <div className="py-2">
              {/* 工具结果 */}
              {results.tools.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                    Tools
                  </div>
                  {results.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-accent transition-colors"
                      onClick={() => {
                        handleSearch(tool.name)
                        setIsOpen(false)
                      }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{tool.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {tool.category_name} • {tool.platform}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* 分类结果 */}
              {results.categories.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                    Categories
                  </div>
                  {results.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/search?category=${category.id}`}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-accent transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {category.tool_count} tools
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* 最近搜索 */}
              {query.trim().length < 2 && recentSearches.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((searchTerm, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(searchTerm)
                        handleSearch(searchTerm)
                        setIsOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-accent transition-colors text-left"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{searchTerm}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 查看所有结果 */}
              {query.trim().length >= 2 && (
                <div className="border-t p-2">
                  <button
                    onClick={() => {
                      handleSearch(query)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    <span>View all results for "{query}"</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}