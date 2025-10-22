/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#0B6623",
        gold: "#FFD700",
        dark: "#0a0a0a",
      },
    },
  },
  plugins: [],
}
