import { useMemo } from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { COLORS, COLORS_DARK } from '@/constants/theme';

export const useColors = () => {
  const { isDark } = useTheme();
  
  const colors = useMemo(() => {
    return isDark ? { ...COLORS, ...COLORS_DARK } : COLORS;
  }, [isDark]);
  
  return colors;
};
