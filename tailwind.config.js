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
        charcoal: {
          950: '#07090E',
          900: '#0B0F19',
          850: '#101524',
          800: '#151C30',
          700: '#1F2A48',
          600: '#2E3D66',
        },
        neon: {
          blue: '#00E5FF',
          cyan: '#38BDF8',
          indigo: '#6366F1',
          purple: '#A855F7',
          pink: '#EC4899',
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 20px -5px rgba(0, 229, 255, 0.35)',
        'glow-purple': '0 0 20px -5px rgba(168, 85, 247, 0.35)',
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.35)',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Cascadia Code', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
