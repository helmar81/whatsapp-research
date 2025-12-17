/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 REQUIRED for manual dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#075E54',
          light: '#DCF8C6',
          'chat-bg-dark': '#0b141a',
          'message-out-dark': '#005c4b',
          'message-in-dark': '#202c33',
          'header-dark': '#202c33',
        },
      },
    },
  },
  plugins: [],
};
