import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        bg: '#edf2f4',
        primary: '#111',
        focus: '#0582ca',
        third: '#D9D9D9',  

        // bg: '#222',
        // primary: '#edf2f4',
        // focus: '#00b4d8',
        // third: '#D9D9D9',  

        
        // bg: '#3d3d3d',
        // primary: '#cacaca',
        // focus: '#2A9D8F',
        // focus: '#0d00a4',
        // primary: '#30343f',
      },
    },
  },
  plugins: [],
};
export default config;
