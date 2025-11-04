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
      screens: {
        // Tailwind default breakpoints
        // 'sm': '640px',
        // 'md': '768px',
        // 'lg': '1024px',
        // 'xl': '1280px',
        
        // Custom 2xl breakpoint at 1440px for vw scaling
        '2xl': '1440px',
        
        // Optional: Add 3xl for ultra-wide monitors
        '3xl': '1920px',
        
        // Optional: Add 4xl for 4K displays
        '4xl': '2560px',
      },
      colors: {
        onzaTeal: '#0f6b6b',
      },
      // Optional: Add max-width constraints if needed
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
};