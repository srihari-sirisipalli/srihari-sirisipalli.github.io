import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#F5EFE4",
          elev: "#FBF6EB",
          sunk: "#EDE5D3",
        },
        ink: {
          DEFAULT: "#0B1930",
          soft: "#3A4560",
          faint: "#6A7590",
        },
        rule: {
          DEFAULT: "#E2D9C4",
          soft: "#EEE7D6",
        },
        accent: {
          DEFAULT: "#B04A2A",
          ink: "#8F3A20",
          soft: "#F0DACF",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.25rem, 7vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(1.875rem, 5vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.5rem, 3.5vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        "editorial": "-0.02em",
      },
      maxWidth: {
        "prose-editorial": "68ch",
      },
      transitionTimingFunction: {
        "out-editorial": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
