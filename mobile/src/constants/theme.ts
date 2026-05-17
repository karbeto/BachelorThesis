const base = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700' as const },
    h2: { fontSize: 24, fontWeight: '600' as const },
    h3: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
    small: { fontSize: 12, fontWeight: '400' as const },
  },
  borderRadius: {
    small: 6,
    medium: 12,
    large: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
  },
}

export const lightTheme = {
  ...base,
  colors: {
    primary: '#0F172A',
    accent: '#38BDF8',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#6366F1',
    tabBar: '#FFFFFF',
    tabBarBorder: '#F1F5F9',
    tabActive: '#0F172A',
    tabInactive: '#94A3B8',
  },
}

export const darkTheme: typeof lightTheme = {
  ...base,
  colors: {
    primary: '#38BDF8',
    accent: '#7DD3FC',
    background: '#0A0F1E',
    surface: '#0F172A',
    surfaceVariant: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#1E293B',
    success: '#4ADE80',
    error: '#F87171',
    warning: '#FCD34D',
    info: '#818CF8',
    tabBar: '#0F172A',
    tabBarBorder: '#1E293B',
    tabActive: '#38BDF8',
    tabInactive: '#475569',
  },
}

export type Theme = typeof lightTheme
