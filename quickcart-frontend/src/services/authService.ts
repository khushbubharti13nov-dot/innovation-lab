import { isAxiosError } from 'axios'; // <-- IMPORT THIS
import type { User } from '../contexts/AuthContext';
import api from './api';

// --- EXISTING LoginCredentials INTERFACE ---
interface LoginCredentials {
  email: string;
  password: string;
}

// --- EXISTING AuthResponse INTERFACE ---
interface AuthResponse {
  token: string;
}

// --- EXISTING login FUNCTION ---
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) { // <-- FIX: Removed 'any'
    // Check if it's an error from axios
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    // Handle other types of errors
    throw new Error('An unexpected error occurred during login');
  }
};

// --- !! NEW FUNCTION TO ADD !! ---
// This function gets the user's data from their token
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  } catch (error) { // <-- FIX: Removed 'any'
    // Check if it's an error from axios
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
    // Handle other types of errors
    throw new Error('An unexpected error occurred while fetching profile');
  }
};