// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".my-abs-center": {
          "@apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2":
            {},
        },
      });
    }),
  ],
};

module.exports = config;
