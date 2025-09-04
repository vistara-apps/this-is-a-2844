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
          bg: 'hsl(250 30% 8%)',
          surface: 'hsl(250 25% 12%)',
          accent: 'hsl(260 100% 70%)',
          primary: 'hsl(210 40% 96%)',
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
        'dark-card': '0 4px 20px hsla(250, 30%, 5%, 0.4)',
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
        'heading': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1.125rem', { lineHeight: '1.8' }],
      },
      animation: {
        'gradient': 'gradient 6s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(-45deg, hsl(260 100% 70%), hsl(280 100% 60%), hsl(300 100% 65%), hsl(320 100% 70%))',
        'gradient-dark': 'linear-gradient(135deg, hsl(250 30% 8%) 0%, hsl(260 40% 12%) 50%, hsl(270 30% 8%) 100%)',
      }
    },
  },
  plugins: [],
}