module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF2FF",
          100: "#A5B4FC",
          500: "#6366F1",
          600: "#4338CA",
          700: "#312E81",
        },
      },
      boxShadow: { soft: "0 12px 36px rgba(49,46,129,.08)" },
    },
  },
  plugins: [],
};
