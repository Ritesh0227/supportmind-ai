/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#0f172a',
          950: '#0a0f1d',
        },
        brand: {
          blue: '#2563eb',
          'blue-hover': '#1d4ed8',
          violet: '#7c3aed',
          'violet-hover': '#6d28d9',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        xs: '0.125rem',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(15, 23, 42, 0.06)',
        xs: '0 1px 3px 0 rgba(15, 23, 42, 0.07)',
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        elevated: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};
