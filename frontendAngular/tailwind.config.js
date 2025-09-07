/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily:{
        display:'Poppins, sans-serif',
        sans: 'Poppins, sans-serif',
        heading: 'Merriweather, serif',
      },
       animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors:{
        'dark':"#212529",
        'light':"#f0f3fb",
        primary: { 

        '50': '#f1fcfa', 

        '100': '#cff8ef', 

        '200': '#9ff0e1', 

        '300': '#67e1cf', 

        '400': '#32b9a9', 

        '500': '#1fad9f', 

        '600': '#168b82', 

        '700': '#166f69', 

        '800': '#165955', 

        '900': '#174a47', 

        '950': '#072c2b', 

    }, 

       'neutral': { 

         '50': '#f6f6f6', 

        '100': '#e7e7e7', 

        '200': '#d1d1d1', 

        '300': '#b0b0b0', 

        '400': '#888888', 

        '500': '#6d6d6d', 

        '600': '#5d5d5d', 

        '700': '#4f4f4f', 

        '800': '#454545', 

        '900': '#3d3d3d', 

        '950': '#000000', 

        }, 

      },
    },
  },
  plugins: [],
}

