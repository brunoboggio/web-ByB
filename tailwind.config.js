/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./components/**/*.js",
    "!./node_modules/**"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container": "#e8eeff",
        "tertiary-container": "#30363c",
        "on-surface-variant": "#43474e",
        "outline": "#74777f",
        "tertiary": "#1b2127",
        "outline-variant": "#c4c6cf",
        "tertiary-fixed-dim": "#c1c7cf",
        "surface-variant": "#dde2f3",
        "on-tertiary-container": "#989fa6",
        "error-container": "#ffdad6",
        "secondary-container": "#d5e0f7",
        "on-primary-fixed-variant": "#2d476f",
        "on-error-container": "#93000a",
        "secondary-fixed": "#d8e3fa",
        "secondary-fixed-dim": "#bcc7dd",
        "background": "#f9f9ff",
        "on-surface": "#161c27",
        "surface-container-lowest": "#ffffff",
        "inverse-primary": "#adc7f7",
        "surface-bright": "#f9f9ff",
        "surface-container-highest": "#dde2f3",
        "on-primary": "#ffffff",
        "on-secondary-fixed-variant": "#3c475a",
        "primary": "#002045",
        "on-primary-container": "#86a0cd",
        "error": "#ba1a1a",
        "on-tertiary": "#ffffff",
        "primary-fixed-dim": "#adc7f7",
        "surface-container-high": "#e3e8f9",
        "inverse-surface": "#2a303d",
        "on-secondary": "#ffffff",
        "inverse-on-surface": "#ecf0ff",
        "on-tertiary-fixed-variant": "#41474e",
        "surface": "#f9f9ff",
        "primary-container": "#1a365d",
        "primary-fixed": "#d6e3ff",
        "on-secondary-container": "#586377",
        "on-tertiary-fixed": "#161c22",
        "surface-dim": "#d4daea",
        "tertiary-fixed": "#dde3eb",
        "on-error": "#ffffff",
        "on-primary-fixed": "#001b3c",
        "surface-container-low": "#f1f3ff",
        "on-secondary-fixed": "#111c2c",
        "surface-tint": "#455f88",
        "secondary": "#545f72",
        "on-background": "#161c27"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "max-width": "1280px",
        "gutter": "24px",
        "base": "8px",
        "margin-mobile": "16px",
        "section-gap": "120px",
        "margin-desktop": "64px"
      },
      fontFamily: {
        "label-bold": ["Geist", "sans-serif"],
        "headline-lg-mobile": ["Metropolis", "sans-serif"],
        "headline-lg": ["Metropolis", "sans-serif"],
        "headline-xl": ["Metropolis", "sans-serif"],
        "body-md": ["Hanken Grotesk", "sans-serif"],
        "body-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-md": ["Metropolis", "sans-serif"]
      },
      fontSize: {
        "label-bold": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-lg": ["36px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "700" }]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ]
};
