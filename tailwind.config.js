/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#248C54',
        'secondary': '#89618E',
        'accent': '#95DCE4',
      }
    },
  },
  plugins: [],
}
