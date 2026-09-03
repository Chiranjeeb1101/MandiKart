/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // MandiKart Design System mapped to Tailwind
        primaryGreen: '#2E7D32',
        primaryGreenLight: '#4CAF50',
        primaryGreenDark: '#1B5E20',
        primaryGreenSurface: '#E8F5E9',
        primaryGreenMuted: '#A5D6A7',

        accentOrange: '#F57C00',
        accentOrangeLight: '#FFB74D',
        accentOrangeDark: '#E65100',
        accentOrangeSurface: '#FFF3E0',
        accentOrangeMuted: '#FFCC80',

        backgroundPrimary: '#FAFAF7',
        backgroundSecondary: '#F5F5F0',
        backgroundCard: '#FFFFFF',

        textPrimary: '#1A1C1E',
        textSecondary: '#5F6368',
        textMuted: '#9AA0A6',
        textPrice: '#1B5E20',
        textDemand: '#E65100',

        surface: '#FFFFFF',
        border: '#E8E8E8',
        
        success: '#2E7D32',
        warning: '#F57C00',
        error: '#D32F2F',
        info: '#1976D2',
      },
    },
  },
  plugins: [],
}
