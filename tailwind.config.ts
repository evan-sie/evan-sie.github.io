import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-black": "#050505",
        "engineering-white": "#F2F2F2",
        "turbonite-base": "#4E4B48",
        "turbonite-highlight": "#8C8279",
        "bronze-accent": "#C49866",
      },
      fontFamily: {
        // PorscheNext as primary, with system fallbacks (no Arial)
        sans: ["PorscheNext", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        porsche: ["PorscheNext", "system-ui", "-apple-system", "sans-serif"],
      },
      fontWeight: {
        thin: "100",
        normal: "400",
        semibold: "600",
        bold: "700",
      },
      letterSpacing: {
        'porsche': '0.1em',
        'wider': '0.15em',
        'widest': '0.25em',
      },
      opacity: {
        'secondary': '1',
        'thin': '1',
        'muted': '1',
      },
    },
  },
  plugins: [],
};

export default config;
