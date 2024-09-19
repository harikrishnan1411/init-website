module.exports = {
  darkMode: 'class', // Enables dark mode via 'class' strategy
  content: [
    './views/**/*.hbs', // Include all Handlebars files in the views directory
    './public/**/*.html', // Include all HTML files in the public directory
  ],
  theme: {
    extend: {
      // You can add custom theme settings here if needed
    },
  },
  plugins: [
    // Add any Tailwind plugins you might need here
  ],
}
