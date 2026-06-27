import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        ink: "#111827",
        muted: "#64748B",
        line: "#E2E8F0",
        primary: "#465FF1",
        cyan: "#0E7490",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
