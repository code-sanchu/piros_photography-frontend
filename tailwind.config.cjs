// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ["my-success"]: "hsl(154 61% 92%)",
        ["my-success-content"]: "hsl(160 83.8% 33.9%)",
        ["my-alert"]: "hsl(0 84% 91.1%)",
        ["my-alert-content"]: "hsl(0 84% 63.1%)",
        ["my-error"]: "hsl(28 94.4% 92.9%)",
        ["my-error-content"]: "hsl(16 100% 56.1%)",
        ["overlay-light"]: "rgba(237, 242, 247, 0.2)",
        ["main-green"]: "rgb(27, 129, 44)",
      },
      fontFamily: {
        sans: ["var(--font-my-sans)", ...fontFamily.sans],
        serif: ["var(--font-my-serif)", ...fontFamily.serif],
        ["serif-secondary"]: ["var(--font-my-serif2)", ...fontFamily.serif],
      },
      screens: {
        xs: "510px",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".my-abs-center": {
          "@apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2":
            {},
        },
        ".my-btn": {
          "@apply rounded-md border py-1 px-[0.75rem] text-sm capitalize transition-colors duration-75 ease-in-out":
            {},
        },
        ".my-btn-neutral": {
          "@apply border border-gray-200 text-gray-500 hover:bg-gray-100": {},
        },
        ".my-btn-action": {
          "@apply bg-blue-400 text-white hover:bg-blue-600": {},
        },
      });
    }),
  ],
};

module.exports = config;
