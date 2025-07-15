'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Github, Twitter, Heart } from 'lucide-react'
import { APP_CONFIG } from '../config/constants'

export default function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { name: t('common.home'), href: '/' },
    { name: t('nav.tools'), href: '/tools' },
    { name: t('nav.categories'), href: '/categories' },
    { name: t('nav.trending'), href: '/trending' },
  ]

  const supportLinks = [
    { name: t('footer.documentation'), href: '/docs' },
    { name: t('footer.api'), href: '/api' },
    { name: t('footer.contact'), href: '/contact' },
    { name: t('footer.about'), href: '/about' },
  ]

  const legalLinks = [
    { name: t('footer.privacy'), href: '/privacy' },
    { name: t('footer.terms'), href: '/terms' },
  ]

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-lg">{APP_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a
                href={APP_CONFIG.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={APP_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified about new tools and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-l-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-r-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center space-x-4">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by HAI Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 