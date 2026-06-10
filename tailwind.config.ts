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
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slow-pan": {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.08) translate(-2%,-1%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
        "slow-pan": "slow-pan 20s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
