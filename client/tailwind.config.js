/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      colors: {
        cloudGray: '#666666',
        stoneGay: '#898989', 
        lightGray: '#B0B0B0',
        steelGray: '#9F9F9F',
        orangeCustom: '#FB8526',
        snowWhite: '#FBFBFB',
        antiqueGold: '#B88E2F',
        ivoryCream: '#F9F1E7',
        bronzeGold: '#B88E2F',
        aquaBlue: '#1C89A1',
        crystalAqua: '#40B2BD',
        peach: '#E97171',
        leafGreen: '#11AC53',
        darkBlue: '#000080',
        royalBlue: '#305CDE',
        dimGray: '#3A3A3A',
        accent: "#00E676",
       amulet: {
        300: '#7dcd9a',
        
      },
        
       
     
      },

      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
         ember: ['"Amazon Ember"', 'sans-serif'],
        emberMono: ['"Amazon Ember Mono"', 'monospace'],
      },


      fontSize: {
        'custom-12': ['12px', '18px'],
        'custom-13': ['13px', '19px'],
        'custom-14' : ['14px', '21px'],
        'custom-16': ['16px', '24px'],  
        'custom-20': ['20px', '30px'],
        'custom-24': ['24px', '36px'],
        'custom-32': ['32px', '48px'],
        'custom-40': ['40px', '48px'],
        'custom-42': ['42px', '63px'],
        'custom-48': ['48px', '72px'],
        'custom-50': ['50px', '75px'],

      },


      fontWeight: {
        500: '500', 
        400: '400',
        300: '300'

      },


      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInText: {
          '0%': { transform: 'translateY(50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },


      boxShadow: {
        xl: "0 10px 20px rgba(0, 0, 0, 0.1)",
      },
      scale: {
        105: "1.05",
      },

      keyframes: {
        cartSlideIn: {
          "0%": { transform: "translateX(-200%)", opacity: 0 },
          "50%": { opacity: 1 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "cart-slide-in": "cartSlideIn 1.2s ease-out",
      },

      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      animation: {
        'slide-down': 'slide-down 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        'slide-down': {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    

    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}