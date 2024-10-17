/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Poppins","sans-serif"],
    },
    extend: {
      //colors used in the project 
      color:{
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage : {
        'login-bg-image': "url('./src/assets/images/bg-image.jpg')",
        'signup-bg-image': "url('./src/assets/images/signup-bg-image.png')",
      }
    },
  },
  plugins: [],
}

