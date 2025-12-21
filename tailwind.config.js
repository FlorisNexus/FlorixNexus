/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./404.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        nexusDark: "#050507",
        nexusPurple: "#a855f7",
        nexusBlue: "#3b82f6",
        nexusCyan: "#06b6d4",
        surface: "#0f172a",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
