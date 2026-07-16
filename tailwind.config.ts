import type { Config } from "tailwindcss";

// Optical Bench design tokens, ported from effulgentpoint.com (effpoint_main/index.html :root).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F7F6",
        card: "#FFFFFF",
        ink: "#191D1B",
        mut: "#5E6A66",
        line: "#DDE3E0",
        hair: "#C8D0CC",
        // viridis dispersion
        sp1: "#440154",
        sp2: "#3B528B",
        sp3: "#21908C",
        sp4: "#5DC863",
        sp5: "#FDE725",
      },
      fontFamily: {
        display: ["var(--fd)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--fb)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--fm)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      maxWidth: {
        wrap: "1040px",
      },
    },
  },
  plugins: [],
};

export default config;
