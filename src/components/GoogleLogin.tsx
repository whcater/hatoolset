'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Chrome } from 'lucide-react'

interface GoogleLoginProps {
  onSuccess: (userData: any) => void
  onError?: (error: string) => void
  className?: string
}

const SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid';
const GoogleLogin: React.FC<GoogleLoginProps> = ({ 
  onSuccess, 
  onError, 
  className = '' 
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  // 使用弹出窗口进行Google登录
  const handlePopupLogin = async () => {
    try {
      setIsLoading(true)
      
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      
      if (!clientId) {
        throw new Error('Google Client ID未配置')
      }

      // OAuth 2.0授权URL - 改用code模式而不是id_token
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      authUrl.searchParams.set('client_id', clientId)
      authUrl.searchParams.set('redirect_uri', window.location.origin + '/oauth-callback')
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', SCOPE)
      authUrl.searchParams.set('access_type', 'offline')
      authUrl.searchParams.set('prompt', 'consent')
      authUrl.searchParams.set('state', Math.random().toString(36).substring(7))

      // 打开弹出窗口
      const popup = window.open(
        authUrl.toString(),
        'google-login',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )

      if (!popup) {
        throw new Error('弹出窗口被阻止，请允许弹出窗口')
      }

      // 清理函数
      const cleanup = () => {
        clearTimeout(timeoutId)
        clearInterval(popupCheckInterval)
        window.removeEventListener('message', messageHandler)
        try {
          if (!popup.closed) {
            popup.close()
          }
        } catch (e) {
          // 忽略关闭窗口时可能的错误
        }
      }

      // 消息处理器
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          console.log('收到登录成功消息:', event.data)
          cleanup()
          
          // 如果有token，说明后端已经处理完OAuth，直接返回完整数据
          if (event.data.token) {
            onSuccess({
              ...event.data.userData,
              token: event.data.token,
              isDirectLogin: true // 标记为直接登录，无需再次API调用
            })
          } else {
            onSuccess(event.data.userData)
          }
          setIsLoading(false)
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          console.log('收到登录错误消息:', event.data.error)
          cleanup()
          onError?.(event.data.error)
          setIsLoading(false)
        } else if (event.data.type === 'GOOGLE_AUTH_CODE') {
          // 处理授权码
          cleanup()
          handleAuthCode(event.data.code)
        }
      }

      // 检查popup窗口是否被关闭
      const popupCheckInterval = setInterval(() => {
        if (popup.closed) {
          console.log('检测到popup窗口被关闭')
          cleanup()
          setIsLoading(false)
          onError?.('登录窗口被关闭')
        }
      }, 1000)

      // 设置超时机制
      const timeoutId = setTimeout(() => {
        console.log('登录超时')
        cleanup()
        setIsLoading(false)
        onError?.('登录超时')
      }, 300000) // 5分钟超时
      
      window.addEventListener('message', messageHandler)

    } catch (error) {
      console.error('弹出窗口登录失败:', error)
      setIsLoading(false)
      onError?.(error instanceof Error ? error.message : '登录失败')
    }
  }

  // 处理授权码
  const handleAuthCode = async (code: string) => {
    try {
      // 调用后端API交换token
      const response = await fetch('/api/auth/google/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('Token exchange failed')
      }

      const userData = await response.json()
      onSuccess(userData)
    } catch (error) {
      console.error('Token exchange failed:', error)
      onError?.(error instanceof Error ? error.message : 'Token exchange failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`google-login ${className}`}>
      {/* Google登录按钮 */}
      <button
        onClick={handlePopupLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        ) : (
          <Chrome className="w-5 h-5 text-gray-600" />
        )}
        <span className="text-gray-700 font-medium">
          {isLoading ? t('auth.signingIn', 'Signing in...') : t('auth.signInWithGoogle', 'Sign in with Google')}
        </span>
      </button>
    </div>
  )
}

export default GoogleLogin