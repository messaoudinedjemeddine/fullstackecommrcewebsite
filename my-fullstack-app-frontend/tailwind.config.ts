// tailwind.config.ts
import type { Config } from 'tailwindcss';


const config: Config = {
  // Specify files where Tailwind should scan for utility classes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Ensure all files in the app directory are scanned
  ],
  theme: {
    extend: {
      // Define custom font families for easy use with font-sans, font-serif, etc.
      fontFamily: {
        // 'Inter' is now the default for font-sans
        sans: ['Inter', 'sans-serif'],
      },
      // Define your custom color palette
      colors: {
        // Primary: Deep, sophisticated blue/teal, inspired by the dark dresses
        'primary': {
          DEFAULT: '#1A344A', // Main deep blue/teal
          '50': '#E8F1F6',
          '100': '#D1E1EC',
          '200': '#A6C5D9',
          '300': '#7BA8C7',
          '400': '#508CA4',
          '500': '#2A6E8C', // A slightly less dark shade for general use
          '600': '#1A344A', // Your core deep blue/teal
          '700': '#112330', // Darker shade for accents/hover
          '800': '#081620',
          '900': '#000000', // Close to black for text or deep shadows
        },
        // Secondary: Warm, inviting beige/cream, inspired by backgrounds and lighter dresses
        'secondary': {
          DEFAULT: '#D8D1C7', // Main warm beige
          '50': '#F9F8F6',
          '100': '#F3F0EC',
          '200': '#EDEAE4', // Lighter background
          '300': '#E2DDD5',
          '400': '#D8D1C7', // Your core warm beige
          '500': '#C6BEB3',
          '600': '#B3A99F',
          '700': '#A1958B',
          '800': '#8E8277',
          '900': '#7A6E64',
        },
        // Accent: Subtle, elegant gold/champagne for highlights and key elements
        'accent': {
          DEFAULT: '#E0C79A', // Main gold accent
          'light': '#F0E6D2',
          'dark': '#C7AB81', // Darker gold for depth/hover
        },
        // Neutrals: Refined grays for text, borders, shadows, and subtle backgrounds
        'gray': {
          'dark': '#333333',   // Dark text, strong shadows
          'medium': '#666666', // Body text
          'light': '#AAAAAA',  // Subtle text, borders
          'extra-light': '#F8F8F8', // Very light backgrounds, similar to cream
        },
        // Re-adding standard Tailwind colors so they are also available and can be overridden
        'red': {
          '50': '#FEF2F2', '100': '#FEE2E2', '200': '#FECACA', '300': '#FCA5A5', '400': '#F87171',
          '500': '#EF4444', '600': '#DC2626', '700': '#B91C1C', '800': '#991B1B', '900': '#7F1D1D'
        },
        'green': {
          '50': '#F0FDF4', '100': '#DCFCE7', '200': '#BBF7D0', '300': '#86EFAC', '400': '#4ADE80',
          '500': '#22C55E', '600': '#16A34A', '700': '#15803D', '800': '#166534', '900': '#14532D'
        },
        'yellow': {
          '50': '#FEFCE8', '100': '#FEF9C3', '200': '#FEF08A', '300': '#FDE047', '400': '#FACC15',
          '500': '#EAB308', '600': '#CA8A04', '700': '#A16207', '800': '#854D09', '900': '#713F12'
        },
        'purple': {
          '50': '#FAF5FF', '100': '#F3E8FF', '200': '#E9D5FF', '300': '#D8B4FE', '400': '#C084FC',
          '500': '#A855F7', '600': '#9333EA', '700': '#7E22CE', '800': '#6B21A8', '900': '#581C87'
        },
        'indigo': {
          '50': '#EEF2FF', '100': '#E0E7FF', '200': '#C7D2FE', '300': '#A5B4FC', '400': '#818CF8',
          '500': '#6366F1', '600': '#4F46E5', '700': '#4338CA', '800': '#3730A3', '900': '#312E81'
        },
      },
    },
  },
  plugins: [],
};

export default config;