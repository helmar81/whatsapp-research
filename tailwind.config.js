/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* -------------------------
       * Fonts
       * ------------------------ */
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      /* -------------------------
       * Semantic color system
       * ------------------------ */
      colors: {
        whatsapp: {
          brand: '#25D366',
          brandDark: '#075E54',
          brandLight: '#DCF8C6',

          /* Chat surfaces */
          chat: {
            light: '#f0f2f5',
            dark: '#0b141a',
          },

          /* Messages */
          message: {
            inLight: '#ffffff',
            outLight: '#DCF8C6',
            inDark: '#202c33',
            outDark: '#005c4b',
          },

          /* UI */
          header: {
            light: '#ffffff',
            dark: '#202c33',
          },
        },

        /* App-level semantic tokens */
        surface: {
          light: '#ffffff',
          dark: '#0b141a',
        },
        muted: {
          light: '#f3f4f6',
          dark: '#1f2933',
        },
      },

      /* -------------------------
       * Transitions & motion
       * ------------------------ */
      transitionProperty: {
        colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
    },
  },

  plugins: [],
};
