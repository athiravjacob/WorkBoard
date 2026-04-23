/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1bafd',
          400: '#6d90fa',
          500: '#4664f6',
          600: '#3045ec',
          700: '#2634d9',
          800: '#242cb1',
          900: '#22298d',
          950: '#151856',
        },
      },
    },
  },
  plugins: [],
}
