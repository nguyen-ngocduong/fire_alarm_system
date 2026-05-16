/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A56DB',
          light: '#EBF5FF',
          dark: '#1E429F',
        },
        safe: {
          DEFAULT: '#057A55',
          bg: '#DEF7EC',
        },
        warning: {
          DEFAULT: '#C27803',
          bg: '#FDF6B2',
        },
        danger: {
          DEFAULT: '#C81E1E',
          bg: '#FDE8E8',
          pulse: 'rgba(200, 30, 30, 0.3)',
        },
        surface: '#FFFFFF',
        bg: '#F3F4F6',
        border: '#E5E7EB',
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        chart: {
          temperature: '#EF4444',
          humidity: '#3B82F6',
          lpg: '#F97316',
          smoke: '#6B7280',
          rawGas: '#8B5CF6',
          irFlame: '#FBBF24',
        }
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'danger-pulse': 'danger-pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        'danger-pulse': {
          '0%, 100%': { backgroundColor: '#C81E1E' },
          '50%': { backgroundColor: '#991B1B' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}
