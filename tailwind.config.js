/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

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
                wenge: "#7a6563ff",
                gunmetal: "#202c39ff",
                sage: "#b4c292ff",
                periwinkle: "#d4dcffff",
                "atomic-tangerine": "#faaa8dff",
                laurelgreen: "#a9ba9d",
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("tailwind-scrollbar"),
        require("tailwind-scrollbar-hide"),
        require("@tailwindcss/line-clamp"),
    ],
};
