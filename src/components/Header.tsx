import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui';
import { Menu, X, Globe, User, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 语言切换
  const changeLanguage = (lng: string) => {
    router.push(router.pathname, router.asPath, { locale: lng });
  };
  
  // 导航菜单项
  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/tools', label: t('nav.tools') },
    { href: '/tech-stacks', label: t('nav.techStacks') },
    { href: '/case-studies', label: t('nav.caseStudies') },
    { href: '/about', label: t('nav.about') },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">高可用工具集</span>
        </Link>
        
        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* 搜索按钮 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/search')}
          className="mr-2"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">{t('search')}</span>
        </Button>
        
        {/* 用户菜单 */}
        <div className="hidden md:flex items-center space-x-2">
          {/* 语言切换 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('zh')}>
                中文
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* 用户菜单或登录按钮 */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t('userMenu')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/favorites')}>
                  {t('favorites')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push('/login')}>
              {t('login')}
            </Button>
          )}
        </div>
        
        {/* 移动端菜单 */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">菜单</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b py-4">
                <span className="text-lg font-bold">高可用工具集</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex flex-col gap-4 py-6">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className="text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-auto border-t py-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Button variant="outline" onClick={() => {
                      router.push('/profile');
                      setIsMenuOpen(false);
                    }}>
                      {t('profile')}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}>
                      {t('logout')}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => {
                    router.push('/login');
                    setIsMenuOpen(false);
                  }}>
                    {t('login')}
                  </Button>
                )}
                
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      changeLanguage('zh');
                      setIsMenuOpen(false);
                    }}
                  >
                    中文
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      changeLanguage('en');
                      setIsMenuOpen(false);
                    }}
                  >
                    English
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header; 