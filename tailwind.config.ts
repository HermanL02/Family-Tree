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
        vintage: {
          paper: "#f4e8d0",
          dark: "#3d2817",
          sepia: "#704214",
          light: "#f5deb3",
          border: "#8b7355",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        vintage: ["Palatino", "Georgia", "serif"],
      },
      backgroundImage: {
        "vintage-texture": "url('/textures/paper.jpg')",
      },
    },
  },
  plugins: [],
};

export default config;
