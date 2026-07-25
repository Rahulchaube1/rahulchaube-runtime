/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: "#071A16",
          subtle: "#0A1F1B",
          surface: "#0E2923",
          border: "#163830",
          text: "#F0F6FC",
          muted: "#8B949E",
          accent: "#2FA866",
          lime: "#A8F05B",
          success: "#6FCF63",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
        brand: {
          DEFAULT: "#2FA866",
          lime: "#A8F05B",
          mid: "#6FCF63",
          dark: "#071A16",
          surface: "#0E2923",
          border: "#163830",
        },
        ink: {
          900: "#071A16",
          800: "#0A1F1B",
          700: "#0E2923",
        },
      },
      fontFamily: {
        sans: ["Geist", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "spin-slow": "spin-slow 8s linear infinite",
      },
    },
  },
  plugins: [],
};
