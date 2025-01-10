import { Tool } from '../types';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Link 
      to={tool.path}
      className="block bg-[#f8f9fa] rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative w-[72px] h-[72px] mb-4">
          {tool.isNew && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[11px] bg-yellow-400 text-black rounded">
              NEW
            </span>
          )}
          <img 
            src={tool.icon} 
            alt={tool.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
          />
        </div>
        <h3 className="text-[16px] font-medium text-gray-900 mb-2">{tool.name}</h3>
        <p className="text-[14px] text-gray-500 leading-snug">{tool.description}</p>
      </div>
    </Link>
  );
}; 