import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Role } from '../types';
import * as AuthApi from '../api/auth.api';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokenAndFetchUser: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('accessToken')
  );
  const [isLoading, setIsLoading] = useState(true);

  const hasRole = useCallback(
    (role: Role) => user?.roles.includes(role) ?? false,
    [user]
  );

  const fetchUser = useCallback(async (token: string, signal?: AbortSignal) => {
    try {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
      const me = await AuthApi.getMe(signal);
      setUser(me);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'ERR_CANCELED') return; // aborted — ignore
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const setTokenAndFetchUser = useCallback(
    async (token: string) => {
      await fetchUser(token);
    },
    [fetchUser]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken: token } = await AuthApi.login({ email, password });
      await fetchUser(token);
    },
    [fetchUser]
  );

  const logout = useCallback(async () => {
    try {
      await AuthApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  // On mount: if we have a stored token, try to restore the session
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setIsLoading(false); return; }
    const controller = new AbortController();
    fetchUser(token, controller.signal).finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [fetchUser]);

  // Listen for 401 events from the axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
    };
    const handleTokenRefreshed = (e: Event) => {
      const newToken = (e as CustomEvent<string>).detail;
      setAccessToken(newToken);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:tokenRefreshed', handleTokenRefreshed);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:tokenRefreshed', handleTokenRefreshed);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        hasRole,
        login,
        logout,
        setTokenAndFetchUser,
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
