/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bgmi: {
          gold: "#FFD700",
          orange: "#FF6B00",
          dark: "#0A0A0F",
          card: "#12121A",
          border: "#2A2A3A",
        },
      },
      fontFamily: {
        gaming: ["'Rajdhani'", "sans-serif"],
        display: ["'Orbitron'", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px #FFD700, 0 0 20px #FF6B00" },
          "50%": { boxShadow: "0 0 25px #FFD700, 0 0 50px #FF6B00" },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(30px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}

