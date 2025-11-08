import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["vazir-matn", "ui-sans-serif", "system-ui"],
      },
      colors: {
        // Dark theme colors
        "dark-bg": "#000000",
        "darker-bg": "#0a0a0a",
        "dark-card": "#121212",
        "dark-surface": "#1e1e1e",
        "dark-border": "#333333",
        "dark-text": "#ffffff",
        "dark-text-secondary": "#e0e0e0",
        "dark-text-tertiary": "#a0a0a0",

        // Neon accent colors
        "neon-pink": "#FF007A",
        "neon-pink-light": "#ff339c",
        "neon-pink-dark": "#cc0061",
        "neon-green": "#00FF85",
        "neon-green-light": "#33ff9c",
        "neon-green-dark": "#00cc6a",
        "neon-purple": "#A020F0",
        "neon-purple-light": "#b34fff",
        "neon-purple-dark": "#801bc2",
        "neon-lime": "#BFFF00",
        "neon-lime-light": "#d5ff33",
        "neon-lime-dark": "#99cc00",
      },
      boxShadow: {
        "neon-pink": "0 0 10px rgba(255, 0, 122, 0.5)",
        "neon-pink-lg":
          "0 0 20px rgba(255, 0, 122, 0.7), 0 0 30px rgba(255, 0, 122, 0.4)",
        "neon-green": "0 0 10px rgba(0, 255, 133, 0.5)",
        "neon-green-lg":
          "0 0 20px rgba(0, 255, 133, 0.7), 0 0 30px rgba(0, 255, 133, 0.4)",
        "neon-purple": "0 0 10px rgba(160, 32, 240, 0.5)",
        "neon-purple-lg":
          "0 0 20px rgba(160, 32, 240, 0.7), 0 0 30px rgba(160, 32, 240, 0.4)",
        "neon-lime": "0 0 10px rgba(191, 255, 0, 0.5)",
        "neon-lime-lg":
          "0 0 20px rgba(191, 255, 0, 0.7), 0 0 30px rgba(191, 255, 0, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-delay": "fadeIn 0.8s ease-out 0.3s forwards",
        "fade-in-delay-2": "fadeIn 0.8s ease-out 0.6s forwards",
        "slide-down": "slideDown 0.8s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "slide-up-delay": "slideUp 0.8s ease-out 0.2s forwards",
        "slide-up-delay-2": "slideUp 0.8s ease-out 0.4s forwards",
        "slide-up-delay-3": "slideUp 0.8s ease-out 0.6s forwards",
        "slide-up-delay-4": "slideUp 0.8s ease-out 0.8s forwards",
        "slide-up-delay-5": "slideUp 0.8s ease-out 1s forwards",
        "slide-up-delay-6": "slideUp 0.8s ease-out 1.2s forwards",
        "slide-up-delay-7": "slideUp 0.8s ease-out 1.4s forwards",
        "slide-up-delay-8": "slideUp 0.8s ease-out 1.6s forwards",
        "pop-in": "popIn 0.5s cubic-bezier(0.26, 0.53, 0.74, 1.48) forwards",
        "bounce-in":
          "bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "glow-pulse": "glowPulse 2s infinite alternate",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "70%": { transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "0.9", transform: "scale(1.1)" },
          "80%": { opacity: "1", transform: "scale(0.89)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glowPulse: {
          "0%": {
            boxShadow: "0 0 5px rgba(255, 0, 122, 0.5)",
          },
          "100%": {
            boxShadow:
              "0 0 20px rgba(255, 0, 122, 0.8), 0 0 30px rgba(255, 0, 122, 0.4)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
