import { registerUser, loginUser, logoutUser } from '../authService';
import { auth } from '@/app/config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Mock firebase related modules
jest.mock('firebase/auth');
jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(() => jest.fn(() => Promise.resolve({ data: { created: true } }))),
}));
jest.mock('@/app/config/firebase', () => ({
  auth: {},
  functions: {},
}));
jest.mock('@/lib/sentry');
jest.mock('@/lib/logger');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('registers user successfully', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });

      const result = await registerUser('test@example.com', 'password', 'user1', 'Test User');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('returns error on failure using mock', async () => {
       (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Auth failed'));
       const result = await registerUser('test@example.com', 'password', 'user1', 'Test User');
       expect(result.success).toBe(false);
       expect(result.error).toBe('Auth failed');
    });
  });

  describe('loginUser', () => {
      it('logs in user successfully', async () => {
          const mockUser = { uid: '123' };
          (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
          
          const result = await loginUser('test@example.com', 'password');
          expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
          expect(result.success).toBe(true);
          expect(result.user).toEqual(mockUser);
      });
  });

  describe('logoutUser', () => {
      it('logs out user successfully', async () => {
          (signOut as jest.Mock).mockResolvedValue(undefined);
          const result = await logoutUser();
          expect(signOut).toHaveBeenCalledWith(auth);
          expect(result.success).toBe(true);
      });
  });
});
