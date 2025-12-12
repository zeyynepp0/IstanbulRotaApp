// import { COLORS } from './src/constants/colors';
const { COLORS } = require('./src/constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: COLORS,
    },
  },
  plugins: [],
};
