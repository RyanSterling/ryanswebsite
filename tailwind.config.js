/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#111',
        'brand-card': '#1D1D1D',
        'brand-orange': '#FF5125',
        'brand-blue': '#1398F8',
      },
      fontFamily: {
        'soehne': ['Soehne', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
