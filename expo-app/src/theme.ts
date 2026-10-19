/**
 * Design tokens LinkUp Gabon.
 * Reprend la palette du web (gabon-green / yellow / blue) adaptée au mobile.
 */
export const colors = {
  green: '#009E60',
  greenDeep: '#0F7A45',
  greenDark: '#03392A',
  yellow: '#FCD116',
  yellowSoft: '#FFEF8A',
  blue: '#3A75C4',

  ink: '#101827',
  muted: '#586575',
  line: '#E5E7EB',

  white: '#FFFFFF',
  surface: 'rgba(255,255,255,0.96)',
  surfaceMuted: 'rgba(255,255,255,0.14)',
  border: 'rgba(255,255,255,0.22)',

  bgTop: '#06160F',
  bgMid: '#072A35',
  bgBottom: '#0A3050',

  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  warning: '#B45309',
  warningBg: '#FFFBEB',
  success: '#15803D',
  successBg: '#ECFDF5',
} as const;

export const radius = { sm: 10, md: 14, lg: 20, xl: 26, pill: 999 } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
} as const;

export const heroGradient = [colors.greenDark, colors.bgMid, colors.bgBottom] as const;
export const gabonGradient = [colors.green, colors.yellow, colors.blue] as const;
export const ctaGradient = [colors.green, colors.blue] as const;
