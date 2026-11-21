import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-ibm-plex-arabic)", "sans-serif"],
      },
      colors: {
        gold: {
          50: "#FDFBF4",
          100: "#FAF3E3",
          200: "#F4E3BA",
          300: "#EDCE8B",
          400: "#E4B85C",
          500: "#D4AF37", // Main Brand Gold
          600: "#B8860B",
          700: "#946B08",
          800: "#755307",
          900: "#523A05",
        },
        dark: {
          950: "#07090E", // Obsidian Base
          900: "#0B0F19", // Card Base
          850: "#0F1626",
          800: "#141D32",
          700: "#1E2B4A",
          600: "#2A3B66",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
