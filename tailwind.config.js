module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['Anonymous Pro', 'monospace']
    },
    extend: {
      backgroundImage: {
        "main-background": "url('/images/bgGrad.png')",
        "main-blues": "url('/images/bgBlues.jpg')",
      }
    },
  },
  plugins: [],
}
