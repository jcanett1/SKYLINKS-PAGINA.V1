/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        surface: '#0A0A0C',
        cyan: { DEFAULT: '#06B6D4' },
        lime: { DEFAULT: '#D9F854' },
        amber: { DEFAULT: '#FFB800' },
        paper: '#F4F4F5',
        muted: '#A1A1AA',
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
      },
    },
  },
  plugins: [],
};
