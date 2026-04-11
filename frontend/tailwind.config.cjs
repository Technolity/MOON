module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#131313',
        surface: '#131313',
        'surface-container-low': '#1c1b1b',
        'surface-container-high': '#2a2a2a',
        'surface-container-lowest': '#0e0e0e',
        'surface-variant': '#353534',
        secondary: '#ffb68b',
        'secondary-container': '#994702',
        primary: '#bcc2ff',
        'primary-container': '#5e67aa',
        'on-background': '#e5e2e1',
        'on-surface-variant': '#c6c5d2',
        'on-primary-container': '#eeedff',
        'on-secondary-fixed': '#321300',
        'outline-variant': '#464650'
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
        display: ['Syncopate', 'sans-serif']
      }
    }
  },
  plugins: []
};
