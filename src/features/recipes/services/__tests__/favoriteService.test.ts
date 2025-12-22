import {
  saveFavoriteRecipe,
  saveCustomFavoriteRecipe,
  removeFavoriteRecipe,
  getFavoriteRecipes
} from '../favoriteService';

// Mock dependencies
const mockHttpsCallable = jest.fn();
jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(),
  httpsCallable: (functionsInstance: any, name: string) => {
    return (...args: any[]) => mockHttpsCallable(name, ...args);
  }
}));
jest.mock('@/app/config/firebase', () => ({
  functions: {},
}));
jest.mock('@/lib/sentry');
jest.mock('@/lib/logger');

describe('favoriteService', () => {
  beforeEach(() => {
    mockHttpsCallable.mockClear();
  });

  it('saveFavoriteRecipe calls correct function', async () => {
    mockHttpsCallable.mockResolvedValue({ data: { success: true } });
    const result = await saveFavoriteRecipe('user1', 123, 'http://img.com');

    expect(mockHttpsCallable).toHaveBeenCalledWith('saveFavoriteRecipe', { 
        recipeId: 123, 
        imageUrl: 'http://img.com',
        cuisines: undefined // checking implicit undefined
    });
    expect(result.success).toBe(true);
  });

  it('saveCustomFavoriteRecipe calls correct function', async () => {
    mockHttpsCallable.mockResolvedValue({ data: { success: true } });
    const input = { title: 'Stew', imageUrl: 'img', ingredients: [], steps: [] };
    const result = await saveCustomFavoriteRecipe('user1', input);

    expect(mockHttpsCallable).toHaveBeenCalledWith('saveCustomFavoriteRecipe', input);
    expect(result.success).toBe(true);
  });

  it('removeFavoriteRecipe calls correct function', async () => {
    mockHttpsCallable.mockResolvedValue({ data: { success: true } });
    const result = await removeFavoriteRecipe('user1', 'doc123');
    
    expect(mockHttpsCallable).toHaveBeenCalledWith('removeFavoriteRecipe', { docId: 'doc123' });
    expect(result.success).toBe(true);
  });

  it('getFavoriteRecipes returns recipes', async () => {
    const mockRecipes = [{ docId: '1', title: 'Test' }];
    mockHttpsCallable.mockResolvedValue({ data: { recipes: mockRecipes } });
    
    const result = await getFavoriteRecipes('user1');
    expect(mockHttpsCallable).toHaveBeenCalledWith('getFavoriteRecipes');
    expect(result.recipes).toEqual(mockRecipes);
  });
});
