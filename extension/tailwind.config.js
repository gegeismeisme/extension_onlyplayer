/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070d',
        plasma: '#7ddcff',
        amber: '#f5b657',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 35px rgba(125, 220, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
