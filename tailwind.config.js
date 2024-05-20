/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "vitrine-background": "#FAF3DD",
        "vitrine-text": "#40434E",
        "vitrine-primary": "#7FD8BE",
        "vitrine-secondary-1": "#FF9F1C",
        "vitrine-secondary-2": "#CAB8FF",
        "vitrine-hover": "#005377",
        "vitrine-error": "#E56155",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
  ],
};
