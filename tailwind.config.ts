import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand-accurate palette extracted from SLPZY Catalogue Book
        ink: "#3F3F3F",          // primary text & wordmark (warm dark grey)
        ink2: "#5C5C5C",         // secondary text & dark backgrounds
        soft: "#8A8A8A",         // tertiary / captions
        paper: "#FFFFFF",        // primary surface
        cream: "#F8F5F0",        // warm off-white surfaces
        bone: "#EEE9DF",         // hero card backgrounds
        sage: "#9DAD8E",         // signature accent — sage green
        "sage-deep": "#7C8E6C",  // darker sage for hover/active
        khaki: "#C9A876",        // beige / khaki fabric tone
        mauve: "#C8A6AE",        // dusty pink variant
        slate: "#90A3AC",        // dusty blue grey
        olive: "#A89679",        // muted olive
        line: "#E3DED4",         // hairline dividers on warm bg
        line2: "#EFEAE0",        // softer dividers
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tight: "-0.015em",
        tighter: "-0.025em",
        wide: "0.06em",
        wider: "0.12em",
        widest: "0.22em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        soft: "cubic-bezier(0.65, 0.05, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.015)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 1s cubic-bezier(0.22, 1, 0.36, 1) both",
        breathe: "breathe 9s ease-in-out infinite",
      },
      boxShadow: {
        soft: "0 30px 60px -30px rgba(63,63,63,0.25)",
        card: "0 20px 40px -25px rgba(63,63,63,0.18)",
      },
    },
  },
  plugins: [
    // scrollbar-hide utility for horizontal scroll product row
    plugin(({ addUtilities }) => {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    }),
  ],
};

export default config;
