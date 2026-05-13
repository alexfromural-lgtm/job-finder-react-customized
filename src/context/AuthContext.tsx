import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Role } from '../types';
import * as AuthApi from '../api/auth.api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasRole = useCallback(
    (role: Role) => user?.roles.includes(role) ?? false,
    [user]
  );

  const login = useCallback(async (email: string, password: string) => {
    // Backend sets accessToken + refreshToken cookies; just fetch the user profile
    await AuthApi.login({ email, password });
    const me = await AuthApi.getMe();
    setUser(me);
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthApi.logout(); // backend clears both cookies
    } finally {
      setUser(null);
    }
  }, []);

  // On mount: attempt to restore session by calling /auth/me.
  // The browser sends the accessToken cookie automatically.
  // If the token is expired, the axios interceptor will transparently refresh it.
  useEffect(() => {
    AuthApi.getMe()
      .then((me) => setUser(me))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  // Listen for 401 events from the axios interceptor (refresh also failed)
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        hasRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
