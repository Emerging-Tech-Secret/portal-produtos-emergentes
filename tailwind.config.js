/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        itau: {
          orange: '#EC7000',
          blue: '#003F88',
          gray: {
            100: '#F8F9FA',
            200: '#E9ECEF',
            300: '#DEE2E6',
            400: '#CED4DA',
            500: '#ADB5BD',
            600: '#6C757D',
            700: '#495057',
            800: '#343A40',
            900: '#212529'
          }
        }
      },
      fontFamily: {
        sans: ['Itau Display', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
};