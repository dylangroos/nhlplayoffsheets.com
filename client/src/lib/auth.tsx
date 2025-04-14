import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResponse>;
  signOut: () => void;
  getToken: () => string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'hawkins.groos@gmail.com';
console.log('API URL:', API_URL);

export const AuthContext = createContext<AuthContextType | null>(null);

async function handleResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
    return data;
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || 'An error occurred');
    }
    return text;
  }
}

function getStoredAuth(): { user: User | null; token: string | null } {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('Loading stored auth:', { storedUser, storedToken });
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken
    };
  } catch (error) {
    console.error('Error loading stored auth:', error);
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const { user: storedUser, token: storedToken } = getStoredAuth();
    console.log('Auth state on mount:', { storedUser, storedToken });
    if (storedUser && storedToken) {
      console.log('Setting initial auth state');
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const setCurrentUser = (newUser: User | null, newToken: string | null) => {
    console.log('Setting current user:', { newUser, newToken });
    setUser(newUser);
    setToken(newToken);
    
    if (newUser && newToken) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('Stored auth in localStorage');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Cleared auth from localStorage');
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await handleResponse(response);
      const newUser = {
        ...data.user,
        isAdmin: email === ADMIN_EMAIL
      };
      setCurrentUser(newUser, data.token);
      return {
        ...data,
        user: newUser
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting signup with:', { name, email });
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await handleResponse(response);
      const newUser = {
        ...data.user,
        isAdmin: email === ADMIN_EMAIL
      };
      setCurrentUser(newUser, data.token);
      return {
        ...data,
        user: newUser
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = () => {
    setCurrentUser(null, null);
  };

  const getToken = (): string | null => {
    return token;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.isAdmin || false,
    signIn,
    signUp,
    signOut,
    getToken,
  };

  console.log('Auth context value:', { 
    user: value.user ? 'exists' : 'null',
    isAuthenticated: value.isAuthenticated,
    isAdmin: value.isAdmin,
    token: token ? 'exists' : 'null'
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export async function getAllUsers(): Promise<User[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await fetch(`${API_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      credentials: 'include',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
} 