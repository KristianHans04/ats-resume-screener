/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#06B6D4', // Cyan
          alt: '#F97316',     // Orange
        },
        neutral: {
          dark: '#111827',    // Rich Black
          light: '#F3F4F6',   // Cool Gray
        },
        border: {
          DEFAULT: '#E5E7EB', // Light Gray
        }
      },
      // Preserving your custom layout measurements
      spacing: {
        'sidebar': '260px',
        'topnav': '64px',
      },
      // Preserving your z-index scale
      zIndex: {
        'raised': '10',
        'sticky': '40',
      },
      // Porting your custom animation
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'logo-spin': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}