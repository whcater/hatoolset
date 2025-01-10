import { Link } from 'react-router-dom';
import { categories } from '../data/tools';

export const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="flex items-center h-[60px]">
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-8">
              <span className="text-xl font-bold">HA Tools</span>
            </Link>
            
            <nav className="flex items-center space-x-1">
              {categories.map((category) => (
                <div key={category.id} className="relative group">
                  <button className="flex items-center h-[60px] px-4 text-[15px] hover:bg-gray-50">
                    <span>{category.name}</span>
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute left-0 hidden pt-1 group-hover:block z-50">
                    <div className="bg-white shadow-lg border border-gray-100 rounded-lg py-2 w-[280px]">
                      {category.tools.map((tool) => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className="flex items-center px-4 py-2.5 text-[14px] hover:bg-gray-50"
                        >
                          <div className="w-8 h-8 flex items-center justify-center mr-3">
                            <img src={tool.icon} alt="" className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{tool.name}</div>
                            <div className="text-[13px] text-gray-500 mt-0.5">{tool.description}</div>
                          </div>
                          {tool.isNew && (
                            <span className="ml-auto px-1.5 py-0.5 text-[11px] bg-yellow-400 text-black rounded">NEW</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="ml-auto flex items-center">
            <Link 
              to="/"
              className="flex items-center px-4 py-1.5 text-[14px] text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              开始使用
              <span className="ml-1.5 px-1.5 py-0.5 text-[11px] bg-yellow-400 text-black rounded">Beta</span>
            </Link>
            <Link 
              to="/login"
              className="ml-4 px-4 py-1.5 text-[14px] text-gray-600 hover:text-black"
            >
              登录
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}; 