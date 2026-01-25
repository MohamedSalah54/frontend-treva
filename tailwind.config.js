/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
    },
    fontFamily: {
      sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
      mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular'],
    },
  },
},
  plugins: [],
};
