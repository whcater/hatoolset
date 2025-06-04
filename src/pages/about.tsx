import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Users, 
  Zap, 
  Shield, 
  Heart, 
  Lightbulb,
  Github,
  Mail,
  Twitter
} from 'lucide-react';
import type { GetStaticProps } from 'next';

export default function About() {
  const router = useRouter();

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: '精准分类',
      description: '基于AI智能分析，为每个工具提供精准的分类和标签，帮您快速找到所需工具。'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: '社区驱动',
      description: '由开发者和创作者社区共同维护，确保工具信息的及时性和准确性。'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: '智能推荐',
      description: '基于您的使用习惯和偏好，智能推荐最适合的工具和工作流。'
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: '质量保证',
      description: '严格的审核机制，确保收录的每个工具都具有高质量和实用价值。'
    }
  ];

  const stats = [
    { number: '500+', label: '精选工具' },
    { number: '50+', label: '工具分类' },
    { number: '10K+', label: '活跃用户' },
    { number: '99%', label: '用户满意度' }
  ];

  const team = [
    {
      name: '张三',
      role: '产品负责人',
      avatar: '/avatars/zhang.jpg',
      description: '10年产品经验，专注于开发者工具生态'
    },
    {
      name: '李四',
      role: '技术负责人',
      avatar: '/avatars/li.jpg',
      description: '全栈工程师，AI和机器学习专家'
    },
    {
      name: '王五',
      role: '设计负责人',
      avatar: '/avatars/wang.jpg',
      description: 'UX设计师，致力于创造优秀的用户体验'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          关于高可用工具集
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          我们致力于为开发者、设计师和创作者提供最全面、最实用的工具导航平台，
          通过智能分析和社区协作，帮助您发现和使用最适合的工具。
        </p>
      </div>

      {/* 使命愿景 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
          <div className="flex items-center mb-4">
            <Target className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">我们的使命</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            让每个创作者都能轻松找到最适合的工具，提高工作效率，释放创造力。
            我们相信好的工具能够改变工作方式，推动创新和进步。
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">我们的愿景</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            成为全球最受信赖的工具发现平台，构建一个开放、协作、创新的工具生态系统，
            让优秀的工具被更多人发现和使用。
          </p>
        </div>
      </div>

      {/* 核心特色 */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">核心特色</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据统计 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 mb-20 text-white">
        <h2 className="text-3xl font-bold text-center mb-12">平台数据</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 团队介绍 */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">核心团队</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 联系我们 */}
      <div className="bg-gray-50 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-6">联系我们</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          有任何建议、反馈或合作意向，欢迎随时联系我们。
          我们重视每一个用户的声音，期待与您一起打造更好的工具生态。
        </p>
        
        <div className="flex justify-center gap-6 mb-8">
          <a 
            href="mailto:contact@toolset.com" 
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-5 h-5" />
            邮件联系
          </a>
          <a 
            href="https://github.com/toolset" 
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>
          <a 
            href="https://twitter.com/toolset" 
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            Twitter
          </a>
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => router.push('/submit')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            提交工具
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/')}
          >
            浏览工具
          </Button>
        </div>
      </div>

      {/* 底部感谢 */}
      <div className="text-center mt-16 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Heart className="w-5 h-5 text-red-500" />
          <span>感谢所有贡献者和用户的支持</span>
        </div>
      </div>
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