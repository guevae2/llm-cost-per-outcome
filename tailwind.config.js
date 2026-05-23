/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        panelBg: "#161C2C",
        accentTeal: "#10B981",
        frontierColor: "#8B5CF6",
        reasoningColor: "#F59E0B"
      }
    },
  },
  plugins: [],
}