import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'landlord';
  studentNumber?: string;
  gender?: 'male' | 'female' | 'other';
  hasDisability?: boolean;
  residenceName?: string;
  location?: string;
  isVerified?: boolean;
  allocatedRoom?: string;
  applicationStatus?: 'none' | 'pending' | 'accepted' | 'allocated';
  createdAt: string;
  updatedAt: string;
}

export interface StudentRegistrationData {
  name: string;
  email: string;
  password: string;
  studentNumber: string;
  gender: 'male' | 'female' | 'other';
  hasDisability: boolean;
}

export interface LandlordRegistrationData {
  name: string;
  email: string;
  password: string;
  residenceName: string;
  location: string;
  proofOfResidence: File;
}

export interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  registerStudent: (data: StudentRegistrationData) => Promise<void>;
  registerLandlord: (data: LandlordRegistrationData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios
axios.defaults.baseURL = API_BASE_URL;

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set authorization header
  const setAuthHeader = (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  };

  // Remove authorization header
  const removeAuthHeader = () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  };

  // Login function
  const login = async (data: LoginData): Promise<void> => {
    try {
      const response = await axios.post('/auth/login', data);
      const { user: userData, token } = response.data;
      
      setUser(userData);
      setAuthHeader(token);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    removeAuthHeader();
  };

  // Student registration function
  const registerStudent = async (data: StudentRegistrationData): Promise<void> => {
    try {
      const response = await axios.post('/auth/register/student', data);
      const { user: userData, token } = response.data;
      
      setUser(userData);
      setAuthHeader(token);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  // Landlord registration function
  const registerLandlord = async (data: LandlordRegistrationData): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('residenceName', data.residenceName);
      formData.append('location', data.location);
      formData.append('proofOfResidence', data.proofOfResidence);

      const response = await axios.post('/auth/register/landlord', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { user: userData, token } = response.data;
      
      setUser(userData);
      setAuthHeader(token);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      // If refresh fails, logout user
      logout();
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        setAuthHeader(token);
        try {
          const response = await axios.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, remove it
          removeAuthHeader();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Axios response interceptor for handling auth errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    registerStudent,
    registerLandlord,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};