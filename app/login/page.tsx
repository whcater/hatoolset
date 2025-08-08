'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import Layout from '@/components/Layout'
import GoogleLogin from '@/components/GoogleLogin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated, isLoading, login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  // Google登录成功处理
  const handleGoogleLoginSuccess = async (userData: any) => {
    try {
      setError(null)
      await login(userData)
      // 登录成功后跳转到首页或之前访问的页面
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/'
      router.push(returnUrl)
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  // 如果正在检查认证状态
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  // 如果已经登录，显示加载状态（避免闪烁）
  if (isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('auth.signIn', 'Sign In')}
              </h1>
              <p className="text-muted-foreground">
                {t('auth.signInDescription', 'Sign in to  s and manage your submissions')}
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6 shadow-lg">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={(error) => setError(error)}
              />
              
              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-medium mb-3">
                  {t('auth.signInBenefits', 'What you can do after signing in:')}
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                    {t('auth.benefit1', 'Submit tools for review and inclusion')}
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                    {t('auth.benefit2', 'Track your submission status')}
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                    {t('auth.benefit3', 'Save your favorite tools')}
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                    {t('auth.benefit4', 'Get notified of review results')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {t('auth.noAccount', "Don't want to sign in?")} {' '}
                <button
                  onClick={() => router.push('/')}
                  className="text-primary hover:underline"
                >
                  {t('auth.browsTools', 'Browse tools as guest')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}