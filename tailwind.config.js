/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    colors: {
      cust__slate: {
        dark: "#708090",
        DEFAULT: "#778899",
        light: "#B0C4DE",
      },
      cust__gray: {
        dark: "#696969",
        DEFAULT: "#808080",
        light: "#F5F5F5",
      },
      cust__blue: {
        light: "#85d7ff",
        DEFAULT: "#1fb6ff",
        dark: "#009eeb",
      },
      cust__red: {
        dark: "#DC143C",
        DEFAULT: "#FF0000",
      },
      cust__white: "#FFFFFF",
      cust__black: "#000000",
    },
  },
  plugins: [],
};
