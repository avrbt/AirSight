/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: '#0B0F19',
          surface: '#121824',
          card: '#1A2333',
          elevated: '#232F45',
        },
        border: {
          subtle: '#2E3D56',
        },
        brand: {
          primary: '#0070F3',
          glow: 'rgba(0,112,243,0.15)',
        },
        aqi: {
          good: '#00D97E',
          satisfactory: '#B8E045',
          moderate: '#FFB020',
          poor: '#FF6B35',
          verypoor: '#E63946',
          severe: '#9B1FCA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
