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
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444', // Main red
          600: '#dc2626', // Darker red
          700: '#b91c1c',
        }
      }
    },
  },
  plugins: [],
}
