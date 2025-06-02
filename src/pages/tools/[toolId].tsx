import { useRouter } from 'next/router';
import { categories } from '@/data/tools';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, GetStaticPaths } from 'next';
import type { Tool } from '@/types';

export default function ToolDetail() {
  const router = useRouter();
  const { toolId } = router.query;
  const { t } = useTranslation('common');
  
  const tool = categories
    .flatMap(category => category.tools)
    .find((tool: Tool) => tool.id === toolId);
  
  if (!tool) {
    return <div>Tool not found</div>;
  }
  
  return (
    <div className="max-w-[1320px] mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-4">{tool.name}</h1>
        <p className="text-gray-600 mb-6">{tool.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('tools.features')}</h2>
            <ul className="list-disc list-inside space-y-2">
              {tool.features?.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('tools.requirements')}</h2>
            <ul className="list-disc list-inside space-y-2">
              {tool.requirements?.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allTools = categories.flatMap(category => category.tools);
  const paths = allTools.map((tool: Tool) => ({
    params: { toolId: tool.id },
    locale: 'zh'
  })).concat(
    allTools.map((tool: Tool) => ({
      params: { toolId: tool.id },
      locale: 'en'
    }))
  );

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
}; 