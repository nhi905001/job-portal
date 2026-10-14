import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    boxShadow: {
      none: 'none',
      DEFAULT: 'none',
      sm: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
      '3xl': 'none',
      inner: 'none',
      xs: 'none',
      '2xs': 'none',
      card: 'none',
      'card-hover': 'none',
      subtle: 'none',
    },
    dropShadow: {
      none: 'none',
      DEFAULT: 'none',
      sm: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
    },
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'Roboto', 'Arial', ...defaultTheme.fontFamily.sans],
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
    },
  },
  plugins: [],
};
