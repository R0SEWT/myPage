/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,md,mdx,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmos: '#2C3E50',  // Midnight Cosmos
        teal:   '#1ABC9C',  // Teal Luminescente
        dawn:   '#F1C40F',  // Amanecer Dorado
        lilac:  '#8E44AD',  // Lilac Etéreo
        cloud:  '#ECF0F1',  // Nube Serena
      }
    },
  },
  plugins: [],
}
