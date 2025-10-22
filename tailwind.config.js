/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#0B6623",
        gold: "#FFD700",
        dark: "#0a0a0a",
        panel: "#111c12",
      },
    },
  },
  plugins: [],
};
