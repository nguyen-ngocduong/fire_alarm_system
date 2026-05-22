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
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        safe: {
          DEFAULT: 'var(--color-safe)',
          bg: 'var(--color-safe-bg)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          bg: 'var(--color-danger-bg)',
          pulse: 'var(--color-danger-pulse)',
        },
        surface: 'var(--color-surface)',
        bg: 'var(--color-bg)',
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        chart: {
          temperature: 'var(--chart-temperature)',
          humidity: 'var(--chart-humidity)',
          lpg: 'var(--chart-lpg)',
          smoke: 'var(--chart-smoke)',
          rawGas: 'var(--chart-raw-gas)',
          irFlame: 'var(--chart-ir-flame)',
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
