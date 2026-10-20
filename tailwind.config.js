/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lunaria: {
          warm: "#FAFAF7",
          solar: "#749084",
          snow: "#FFFFFF",
          coal: "#2D2D2D",
          cream: "#FFE8B5",
          latte: "#F7CFC3",
          coffee: "#7A4A2E",
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
        mono: ["Source Code Pro", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        warm: "0 24px 80px rgba(122, 74, 46, 0.16)",
        solar: "0 20px 60px rgba(116, 144, 132, 0.24)",
        soft: "0 14px 44px rgba(45, 45, 45, 0.08)",
      },
      backgroundImage: {
        "solar-soft":
          "linear-gradient(135deg, #FAFAF7 0%, #FFE8B5 42%, #F7CFC3 73%, rgba(116, 144, 132, 0.22) 100%)",
      },
    },
  },
  plugins: [],
};
