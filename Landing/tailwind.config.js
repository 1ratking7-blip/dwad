/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0E14',
          darker: '#06080C',
          accent: '#00E676',
          accentDark: '#00B359',
          purple: '#D500F9',
          card: '#121824',
          border: '#1F293D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
