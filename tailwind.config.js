/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'primary-black': { DEFAULT: "#2B2C35", 100: "#404149" },
        'primary-red': { DEFAULT: "#bf0101", 100: "#f9d6d6", 200: "#ff4040" },
        'primary-blue': { DEFAULT: "#2B59FF", 100: "#F5F8FF" },
        'primary-green': { DEFAULT: "#A7F3D0", 100: "#F0F9F0", 200: "#1ea94b" },
        'primary-light': { DEFAULT: "rgb(226 232 240)" },
        'primary-lighter': { DEFAULT: "rgb(241 245 249)" },
        'primary-dark': "#0b0704",
        'admin-outer': "#151c2c",
        'admin-inner': "#182236",
        'admin-third': "#2e374a",
        'admin-btn': "#5d57c9",
        'white-main': "#fdfafa",
        'chart-title': "#b7bac1",
        'brown-dots': { DEFAULT: "#7e7676", 100: "#FF5733" },
        'tooltip-container': { DEFAULT: "rgba(0, 0, 11, 0.5)", 100: "rgba(151, 146, 146, 0.101)", 200: "rgba(157, 163, 163, 0.16)" },

        'tooltip-text': "#808080",
        'pages-container': { DEFAULT: "#1c1c36", 100: "#ccc", 200: "#888", 300: "#212140" },
        'comm-prompt': { DEFAULT: "#ccccccef" },
        'btn-comment': { DEFAULT: "#525257", 100: "#16a34a", 200: "#eab308", 300: "#ff4040" },
         grey: "#747A88",
      },
      fontFamily: {
        'unbounded': ['Unbounded', 'sans-serif'],
        'shoulders': ['Big Shoulders Text', 'sans-serif'],
        'bungee': ['Bungee Spice', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
