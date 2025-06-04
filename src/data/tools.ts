import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'productivity',
    name: '效率工具',
    tools: [
      {
        id: 'raycast',
        name: 'Raycast',
        description: '强大的Mac启动器和生产力工具',
        icon: '/icons/raycast.svg',
        path: 'https://raycast.com',
        tags: ['启动器', '效率', 'Mac', '免费'],
        features: [
          '快速启动应用程序',
          '文件搜索和预览',
          '计算器和单位转换',
          '剪贴板历史管理',
          '扩展插件生态'
        ],
        requirements: ['macOS 10.15+'],
        isNew: true
      },
      {
        id: 'cursor-reset',
        name: 'Cursor Trial Reset',
        description: 'Cursor编辑器试用期重置工具',
        icon: '/icons/cursor.svg',
        path: '/tools/cursor-reset',
        tags: ['开发工具', '编辑器', '试用'],
        features: [
          '重置Cursor试用期',
          '简单易用的界面',
          '支持多版本'
        ],
        requirements: ['Cursor编辑器']
      },
      {
        id: 'notion',
        name: 'Notion',
        description: '集笔记、数据库、项目管理于一体的工作空间',
        icon: '/icons/notion.svg',
        path: 'https://notion.so',
        tags: ['笔记', '项目管理', '协作', '免费增值'],
        features: [
          '灵活的页面编辑器',
          '数据库和表格',
          '团队协作',
          '模板库',
          'API集成'
        ],
        requirements: ['网络连接']
      },
      {
        id: 'obsidian',
        name: 'Obsidian',
        description: '基于链接的知识管理工具',
        icon: '/icons/obsidian.svg',
        path: 'https://obsidian.md',
        tags: ['知识管理', '笔记', '本地存储', '免费'],
        features: [
          '双向链接',
          '图谱视图',
          '插件生态',
          '本地文件存储',
          'Markdown支持'
        ],
        requirements: ['Windows/Mac/Linux']
      }
    ]
  },
  {
    id: 'development',
    name: '开发工具',
    tools: [
      {
        id: 'github',
        name: 'GitHub',
        description: '全球最大的代码托管平台',
        icon: '/icons/github.svg',
        path: 'https://github.com',
        tags: ['代码托管', 'Git', '协作', '开源'],
        features: [
          'Git仓库托管',
          'Issues和PR管理',
          'Actions CI/CD',
          '项目管理',
          '社区协作'
        ],
        requirements: ['Git基础知识']
      },
      {
        id: 'vscode',
        name: 'Visual Studio Code',
        description: '微软开发的免费代码编辑器',
        icon: '/icons/vscode.svg',
        path: 'https://code.visualstudio.com',
        tags: ['编辑器', 'IDE', '免费', '跨平台'],
        features: [
          '智能代码补全',
          '丰富的扩展生态',
          '集成终端',
          'Git集成',
          '调试支持'
        ],
        requirements: ['Windows/Mac/Linux']
      },
      {
        id: 'postman',
        name: 'Postman',
        description: 'API开发和测试平台',
        icon: '/icons/postman.svg',
        path: 'https://postman.com',
        tags: ['API', '测试', '开发', '免费增值'],
        features: [
          'API请求测试',
          '自动化测试',
          '团队协作',
          '文档生成',
          '监控和分析'
        ],
        requirements: ['网络连接']
      }
    ]
  },
  {
    id: 'design',
    name: '设计工具',
    tools: [
      {
        id: 'figma',
        name: 'Figma',
        description: '基于浏览器的协作设计工具',
        icon: '/icons/figma.svg',
        path: 'https://figma.com',
        tags: ['UI设计', '协作', '原型', '免费增值'],
        features: [
          '实时协作设计',
          '组件系统',
          '原型制作',
          '设计系统管理',
          '开发者交接'
        ],
        requirements: ['现代浏览器']
      },
      {
        id: 'canva',
        name: 'Canva',
        description: '简单易用的在线设计平台',
        icon: '/icons/canva.svg',
        path: 'https://canva.com',
        tags: ['平面设计', '模板', '简单', '免费增值'],
        features: [
          '丰富的设计模板',
          '拖拽式编辑',
          '素材库',
          '团队协作',
          '一键发布'
        ],
        requirements: ['网络连接']
      }
    ]
  },
  {
    id: 'payment',
    name: '支付工具',
    tools: [
      {
        id: 'stripe',
        name: 'Stripe',
        description: '开发者友好的在线支付解决方案',
        icon: '/icons/stripe.svg',
        path: 'https://stripe.com',
        tags: ['支付', 'API', '开发者', '全球'],
        features: [
          '简单的API集成',
          '多种支付方式',
          '全球支持',
          '详细的文档',
          '实时监控'
        ],
        requirements: ['开发技能', '商业账户']
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: '全球领先的在线支付平台',
        icon: '/icons/paypal.svg',
        path: 'https://paypal.com',
        tags: ['支付', '全球', '个人', '商业'],
        features: [
          '个人转账',
          '商业收款',
          '买家保护',
          '多币种支持',
          '移动应用'
        ],
        requirements: ['银行账户或信用卡']
      }
    ]
  },
  {
    id: 'ai',
    name: 'AI工具',
    tools: [
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        description: 'OpenAI开发的对话式AI助手',
        icon: '/icons/chatgpt.svg',
        path: 'https://chat.openai.com',
        tags: ['AI', '对话', '写作', '编程'],
        features: [
          '自然语言对话',
          '代码生成',
          '文本创作',
          '问题解答',
          '多语言支持'
        ],
        requirements: ['OpenAI账户'],
        isNew: true
      },
      {
        id: 'midjourney',
        name: 'Midjourney',
        description: 'AI图像生成工具',
        icon: '/icons/midjourney.svg',
        path: 'https://midjourney.com',
        tags: ['AI', '图像生成', '艺术', '创意'],
        features: [
          '文本到图像生成',
          '高质量艺术作品',
          '多种风格',
          '社区分享',
          '商业使用许可'
        ],
        requirements: ['Discord账户', '订阅计划']
      }
    ]
  }
]; 