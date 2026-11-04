/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080909',
        ink2: '#111311',
        surface: '#181A18',
        bone: '#F3F1E9',
        mist: '#A6A79F',
        mute: '#6E716B',
        lime: '#D6F36A',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
