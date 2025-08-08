"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessing = useRef(false); // 防重复调用标志

  const processOAuthCallback = useCallback(async () => {
    // 防止重复调用
    if (isProcessing.current) {
      console.log('OAuth callback already processing, skipping...');
      return;
    }
    
    isProcessing.current = true;
    
    try {
      setStatus('Processing...');
      setError(null);
      
      // 获取URL参数
      const token = searchParams?.get('token');
      const userParam = searchParams?.get('user');
      const code = searchParams?.get('code');
      const errorParam = searchParams?.get('error');
      
      console.log('Processing OAuth callback with params:', { 
        hasToken: !!token, 
        hasUser: !!userParam, 
        hasCode: !!code, 
        hasError: !!errorParam 
      });
      
      // 检查是否有token和user参数（来自后端OAuth处理后的重定向）
      if (token && userParam) {
        console.log('Processing OAuth callback with token and user from backend');
        
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          
          if (window.opener) {
            // 如果是popup窗口，发送消息给父窗口
            console.log('发送登录成功消息给父窗口:', { token, userData });
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              token,
              userData
            }, window.location.origin);
            
            setStatus('Login successful! Closing...');
            // 延长关闭时间，确保消息被父窗口接收
            setTimeout(() => {
              console.log('关闭popup窗口');
              window.close();
            }, 2000);
          } else {
            // 如果不是popup，直接存储token并跳转
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setStatus('Login successful! Redirecting...');
            setTimeout(() => router.push('/dashboard'), 1000);
          }
          return;
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          throw new Error('Invalid user data received');
        }
      }
      
      // 检查是否有code参数（传统OAuth flow）
      if (code) {
        console.log('Processing OAuth callback with code');
        
        try {
          // 发送到后端进行token交换，添加JSON头部确保返回JSON而非重定向
          const response = await fetch(`/api/auth/google/callback?code=${code}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to exchange code for token');
          }

          const data = await response.json();
          
          // 检查响应格式 (新的JSON格式: {success, token, user, message})
          if (data.success) {
            const { token, user } = data;
            
            if (window.opener) {
              console.log('发送登录成功消息给父窗口 (新格式):', { token, user });
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                token,
                userData: user
              }, window.location.origin);
              
              setStatus('Login successful! Closing...');
              setTimeout(() => {
                console.log('关闭popup窗口');
                window.close();
              }, 2000);
            } else {
              // 如果不是popup，直接存储token并跳转
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              setStatus('Login successful! Redirecting...');
              setTimeout(() => router.push('/dashboard'), 1000);
              return;
            }
          } else {
            // 兼容旧格式或处理API返回的userData
            if (window.opener) {
              console.log('发送登录成功消息给父窗口 (兼容格式):', data);
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                userData: data
              }, window.location.origin);
              
              setStatus('Login successful! Closing...');
              setTimeout(() => {
                console.log('关闭popup窗口');
                window.close();
              }, 2000);
            } else {
              // 如果不是popup，直接存储token并跳转
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user || data));
              setStatus('Login successful! Redirecting...');
              setTimeout(() => router.push('/dashboard'), 1000);
              return;
            }
          }
          
          setStatus('Login successful! Closing...');
          setTimeout(() => window.close(), 1000);
          return;
        } catch (error) {
          console.error('Code exchange failed:', error);
          throw error;
        }
      }

      // 检查是否有错误
      if (errorParam) {
        const errorDescription = searchParams?.get('error_description') || 'OAuth error';
        throw new Error(decodeURIComponent(errorDescription));
      }

      // 检查hash中的参数（Google Identity Services popup）
      if (typeof window !== 'undefined') {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const idToken = hashParams.get('id_token');
        
        if (idToken) {
          console.log('Processing popup callback with id_token');
          
          // 解析JWT token
          const parseJwt = (token: string) => {
            try {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              return JSON.parse(jsonPayload);
            } catch (error) {
              throw new Error('Invalid JWT token');
            }
          };

          const userInfo = parseJwt(idToken);
          const userData = {
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            id_token: idToken
          };

          // 发送消息给父窗口
          if (window.opener) {
            console.log('发送登录成功消息给父窗口 (JWT):', userData);
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              userData
            }, window.location.origin);
            
            setStatus('Login successful! Closing...');
            setTimeout(() => {
              console.log('关闭popup窗口');
              window.close();
            }, 2000);
          }
          return;
        }
      }

      throw new Error('No valid OAuth parameters found');

    } catch (error) {
      console.error('OAuth callback error:', error);
      const errorMessage = error instanceof Error ? error.message : 'OAuth processing failed';
      setError(errorMessage);
      
      // 发送错误消息给父窗口
      if (window.opener) {
        console.log('发送登录错误消息给父窗口:', errorMessage);
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: errorMessage
        }, window.location.origin);
        
        // 延迟关闭，确保错误消息被接收
        setTimeout(() => {
          console.log('关闭popup窗口 (错误)');
          window.close();
        }, 2000);
      }
    } finally {
      // 重置处理标志，允许用户手动重试
      setTimeout(() => {
        isProcessing.current = false;
      }, 1000);
    }
  }, [searchParams, router]);

  useEffect(() => {
    processOAuthCallback();
  }, [processOAuthCallback]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-red-500 text-3xl mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-4">Login Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.close()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">{status}</h2>
          <p className="text-gray-600">
            Processing your login request, please wait...
          </p>
        </div>
      </div>
    </div>
  );
}