/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210 40% 96%)',
        accent: 'hsl(208 92% 52%)',
        primary: 'hsl(220 8% 22%)',
        surface: 'hsl(210 40% 98%)',
        dark: {
          bg: 'hsl(240 20% 8%)',
          surface: 'hsl(240 15% 12%)',
          card: 'hsl(240 12% 16%)',
          border: 'hsl(240 8% 24%)',
          text: 'hsl(240 5% 92%)',
          muted: 'hsl(240 5% 64%)',
        },
        purple: {
          500: 'hsl(260 100% 70%)',
          600: 'hsl(260 100% 65%)',
          700: 'hsl(260 100% 60%)',
        },
        blue: {
          500: 'hsl(220 100% 70%)',
          600: 'hsl(220 100% 65%)',
          700: 'hsl(220 100% 60%)',
        }
      },
      borderRadius: {
        'lg': '16px',
        'md': '12px',
        'sm': '8px',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '12px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 10%, 70%, 0.2)',
        'dark-card': '0 4px 12px hsla(240, 80%, 10%, 0.6)',
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', fontWeight: '800' }],
        'heading': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1.125rem', { lineHeight: '1.8' }],
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}