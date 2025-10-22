/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#0B6623",
        gold: "#FFD700",
        darkBg: "#0d1117",
        darkCard: "#161b22",
        lightBg: "#f9fafb",
        lightCard: "#ffffff",
      },
    },
  },
  plugins: [],
};
