import { categories } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';

export default function Home() {
  const { t } = useTranslation('common');
  
  return (
    <div className="max-w-[1320px] mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-[42px] font-bold mb-4">{t('home.title')}</h1>
        <p className="text-[18px] text-gray-600">{t('home.subtitle')}</p>
        <p className="text-[16px] text-gray-500 mt-2">{t('home.description')}</p>
      </div>
      
      {categories.map((category) => (
        <div key={category.id} className="mb-16">
          <h2 className="text-[28px] font-bold mb-8">{category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {category.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
}; 