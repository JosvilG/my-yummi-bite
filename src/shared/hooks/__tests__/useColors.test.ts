import { renderHook } from '@testing-library/react-native';
import { useColors } from '../useColors';
import { COLORS, COLORS_DARK } from '@/constants/theme';

// Mock useTheme
const mockUseTheme = jest.fn();
jest.mock('@/app/providers/ThemeProvider', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('useColors', () => {
  it('returns light colors when isDark is false', () => {
    mockUseTheme.mockReturnValue({ isDark: false });
    const { result } = renderHook(() => useColors());
    expect(result.current).toEqual(COLORS);
  });

  it('returns dark colors (merged) when isDark is true', () => {
    mockUseTheme.mockReturnValue({ isDark: true });
    const { result } = renderHook(() => useColors());
    expect(result.current).toEqual({ ...COLORS, ...COLORS_DARK });
  });
});
