/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import light from 'daisyui/src/theming/themes';
import dark from 'daisyui/src/theming/themes';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-white': '#ffffff3b',
        'dark-grey': '#202133',
        'light-grey': '#353750',
      },
    },
    default: 'daisy',
  },
  daisyui: {
    darkTheme: 'dark',
    themes: [
      'light',
      'dark',
      {
        light: {
          ...light['[data-theme=light]'],
          neutral: '#cbd5e1',
          'neutral-content': '#475549',
        },
        dark: {
          ...dark['[data-theme=dark]'],
          neutral: '#171c21',
          'neutral-content': '#94a2b8',
        },
      },
    ],
  },
  plugins: [daisyui],
};
