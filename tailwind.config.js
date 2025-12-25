/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        whatsapp: {
          brand: '#25D366',
          'brand-dark': '#075E54',
          'brand-light': '#DCF8C6',
          // WhatsApp Official Colors
          chat: {
            light: '#f0f2f5',
            dark: '#0b141a', // Official dark mode background
          },
          message: {
            'in-light': '#ffffff',
            'out-light': '#DCF8C6',
            'in-dark': '#202c33', // Official received bubble
            'out-dark': '#005c4b', // Official sent bubble
          },
          header: {
            light: '#ffffff',
            dark: '#202c33',
          },
        },
        surface: {
          light: '#ffffff',
          dark: '#0b141a',
        },
        muted: {
          light: '#f3f4f6',
          dark: '#1f2933',
        },
      },
      screens: {
        'xs': '475px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'highlight': 'highlight 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        highlight: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
};