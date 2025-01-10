import { useParams } from 'react-router-dom';
import { categories } from '../data/tools';

export const ToolDetail = () => {
  const { toolId } = useParams();
  const tool = categories
    .flatMap(category => category.tools)
    .find(t => t.id === toolId);

  if (!tool) {
    return <div className="text-center py-12">工具不存在</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">{tool.name}</h1>
      <p className="text-gray-600">{tool.description}</p>
      {/* 这里添加工具的具体功能实现 */}
    </div>
  );
}; 