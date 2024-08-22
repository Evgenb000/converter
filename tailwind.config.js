/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    colors: {
      cust__cyan: {
        dark: "#324B4B",
        DEFAULT: "#00DDDD",
      },
      cust__white: "#FFFFFF",
      cust__black: "#1D2020",
      cust__gray: "#3F4948",
    },
  },
  plugins: [],
};
