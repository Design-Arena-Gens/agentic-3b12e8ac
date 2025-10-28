import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        canvas: "#f0f0f0"
      },
      boxShadow: {
        floating: "0 20px 45px -20px rgba(37, 99, 235, 0.3)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.4s ease forwards",
        pulse: "pulse 1.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
