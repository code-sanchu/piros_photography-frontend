/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        xxxs: ".1rem",
        xxs: ".25rem",
        xs: ".5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "6rem",
        "2.5xl": "7.5rem",
        "3xl": "9rem",
      },
    },
  },
  plugins: [],
};

module.exports = config;
