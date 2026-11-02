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
        // Foldspace design tokens
        linen: {
          50: "#FAFAF7",
          100: "#F5F3EF",
          200: "#EDE9E1",
          300: "#E2DDD6",
          400: "#D4CEC4",
        },
        ink: {
          950: "#1C1814",
          900: "#2B2520",
          800: "#3D3830",
          700: "#524D45",
          600: "#6B6560",
          500: "#857F78",
          400: "#9E9690",
        },
        accent: {
          DEFAULT: "#2D6BE4",
          50: "#EBF0FC",
          100: "#D6E2FA",
          200: "#ADC5F5",
          300: "#85A8F0",
          400: "#5C8BEB",
          500: "#2D6BE4",
          600: "#1E50B5",
          700: "#163A86",
          800: "#0F2657",
          900: "#071228",
        },
        success: "#1A8F5C",
        warning: "#C47A1B",
        danger: "#C93530",
        // Tool category colors
        "pdf-red": "#DC2626",
        "image-purple": "#7C3AED",
        "archive-amber": "#D97706",
        "workflow-teal": "#0D9488",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(28,24,20,0.08), 0 1px 2px -1px rgba(28,24,20,0.04)",
        "card-hover":
          "0 4px 12px 0 rgba(28,24,20,0.12), 0 2px 4px -1px rgba(28,24,20,0.06)",
        tool: "0 0 0 1px rgba(28,24,20,0.08), 0 2px 8px rgba(28,24,20,0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
