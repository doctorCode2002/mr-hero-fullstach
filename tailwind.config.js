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
          DEFAULT: "var(--primary)", // Orange (exact spec)
          hover: "var(--primary-hover)", // Darker orange for hover
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#fe6601',
          600: '#e55a00',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        "background-light": "#F9FAFB", // Gray-50
        "background-dark": "#111827", // Gray-900
        "surface-light": "#FFFFFF",
        "surface-dark": "#1F2937",
        "text-light": "#1F2937", // Gray-800
        "text-dark": "#F3F4F6", // Gray-100
        "border-light": "#E5E7EB", // Gray-200
        "border-dark": "#374151", // Gray-700
      },
      fontFamily: {
        display: ["Tajawal", "sans-serif"],
        body: ["Tajawal", "sans-serif"],
        sans: ["Tajawal", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'bounce': 'bounce 3s infinite',
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
  plugins: [],
}
