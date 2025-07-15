'use client'

import { ReactNode, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import '../lib/i18n' // 导入i18n配置

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
} 