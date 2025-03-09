import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻译资源
const resources = {
  en: {
    translation: {
      'nav.home': 'Home',
      'nav.tools': 'Tools',
      'nav.techStacks': 'Tech Stacks',
      'nav.caseStudies': 'Case Studies',
      'nav.about': 'About',
      // 其他翻译...
    }
  },
  zh: {
    translation: {
      'nav.home': '首页',
      'nav.tools': '工具集',
      'nav.techStacks': '技术栈',
      'nav.caseStudies': '案例分析',
      'nav.about': '关于我们',
      // 其他翻译...
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 