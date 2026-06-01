// apps/mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        "primary-dark": "#4f46e5",
        secondary: "#f59e0b",
        background: "#0f172a",
        surface: "#1e293b",
        "surface-light": "#334155",
        text: "#f1f5f9",
        "text-muted": "#94a3b8",
        success: "#22c55e",
        error: "#ef4444",
      },
    },
  },
  plugins: [],
};
