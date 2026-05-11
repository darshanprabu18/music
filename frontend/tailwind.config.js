export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#080914",
        vapor: "#a855f7",
        lagoon: "#22d3ee",
        flare: "#fb7185",
        pulse: "#60a5fa"
      },
      boxShadow: {
        glow: "0 0 50px rgba(34, 211, 238, 0.18)",
        roseglow: "0 0 44px rgba(251, 113, 133, 0.18)"
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        bars: "bars 1s ease-in-out infinite"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" }
        },
        bars: {
          "0%, 100%": { transform: "scaleY(.35)" },
          "50%": { transform: "scaleY(1)" }
        }
      }
    }
  },
  plugins: []
};
