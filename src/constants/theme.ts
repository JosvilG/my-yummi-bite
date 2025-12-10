export const COLORS = {
  primary: '#FF8A9B',     
  secondary: '#FFB5C0',    
  tertiary: '#FFF0F3',      
  background: '#FFFFFF',
  text: '#1A1A2E',
  textLight: '#6B7280',
  border: '#E5E7EB',
  error: '#E74C3C',
  success: '#7DD3C0',       
  warning: '#FFD4A3',  
  accent: '#7DD3C0',        
  teal: '#7DD3C0',          
  coral: '#FFA5A5',         
  peach: '#FFCAB8',         
} as const;

export const COLORS_DARK = {
  primary: '#FF8A9B',     
  secondary: '#CC8A94',    
  tertiary: '#2A2A3E',      
  background: '#1A1A2E',
  text: '#F5F5F5',
  textLight: '#A0A0B0',
  border: '#3A3A4E',
  error: '#E74C3C',
  success: '#7DD3C0',       
  warning: '#FFD4A3',  
  accent: '#7DD3C0',        
  teal: '#7DD3C0',          
  coral: '#FFA5A5',         
  peach: '#FFCAB8',
  card: '#252538',
} as const;

export type ThemeColors = {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  text: string;
  textLight: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  accent: string;
  teal: string;
  coral: string;
  peach: string;
  card?: string;
};

export const getColors = (isDark: boolean): ThemeColors => {
  return isDark ? { ...COLORS, ...COLORS_DARK } : COLORS;
};

export const FONTS = {
  bold: 'Poppins-Bold',
  medium: 'Poppins-Medium',
  regular: 'Poppins-Regular',
} as const;

export const SIZES = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;
