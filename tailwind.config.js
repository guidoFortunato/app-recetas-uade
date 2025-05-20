/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.tsx", 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

      colors: {
        primary: "#49129c",
        secondary: {
          DEFAULT: "#B40086",
          100: "#c51297",
          200: "#831266",
        },
        tertiary: "#ef2967",
      },

      fontFamily: { 
        "work-light": ["work-light", "sans-serif"],
        "work-black": ["work-black", "sans-serif"],
        "work-medium": ["work-medium", "sans-serif"],
      },
    },
  },
  plugins: [],
}