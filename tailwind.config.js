// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: "#25D366",
        "chat-bg-dark": "#0b141a",
        "header-dark": "#202c33",
        "message-in-dark": "#1f2c34",
      },
    },
  },
  plugins: [],
};