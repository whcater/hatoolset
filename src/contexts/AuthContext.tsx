'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  email: string
  username: string
  full_name: string
  avatar_url: string
  role: string
  status: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (userData: any) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tokens, setTokens] = useState<{
    access_token: string
    refresh_token: string
  } | null>(null)

  const isAuthenticated = !!user && !!tokens

  // 从localStorage加载认证状态
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedUser = localStorage.getItem('auth_user')
        const savedTokens = localStorage.getItem('auth_tokens')
        
        if (savedUser && savedTokens) {
          setUser(JSON.parse(savedUser))
          setTokens(JSON.parse(savedTokens))
        }
      } catch (error) {
        console.error('Failed to load auth state:', error)
        // 清除损坏的数据
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_tokens')
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthState()
  }, [])

  // Google登录
  const login = async (userData: any) => {
    try {
      setIsLoading(true)

      // 如果是直接登录（后端已处理），直接使用提供的数据
      if (userData.isDirectLogin && userData.token) {
        const authUser = {
          id: userData.id,
          email: userData.email,
          username: userData.username || userData.name || userData.email.split('@')[0],
          full_name: userData.full_name || userData.name,
          avatar_url: userData.picture || userData.avatar || userData.avatar_url,
          role: userData.role || 'user',
          status: userData.status || 'active'
        }

        const authTokens = {
          access_token: userData.token,
          refresh_token: userData.refresh_token || userData.token // 如果没有refresh_token，使用同一个token
        }

        // 保存到状态
        setUser(authUser)
        setTokens(authTokens)

        // 保存到localStorage
        localStorage.setItem('auth_user', JSON.stringify(authUser))
        localStorage.setItem('auth_tokens', JSON.stringify(authTokens))

        console.log('Direct login successful:', authUser)
        return
      }

      // 传统登录流程：调用后端API
      const response = await fetch('/api/auth/google/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Login failed')
      }

      const { user: authUser, tokens: authTokens } = result.data

      // 保存到状态
      setUser(authUser)
      setTokens(authTokens)

      // 保存到localStorage
      localStorage.setItem('auth_user', JSON.stringify(authUser))
      localStorage.setItem('auth_tokens', JSON.stringify(authTokens))

      console.log('Login successful:', authUser)

    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 登出
  const logout = () => {
    try {
      // 清除状态
      setUser(null)
      setTokens(null)

      // 清除localStorage
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_tokens')

      // 可选：通知服务器登出
      if (tokens?.access_token) {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
        }).catch(console.error)
      }

      console.log('Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // 刷新Token
  const refreshToken = async () => {
    if (!tokens?.refresh_token) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: tokens.refresh_token,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Token refresh failed')
      }

      const newTokens = result.data.tokens

      // 更新tokens
      setTokens(newTokens)
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens))

      console.log('Token refreshed successfully')

    } catch (error) {
      console.error('Token refresh error:', error)
      // Token刷新失败，登出用户
      logout()
      throw error
    }
  }

  // 自动刷新token
  useEffect(() => {
    if (!tokens?.access_token) return

    // 解析JWT token获取过期时间
    try {
      const tokenPayload = JSON.parse(atob(tokens.access_token.split('.')[1]))
      const expirationTime = tokenPayload.exp * 1000 // 转换为毫秒
      const currentTime = Date.now()
      const timeUntilExpiry = expirationTime - currentTime
      
      // 在token过期前5分钟刷新
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000)

      if (refreshTime > 0) {
        const refreshTimer = setTimeout(() => {
          refreshToken().catch(console.error)
        }, refreshTime)

        return () => clearTimeout(refreshTimer)
      } else {
        // Token已过期，尝试刷新
        refreshToken().catch(console.error)
      }
    } catch (error) {
      console.error('Failed to parse token:', error)
    }
  }, [tokens])

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 获取认证的fetch函数
export const useAuthenticatedFetch = () => {
  const { logout, refreshToken } = useAuth()

  return async (url: string, options: RequestInit = {}) => {
    const tokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}')
    
    if (!tokens.access_token) {
      throw new Error('No access token available')
    }

    // 添加认证头
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${tokens.access_token}`,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    // 如果token过期，尝试刷新
    if (response.status === 401) {
      try {
        await refreshToken()
        
        // 重试请求
        const newTokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}')
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newTokens.access_token}`,
          },
        })

        return retryResponse
      } catch (error) {
        // 刷新失败，登出用户
        logout()
        throw error
      }
    }

    return response
  }
}