// Süzgeç Design System — web tasarımından birebir aktarılmış renkler
export const Colors = {
  light: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    foreground: '#1A1B2E',
    cardForeground: '#1A1B2E',
    mutedForeground: '#6B7280',
    muted: '#F3F4F6',
    border: '#E5E7EB',
    input: '#E5E7EB',
    primary: '#3478F6',
    primaryForeground: '#FFFFFF',
    secondary: '#F3F4F6',
    secondaryForeground: '#374151',
    accent: '#F0F1F5',
    destructive: '#EF4444',
    // Süzgeç brand
    suzgecPrimary: '#3478F6',
    suzgecPrimaryLight: '#5B93F8',
    suzgecSecondary: '#2E6BE6',
    suzgecAccent: '#00B4D8',
    suzgecSuccess: '#34C759',
    suzgecWarning: '#FF9F0A',
    suzgecDanger: '#FF3B30',
    // Gradient
    gradientStart: '#6b21a8',
    gradientMid: '#4f46e5',
    gradientEnd: '#3b82f6',
    // Tab bar
    tabBar: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#4f46e5',
  },
  dark: {
    background: '#1C1F26',
    card: '#252A33',
    foreground: '#F0F1F3',
    cardForeground: '#F0F1F3',
    mutedForeground: '#8B95A5',
    muted: '#2D323D',
    border: '#3A3F4B',
    input: '#3A3F4B',
    primary: '#4A8DF8',
    primaryForeground: '#0D1117',
    secondary: '#2D323D',
    secondaryForeground: '#D1D5DB',
    accent: '#2D323D',
    destructive: '#F87171',
    // Süzgeç brand
    suzgecPrimary: '#4A8DF8',
    suzgecPrimaryLight: '#6BA3FA',
    suzgecSecondary: '#3D7CE8',
    suzgecAccent: '#22C1E0',
    suzgecSuccess: '#30D158',
    suzgecWarning: '#FFB340',
    suzgecDanger: '#FF453A',
    // Gradient
    gradientStart: '#6b21a8',
    gradientMid: '#4f46e5',
    gradientEnd: '#3b82f6',
    // Tab bar
    tabBar: '#1C1F26',
    tabBarBorder: '#3A3F4B',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#6BA3FA',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

export const BorderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
