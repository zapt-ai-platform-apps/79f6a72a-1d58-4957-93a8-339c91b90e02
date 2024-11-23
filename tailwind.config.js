import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6200EE', // Deep Purple
        secondary: '#03DAC5', // Teal
        accent: '#FF0266', // Pink
        background: '#FFFFFF',
        'background-alt': '#F5F5F5',
        text: '#212121',
        success: '#388E3C', // Green
        error: '#D32F2F', // Red
        warning: '#FBC02D', // Amber
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