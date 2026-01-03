/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./store/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fe6601',
          50: '#fff0e0',  // Richer light orange (Material 50-ish)
          100: '#ffe0b2', // More visible peach
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#fe6601', // Our primary brand color (kept)
          600: '#f55a00',
          700: '#e64a19',
          800: '#d84315',
          900: '#bf360c',
          950: '#431202',
        },
        // Mapping emerald to primary/gray for backward compatibility if needed, 
        // or we just replace usage in code.
        // Let's replace usage in code, but keep this handy.
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class', // We will just not toggle this class on body
  plugins: [],
}
