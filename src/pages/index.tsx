import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '@/components/Header';

const Home: NextPage = () => {
  return (
    <div>
      <Header />
      <main className="container py-10">
        <h1 className="text-4xl font-bold mb-6">高可用工具集</h1>
        <p className="text-lg">
          为独立开发者提供的工具导航和技术栈指南
        </p>
      </main>
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Home; 