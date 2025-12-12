/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Ana mavi rengin
          light: '#DBEAFE',   // Açık mavi (header subtitle vb.)
          dark: '#1E40AF',
        },
        background: {
          DEFAULT: '#F9FAFB', // Ana arkaplan rengin
          card: '#FFFFFF',
        },
        text: {
          main: '#1F2937',    // Koyu gri metinler
          sub: '#6B7280',     // Açık gri metinler
          light: '#9CA3AF',   // Daha silik metinler
        },
        traffic: {
          bg: '#FEF3C7',
          border: '#F59E0B',
          text: '#92400E',
        }
      },
    },
  },
  plugins: [],
}