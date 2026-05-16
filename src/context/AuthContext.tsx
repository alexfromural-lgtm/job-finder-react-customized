import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Role, JobSeekerSignupRequest, RecruiterSignupRequest } from '../types';
import * as AuthApi from '../api/auth.api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signupJobSeeker: (data: JobSeekerSignupRequest) => Promise<void>;
  signupRecruiter: (data: RecruiterSignupRequest) => Promise<void>;
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

  /**
   * Signs up a job seeker and immediately hydrates the auth context.
   * This ensures the user is "logged in" right after signup without
   * a separate login step.
   */
  const signupJobSeeker = useCallback(async (data: JobSeekerSignupRequest) => {
    await AuthApi.signupJobSeeker(data);
    const me = await AuthApi.getMe();
    setUser(me);
  }, []);

  /**
   * Signs up a recruiter and immediately hydrates the auth context.
   */
  const signupRecruiter = useCallback(async (data: RecruiterSignupRequest) => {
    await AuthApi.signupRecruiter(data);
    const me = await AuthApi.getMe();
    setUser(me);
  }, []);

  // On mount: attempt to restore session by calling /auth/me.
  // The browser sends the accessToken cookie automatically.
  // If the token is expired, the axios interceptor will transparently refresh it.
  // AbortController ensures React 18 StrictMode's double-mount doesn't fire two
  // real requests — the first effect cleanup cancels the in-flight call.
  useEffect(() => {
    const controller = new AbortController();
    AuthApi.getMe(controller.signal)
      .then((me) => setUser(me))
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return; // ignore aborted requests
        setUser(null);
      })
      .finally(() => {
        // Only clear the loading flag if this effect instance was NOT aborted.
        // In React 18 StrictMode, the first mount is immediately unmounted and
        // its controller is aborted. Setting isLoading=false on that aborted
        // request would make ProtectedRoute redirect to /login before the
        // second (real) request completes.
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
    return () => controller.abort();
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
        signupJobSeeker,
        signupRecruiter,
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
