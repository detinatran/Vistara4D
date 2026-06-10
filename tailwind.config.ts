import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tông màu lấy từ logo Vistara4D — đỏ son truyền thống + giấy ngà
        son: {
          DEFAULT: "#B0301E",
          light: "#C9402C",
          dark: "#8A2417",
        },
        muc: "#2A2018",      // mực nho
        giay: "#F4ECDD",     // giấy dó
        giayDark: "#E8DCC4",
        vang: "#D4A24E",     // vàng đồng
        reu: "#5A6B4D",      // rêu cổ kính
      },
      fontFamily: {
        serif: ["var(--font-serif)", '"Times New Roman"', "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      // fade-in / fade-in-scale / float-up định nghĩa trong globals.css.
      // Giữ slow-pan ở đây cho nền hero.
      keyframes: {
        "slow-pan": {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.08) translate(-2%,-1%)" },
        },
      },
      animation: {
        "slow-pan": "slow-pan 20s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
