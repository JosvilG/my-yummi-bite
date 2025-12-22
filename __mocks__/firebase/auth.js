module.exports = {
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
};
