import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '@/hooks/useAuth';
import Header from '@/components/Header';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { locale } = router;

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white" lang={locale}>
        <Header />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp); 