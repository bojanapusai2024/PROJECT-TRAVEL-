module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: '#0D0D0D',
          dark: '#1A1A2E',
        },
        accent: {
          green: '#90EE90',
          greenLight: '#98FB98',
          greenDark: '#7CCD7C',
        },
        secondary: {
          purple: '#DDA0DD',
          purpleLight: '#E6E6FA',
          purpleDark: '#BA55D3',
        },
        surface: {
          dark: '#16213E',
          card: '#1F1F3D',
        }
      }
    }
  },
  plugins: []
}
