/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bahiteal: {
          50: '#edf9f7',
          100: '#d3f1eb',
          200: '#aae2d8',
          500: '#148076',
          700: '#0b4f4a',
          800: '#083c38',
          900: '#052926',
        },
        bahigold: {
          50: '#fdfaf3',
          100: '#faeed3',
          200: '#f5dc9e',
          300: '#efc865',
          400: '#eeb837',
          500: '#ebaa20', // Exact logo gold/yellow
          600: '#d49413',
          700: '#b0750c',
          800: '#8f5d0f',
          900: '#754c10',
        },
        bahired: {
          500: '#d62828',
          600: '#b71c1c',
        },
        bahigreen: {
          500: '#1f9d55',
          600: '#15803d',
        },
        bahipaper: {
          light: '#fdfbf7',
          ledger: '#f7fbff',
          line: '#cfe0f3',
          margin: 'rgba(214, 40, 40, 0.45)',
        }
      },
      fontFamily: {
        baloo: ['"Baloo 2"', '"Baloo Paaji 2"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'bahi': '0 4px 20px -2px rgba(11, 79, 74, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)',
        'stamp': '0 0 0 3px currentColor',
      }
    },
  },
  plugins: [],
}
