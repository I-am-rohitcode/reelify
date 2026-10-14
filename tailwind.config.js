/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Bebas Neue", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#05060A",
          900: "#0A0B12",
          800: "#0F1224",
        },
        surface: {
          1: "rgba(255,255,255,0.03)",
          2: "rgba(255,255,255,0.06)",
          3: "rgba(255,255,255,0.09)",
        },
        neon: {
          cyan: "#22D3EE",
          lime: "#A3FF12",
          magenta: "#F472B6",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 10px 35px rgba(0,0,0,0.55)",
        neon: "0 0 0 1px rgba(34,211,238,0.18), 0 0 35px rgba(34,211,238,0.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
