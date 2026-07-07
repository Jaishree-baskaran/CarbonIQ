import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: "#C8E63C",
        black: "#111111",
        heavyblack: "#111111",
        white: "#FAFFF0",
        offwhite: "#FAFFF0",
        pink: "#FF5FA0",
        blue: "#4FC3F7",
        orange: "#FF7A2F",
        teal: "#26C6DA",
        green: "#2ECC71",
        red: "#FF4757",
        yellow: "#FFD32A"
      },
      fontFamily: {
        fredoka: ["var(--font-fredoka)", "cursive"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        neo: "4px 4px 0 #111",
        "neo-hover": "2px 2px 0 #111",
        "neo-lg": "6px 6px 0 #111",
      },
      animation: {
        bobb: "bobb 3s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
      },
      keyframes: {
        bobb: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        }
      },
    },
  },
  plugins: [],
};
export default config;
