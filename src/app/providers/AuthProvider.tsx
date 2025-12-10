import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '@/features/auth/services/authService';
import { setUser as setSentryUser, addBreadcrumb } from '@/lib/sentry';
import { log } from '@/lib/logger';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    log.debug('AuthProvider initialized, subscribing to auth changes');
    
    const unsubscribe = subscribeToAuthChanges(authUser => {
      setUser(authUser);
      setLoading(false);
      
      // Update Sentry user context
      if (authUser) {
        log.info('User authenticated', { userId: authUser.uid, email: authUser.email });
        
        setSentryUser({
          id: authUser.uid,
          email: authUser.email ?? undefined,
        });
        
        addBreadcrumb({
          message: 'User authenticated',
          category: 'auth',
          level: 'info',
          data: { userId: authUser.uid },
        });
      } else {
        log.info('User logged out or session expired');
        
        setSentryUser(null);
        
        addBreadcrumb({
          message: 'User logged out',
          category: 'auth',
          level: 'info',
        });
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
