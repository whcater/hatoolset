module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'card-bg': '#f8f9fa',
      },
      maxWidth: {
        container: '1320px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}; 