module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      screens: {
        xs: "420px",
        s550: "550px",
      },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "15%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(20deg)" },
        },
      },
      animation: {
        marquee: "marquee 5s linear infinite",
        wiggle: "wiggle 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
