/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        onedark: {
          white: "#ABB2BF",
          lightgray: "#7D828D",
          red: "#E06C75",
          green: "#98C379",
          yellow: "#E5C07B",
          blue: "#61AFEF",
          darkblue: "#21252B",
          purple: "#C678DD",
          cyan: "#56B6C2",
          gray: "#282C34",
        }
      }
    },
  },
  plugins: [],
}
