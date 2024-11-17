import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#9333EA',
        accent: '#F59E0B',
        danger: '#EF4444',
        background: '#F3F4F6',
        "primary-dark": '#1E40AF',
        "secondary-dark": '#7E22CE',
        "accent-dark": '#D97706',
        "danger-dark": '#B91C1C',
        gray: {
          800: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans Arabic"', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
};