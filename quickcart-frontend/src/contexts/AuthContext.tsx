import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from 'react';
import * as authService from '../services/authService';
import api from '../services/api';

// 1. Define a User type for the frontend
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_PARTNER';
}

// 2. Update the ContextType
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<User>; // <-- FIX: Return a Promise
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('quickcart_token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOnLoad = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const userData = await authService.getUserProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user on load', error);
          setToken(null);
          localStorage.removeItem('quickcart_token');
          api.defaults.headers.common['Authorization'] = null;
        }
      }
      setLoading(false);
    };

    fetchUserOnLoad();
  }, [token]); // This effect only runs once on load

  // --- START OF FIX ---
  const login = async (newToken: string): Promise<User> => {
    setToken(newToken);
    localStorage.setItem('quickcart_token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    try {
      // 1. Wait for the user profile to be fetched
      const userData = await authService.getUserProfile();
      setUser(userData);
      // 2. Return the user data
      return userData;
    } catch (error) {
      console.error('Failed to fetch user after login', error);
      // 3. If fetch fails, log out completely
      logout();
      throw error; // Re-throw the error to the login page
    }
  };
  // --- END OF FIX ---

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('quickcart_token');
    api.defaults.headers.common['Authorization'] = null;
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user, // True if user is not null
    loading,
    login, // The new async login function
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};