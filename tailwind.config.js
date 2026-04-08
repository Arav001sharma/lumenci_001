export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        sidebar: {
          bg: '#252631',
          hover: '#333446',
          active: '#1e3a8a',
        },
        primary: {
          DEFAULT: '#005ed3',
          hover: '#004ebd',
        },
        panel: '#ffffff',
        assistant: {
          bg: '#171a2b',
          border: '#2a2d3d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
