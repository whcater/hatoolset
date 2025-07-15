/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // 图片配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // 开发环境可以禁用优化
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787',
  },

  // TypeScript 配置
  typescript: {
    // 在生产构建期间忽略 TypeScript 错误
    ignoreBuildErrors: false,
  },

  // ESLint 配置
  eslint: {
    // 在生产构建期间忽略 ESLint 错误
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig 