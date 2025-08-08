'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toolService, Tool } from '../../../src/services/toolService';
import { ToolDetail } from '../../../src/components/ToolDetail';
import { LoadingSpinner } from '../../../src/components/ui/LoadingSpinner';
import { useTranslation } from 'react-i18next';

export default function ToolDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTool(Number(id));
    }
  }, [id]);

  const loadTool = async (toolId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // 记录工具查看
      await toolService.recordView(toolId);
      
      // 获取工具详情
      const toolData = await toolService.getToolById(toolId);
      setTool(toolData);
    } catch (err) {
      console.error('Error loading tool:', err);
      setError(t('error.loadTool'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('error.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('button.goBack')}
          </button>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('error.toolNotFound')}
          </h2>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('button.goBack')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToolDetail tool={tool} />
    </div>
  );
}