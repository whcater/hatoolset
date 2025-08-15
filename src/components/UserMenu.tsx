'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  UserCircle,
  CreditCard,
  Shield,
  HelpCircle,
  Bookmark
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface UserMenuProps {
  className?: string
}

const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const { t } = useTranslation()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 退出登录
  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // 菜单项点击处理
  const handleMenuClick = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  // 如果正在加载，显示骨架屏
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="h-9 w-9 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  // 未登录状态
  if (!isAuthenticated || !user) {
    return (
      <div className={`${className}`}>
        <button
          onClick={() => router.push('/login')}
          className="h-9 w-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center group"
          title={t('auth.signIn', 'Sign In')}
        >
          <User className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 用户头像按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 h-9 px-3 rounded-lg border border-border bg-background hover:bg-accent transition-all duration-200 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* 用户头像 */}
        <div className="relative">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || user.username}
              className="h-6 w-6 rounded-full ring-2 ring-background group-hover:ring-accent-foreground/20 transition-all"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium ${user.avatar_url ? 'hidden' : ''}`}>
            {(user.full_name || user.username || user.email)[0]?.toUpperCase()}
          </div>
          
          {/* 在线状态指示器 */}
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 border-2 border-background rounded-full" />
        </div>

        {/* 用户名 (桌面端显示) */}
        <span className="hidden sm:block text-sm font-medium text-foreground max-w-24 truncate">
          {user.username || user.full_name}
        </span>

        {/* 下拉箭头 */}
        <ChevronDown className={`hidden sm:block h-3 w-3 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg py-2 z-50 animate-in slide-in-from-top-1 duration-200">
          {/* 用户信息区域 */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              {/* 大头像 */}
              <div className="relative">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || user.username}
                    className="h-10 w-10 rounded-full ring-2 ring-border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium ${user.avatar_url ? 'hidden' : ''}`}>
                  {(user.full_name || user.username || user.email)[0]?.toUpperCase()}
                </div>
              </div>
              
              {/* 用户信息 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.full_name || user.username}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                {user.role && user.role !== 'user' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 菜单项 */}
          <div className="py-2">
            {/* 个人资料 */}
            <button
              onClick={() => handleMenuClick('/profile')}
              className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <UserCircle className="h-4 w-4 mr-3 text-muted-foreground" />
              {t('menu.profile', 'Profile')}
            </button>

            {/* 收藏夹 */}
            <button
              onClick={() => handleMenuClick('/favorites')}
              className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Bookmark className="h-4 w-4 mr-3 text-muted-foreground" />
              {t('menu.favorites', 'Favorites')}
            </button>

            {/* 设置 */}
            <button
              onClick={() => handleMenuClick('/profile#settings')}
              className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
              {t('menu.settings', 'Settings')}
            </button>

            {/* 账单 */}
            <button
              onClick={() => handleMenuClick('/billing')}
              className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <CreditCard className="h-4 w-4 mr-3 text-muted-foreground" />
              {t('menu.billing', 'Billing')}
            </button>
          </div>

          <div className="border-t border-border">
            {/* 帮助 */}
            <button
              onClick={() => handleMenuClick('/help')}
              className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <HelpCircle className="h-4 w-4 mr-3 text-muted-foreground" />
              {t('menu.help', 'Help & Support')}
            </button>

            {/* 退出登录 */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              {t('auth.signOut', 'Sign Out')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu