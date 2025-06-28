const palette = {
  blue: '#0052FF',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#888888',
  lightGrey: '#CCCCCC',
  green: '#00CC66',
  red: '#FF3333',
  darkBlue: '#1A1A1A', // Dark background inspired by Coinbase Pro
  lightBlue: '#2A2A2A', // Slightly lighter for foreground elements
};

export const theme = {
  colors: {
    background: palette.darkBlue,
    foreground: palette.lightBlue,
    primary: palette.blue,
    text: palette.white,
    subtext: palette.grey,
    success: palette.green,
    error: palette.red,
    tabBarBg: palette.black,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontSize: 34,
      fontFamily: 'System', // Use a system font as a default
      fontWeight: 'bold',
      color: 'text',
    },
    body: {
      fontSize: 16,
      fontFamily: 'System',
      color: 'text',
    },
  },
};