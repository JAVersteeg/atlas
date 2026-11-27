import type { Config } from 'tailwindcss';

import { palette } from './src/theme/palette';

const config: Config = {
  content: ['./App.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Inter is the reading voice; Bitter (tabular figures) is for headings and every number
      // that has to line up. Bitter registers per weight through the expo-font plugin in app.json.
      fontFamily: {
        sans: ['Inter'],
        display: ['Bitter'],
        metric: ['Bitter'],
      },
      colors: palette,
      // Corners, not pills: a small radius for anything with an edge, `full` for real circles.
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '3px',
        md: '3px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        '3xl': '6px',
        '4xl': '6px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
