import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#F7F3EC",
          elev: "#FFFFFF",
          sunk: "#EFE9DE",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#4A4A4A",
          faint: "#8B8B8B",
        },
        rule: {
          DEFAULT: "#DDD5C6",
          soft: "#E8E1D3",
        },
        accent: {
          DEFAULT: "#E4572E",
          ink: "#B4421F",
          soft: "#FCE7DF",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
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
