/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fin-bg': '#0f172a', // Slate 900
        'fin-card': 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity
        'fin-border': 'rgba(148, 163, 184, 0.2)', // Slate 400
        'fin-accent': '#38bdf8', // Sky 400
        'fin-success': '#34d399', // Emerald 400
        'fin-danger': '#f87171', // Red 400
        'fin-text-primary': '#f8fafc', // Slate 50
        'fin-text-secondary': '#94a3b8', // Slate 400
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
