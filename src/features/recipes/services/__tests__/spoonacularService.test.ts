import { searchRecipes } from '../spoonacularService';
import FeatureFlags from '@/config/featureFlags';

// Mock dependencies
jest.mock('@/config/featureFlags', () => ({
  USE_MOCK_RECIPES: false,
}));
jest.mock('@/lib/logger');
jest.mock('@/lib/sentry');
// Mock Expo Constants
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { EXPO_PUBLIC_FUNCTIONS_BASE_URL: 'https://api.test' } },
}));

describe('spoonacularService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('searchRecipes returns error if query is empty', async () => {
    const result = await searchRecipes('');
    expect(result.success).toBe(false);
    expect(result.error).toContain('required');
  });

  it('searchRecipes performs fetch call', async () => {
    const mockResponse = { success: true, recipes: [{ id: 1, title: 'Pasta' }] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await searchRecipes('pasta');

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/recipesSearch?query=pasta'));
    expect(result.success).toBe(true);
    expect(result.recipes).toHaveLength(1);
  });

  it('searchRecipes handles fetch failures', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({}),
    });

    const result = await searchRecipes('fail');
    expect(result.success).toBe(false);
  });
});
