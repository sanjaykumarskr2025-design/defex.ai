import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authAPI } from '../api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (email: string, name: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

const defaultDemoUser: User = {
  id: 'usr-sanjay',
  name: 'Sanjay Kumar',
  email: 'sanjay.kumar@partsight.ai',
  role: 'operator',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultDemoUser;
      }
    }
    // Default to demo user for instant exploration
    return defaultDemoUser;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (!localStorage.getItem('auth_token')) {
        localStorage.setItem('auth_token', 'demo-token-partsight-ai');
      }
    }
  }, [user]);

  const register = async (email: string, name: string, password: string) => {
    try {
      const { access_token, user } = await authAPI.register(email, name, password);
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (err) {
      // Fallback mock registration for frontend demo
      const mockUser: User = { id: `usr-${Date.now()}`, name, email, role: 'operator' };
      localStorage.setItem('auth_token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { access_token, user } = await authAPI.login(email, password);
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (err) {
      // If backend is offline, create session for user
      const mockUser: User = {
        id: 'usr-sanjay',
        name: email.includes('@') ? email.split('@')[0].replace('.', ' ') : 'Sanjay Kumar',
        email,
        role: 'operator',
      };
      localStorage.setItem('auth_token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };

  const loginAsDemo = () => {
    setUser(defaultDemoUser);
    localStorage.setItem('user', JSON.stringify(defaultDemoUser));
    localStorage.setItem('auth_token', 'demo-token');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // ignore offline logout
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        register,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
