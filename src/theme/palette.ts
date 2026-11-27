/**
 * Atlas's colours, the one source for both `tailwind.config.ts` and the props that cannot read a
 * class (tab bar tints, SVG). Midnight blue surfaces, warm ivory ink and a single gold accent;
 * the radii follow Stride. Change a colour here, never as a hex literal elsewhere.
 */
export const palette = {
  // Gold: the one accent. `fg` is the ink on a gold fill, `soft*` a dark gold tint for chips.
  accent: {
    DEFAULT: '#D4AF37',
    fg: '#0B1226',
    soft: '#2A2514',
    softLine: '#5C4E1C',
    softFg: '#E8CB6A',
    light: '#E6C65C',
    strong: '#B8921F',
  },
  // Midnight: `DEFAULT` is the page, `raised` the surface closest to the viewer.
  surface: {
    DEFAULT: '#0B1226',
    muted: '#111A33',
    sunken: '#070C1B',
    raised: '#17213F',
  },
  line: {
    DEFAULT: '#26335A',
    strong: '#36467A',
  },
  ink: {
    DEFAULT: '#F3EFE3',
    muted: '#A9B0C6',
    subtle: '#8C94AE',
    faint: '#4A5578',
  },
  success: {
    DEFAULT: '#6FBF73',
    soft: '#14301F',
    softFg: '#A8E0AB',
    line: '#25573A',
  },
  warning: {
    DEFAULT: '#E0A030',
    soft: '#33260F',
    softFg: '#F2C46B',
  },
  danger: {
    DEFAULT: '#F0647A',
    soft: '#3A1621',
    softFg: '#FF9AAB',
    line: '#7A2A3C',
  },
  // Garmin Connect's blue, for what comes from Garmin.
  garmin: '#11BFED',
} as const;
