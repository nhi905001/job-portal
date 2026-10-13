import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Roboto', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDEEC4',
          300: '#FBDE96',
          400: '#F7C455',
          500: '#F5A623',
          600: '#D9890F',
          700: '#B0680A',
          800: '#8A4F0B',
          900: '#71400D',
          warm: '#F6B779',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
