import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // الأزرق الأساسي
        secondary: '#9333EA', // الأرجواني الثانوي
        accent: '#F59E0B', // العنبر للتأكيد
        danger: '#EF4444', // الأحمر للتنبيهات
        background: '#F3F4F6', // لون الخلفية الفاتح
        "primary-dark": '#1E40AF',
        "secondary-dark": '#7E22CE',
        "accent-dark": '#D97706',
        "danger-dark": '#B91C1C',
      },
      fontFamily: {
        sans: ['"Noto Sans Arabic"', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
};