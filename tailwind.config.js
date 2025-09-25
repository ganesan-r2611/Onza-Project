/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}",
    "./libs/**/*.{js,ts,jsx,tsx}",      
    "./json/**/*.{js,ts,jsx,tsx,json}"
  ],
  theme: {
    extend: {
      colors: {
        onzaTeal: '#0f6b6b',
      },
    },
  },
  plugins: [],
};
