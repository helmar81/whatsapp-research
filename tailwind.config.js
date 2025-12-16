/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode switching via the 'dark' class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Sets Inter as the default sans font
      },
      colors: {
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#075E54',
          light: '#DCF8C6',
          // Custom dark mode palette from your script
          'chat-bg-dark': '#0b141a',
          'message-out-dark': '#005c4b',
          'message-in-dark': '#202c33',
          'header-dark': '#202c33',
        }
      },
      animation: {
        'highlight': 'highlight 2s ease-in-out infinite', // Custom highlight animation
      },
      keyframes: {
        highlight: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}