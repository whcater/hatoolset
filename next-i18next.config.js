module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
  },
  defaultNS: 'common',
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}; 