import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService, type LoginData, type RegisterData } from '../services/authService';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('gigflow_token');
      const storedUser = localStorage.getItem('gigflow_user');

      if (!storedToken || !storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        const profileResponse = await authService.getProfile();
        setUser(profileResponse.user);
        localStorage.setItem('gigflow_user', JSON.stringify(profileResponse.user));
      } catch {
        localStorage.removeItem('gigflow_token');
        localStorage.removeItem('gigflow_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = useCallback(async (data: LoginData) => {
    const response = await authService.login(data);
    const { token: newToken, user: newUser } = response;

    localStorage.setItem('gigflow_token', newToken);
    localStorage.setItem('gigflow_user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data);
    const { token: newToken, user: newUser } = response;

    localStorage.setItem('gigflow_token', newToken);
    localStorage.setItem('gigflow_user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('gigflow_token');
    localStorage.removeItem('gigflow_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
