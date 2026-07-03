import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // dark warm body
        bg: "#17110C",
        ink: "#0F0A06",
        // brand accents (read on dark)
        primary: "#E0AE57",
        accent: "#C97C54",
        flax: "#B8791F",
        // light surfaces + on-light text
        cream: "#F8F1E4",
        parchment: "#F4EAD8",
        linen: "#EADDC6",
        stone: "#3B2E23",
        bark: "#241A11",
      },
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "serif"],
        serif: ["var(--font-display)", "Fraunces", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
