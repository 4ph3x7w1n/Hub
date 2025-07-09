/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'gradient-start': '#FF00FF',
        'gradient-crimson': '#DC143C',
        'gradient-orange': '#FF4500',
        'gradient-gold': '#FFD700',
        'gradient-end': '#8A2BE2',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FF00FF 0%, #DC143C 25%, #FF4500 50%, #FFD700 75%, #8A2BE2 100%)',
        'card-gradient': 'linear-gradient(45deg, #FF00FF 0%, #DC143C 100%)',
        'feature-gradient': 'linear-gradient(90deg, #FF4500 0%, #FFD700 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

