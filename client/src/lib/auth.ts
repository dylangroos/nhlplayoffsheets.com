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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
console.log('API URL:', API_URL);

// Store the current user in memory and localStorage
let currentUser: User | null = null;

function setCurrentUser(user: User | null, token: string | null) {
  currentUser = user;
  if (user && token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Initialize currentUser from localStorage if available
try {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }
} catch (error) {
  console.error('Error loading stored user:', error);
}

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

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    const user = {
      ...data.user,
      isAdmin: email === 'hawkins.groos@gmail.com'
    };
    setCurrentUser(user, data.token);
    return {
      ...data,
      user
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('Attempting signup with:', { name, email });
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await handleResponse(response);
    const user = {
      ...data.user,
      isAdmin: email === 'hawkins.groos@gmail.com'
    };
    setCurrentUser(user, data.token);
    return {
      ...data,
      user
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export function signOut() {
  setCurrentUser(null, null);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  return currentUser?.isAdmin || false;
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export async function getAllUsers(): Promise<User[]> {
  if (!isAdmin()) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await fetch(`${API_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
} 