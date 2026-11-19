export const colors = {
  red: { accent: "#da2735", dark: "#7f1d1d" },
  orange: { accent: "#cc5400", dark: "#7c2d12" },
  yellow: { accent: "#ffae00", dark: "#78350f" },
  green: { accent: "#21c872", dark: "#14532d" },
  teal: { accent: "#2ee9d7", dark: "#134e4a" },
  blue: { accent: "#1e3a8a", dark: "#1e3a8a" },
  indigo: { accent: "#394bd5", dark: "#312e81" },
  purple: { accent: "#df24ff", dark: "#581c87" },
  pink: { accent: "#f33b73", dark: "#831843" },
  emerald: { accent: "#0c6e54", dark: "#064e3b" },
  rose: { accent: "#ed2377", dark: "#871b48" },
  gray: { accent: "#555555", dark: "#27272a" },
  brown: { accent: "#6f4f28", dark: "#3e2b1f" },
  olive: { accent: "#808000", dark: "#4b4f44" },
  cyan: { accent: "#00bcd4", dark: "#00695c" },
  magenta: { accent: "#d500f9", dark: "#8e24aa" },
  lime: { accent: "#c6ff00", dark: "#9e9d24" },
  lavender: { accent: "#e6e6fa", dark: "#6a5acd" },
  peach: { accent: "#ffcc99", dark: "#cc9966" },
  violet: { accent: "#8a2be2", dark: "#5d3f6b" },
  mint: { accent: "#98ff98", dark: "#48c9b0" },
  ocean: { accent: "#0077be", dark: "#005f73" },
  coral: { accent: "#ff7f50", dark: "#cc503e" },
  gold: { accent: "#ffd700", dark: "#b8860b" },
  azure: { accent: "#007fff", dark: "#003f7f" },
  cherry: { accent: "#cf1020", dark: "#7f0808" },
};

export function getRandomAccentColor(): string {
  const colorKeys = Object.keys(colors);
  const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  return colors[randomColorKey].accent;
}