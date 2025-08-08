'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X, Heart, TrendingUp, Grid3X3, Home } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import SearchDropdown from './SearchDropdown'
import { APP_CONFIG } from '../config/constants'

export default function Header() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.tools'), href: '/tools', icon: Grid3X3 },
    { name: t('nav.categories'), href: '/categories', icon: Grid3X3 },
    { name: t('nav.trending'), href: '/trending', icon: TrendingUp },
    { name: t('nav.favorites'), href: '/favorites', icon: Heart },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="hidden font-bold sm:inline-block text-lg">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search (Desktop) */}
            <div className="hidden lg:block">
              <SearchDropdown 
                placeholder={t('hero.searchPlaceholder')}
                className="w-64"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden h-9 w-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchDropdown 
                placeholder={t('hero.searchPlaceholder')}
                className="w-full"
              />
            </div>

            {/* Mobile Menu Items */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 