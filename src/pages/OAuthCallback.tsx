import React, { useEffect, useState } from 'react';

interface OAuthCallbackProps {
  onSuccess?: (userData: any) => void;
  onError?: (error: string) => void;
}

const OAuthCallback: React.FC<OAuthCallbackProps> = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // 获取URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        console.log('processOAuthCallback urlParams、 hashParams', urlParams, hashParams);
        // 检查是否有id_token（来自Google Identity Services popup）
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
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              userData
            }, window.location.origin);
          }
          
          setStatus('Login successful! Closing...');
          setTimeout(() => window.close(), 1000);
          return;
        }

        // 检查是否有code参数（传统OAuth flow）
        const code = urlParams.get('code');
        if (code) {
          console.log('Processing OAuth callback with code');
          
          try {
            // 发送到后端进行token交换
            // const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8788';
            const response = await fetch(`/api/auth/google/callback?code=${code}`);
            
            if (!response.ok) {
              throw new Error('Failed to exchange code for token');
            }

            const data = await response.json();
            
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                token: data.token,
                userData: data.user || data
              }, window.location.origin);
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
        const errorParam = urlParams.get('error') || hashParams.get('error');
        if (errorParam) {
          const errorDescription = urlParams.get('error_description') || hashParams.get('error_description') || 'OAuth error';
          throw new Error(decodeURIComponent(errorDescription));
        }

        throw new Error('No valid OAuth parameters found');

      } catch (error) {
        console.error('OAuth callback error:', error);
        const errorMessage = error instanceof Error ? error.message : 'OAuth processing failed';
        setError(errorMessage);
        
        // 发送错误消息给父窗口
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: errorMessage
          }, window.location.origin);
        }
      }
    };

    processOAuthCallback();
  }, []);

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
};

export default OAuthCallback;