/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#dbe7f3',
          200: '#b8d1e8',
          300: '#86b0d9',
          400: '#4d88c4',
          500: '#0B1E36', // Cohen Primary Midnight Navy
          600: '#0E223D', // Cohen Medium Deep Navy
          700: '#081729', // Dark Slate Navy
          800: '#05101f',
          900: '#030a14',
          950: '#01050a',
        },
        gold: {
          50: '#fdfbf5',
          100: '#faf3e1',
          200: '#f4e5c0',
          300: '#ebd093',
          400: '#dfb562',
          500: '#C5A059', // Cohen Official Gold Accent
          600: '#B8860B', // Cohen Rich Ochre / Dark Gold
          700: '#9A7007',
          800: '#7B5706',
          900: '#604307',
          950: '#382502',
        },
        cohenNavy: {
          DEFAULT: '#0B1E36',
          light: '#102A4A',
          dark: '#081729',
        },
        cohenGold: {
          DEFAULT: '#C5A059',
          bright: '#EAB308',
          light: '#EAD086',
          dark: '#B8860B',
          bg: '#FAF5E8',
        },
        cohenGreen: {
          DEFAULT: '#2B7A4B',
          hover: '#1E6538',
        },
        cohenPeriwinkle: {
          DEFAULT: '#93B4ED',
          light: '#B4CCF7',
        },
        slate: {
          50: 'rgb(var(--slate-50) / <alpha-value>)',
          100: 'rgb(var(--slate-100) / <alpha-value>)',
          200: 'rgb(var(--slate-200) / <alpha-value>)',
          300: 'rgb(var(--slate-300) / <alpha-value>)',
          400: 'rgb(var(--slate-400) / <alpha-value>)',
          450: 'rgb(var(--slate-450) / <alpha-value>)',
          500: 'rgb(var(--slate-500) / <alpha-value>)',
          550: 'rgb(var(--slate-550) / <alpha-value>)',
          600: 'rgb(var(--slate-600) / <alpha-value>)',
          650: 'rgb(var(--slate-650) / <alpha-value>)',
          700: 'rgb(var(--slate-700) / <alpha-value>)',
          800: 'rgb(var(--slate-800) / <alpha-value>)',
          900: 'rgb(var(--slate-900) / <alpha-value>)',
          950: 'rgb(var(--slate-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(11, 30, 54, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        gold: '0 4px 14px 0 rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
}

