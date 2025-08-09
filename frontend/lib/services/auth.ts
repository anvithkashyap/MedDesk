import { apiClient } from '../api-client';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/api';
import Cookies from 'js-cookie';

export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store token and user data in cookies
    Cookies.set('auth-token', response.data.access_token, { expires: 1 }); // 1 day
    Cookies.set('user-data', JSON.stringify(response.data.user), { expires: 1 });
    
    return response.data;
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    // Store token and user data in cookies
    Cookies.set('auth-token', response.data.access_token, { expires: 1 });
    Cookies.set('user-data', JSON.stringify(response.data.user), { expires: 1 });
    
    return response.data;
  }

  // Get current user profile
  static async getProfile(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>('/auth/profile');
    return response.data;
  }

  // Logout user
  static logout(): void {
    Cookies.remove('auth-token');
    Cookies.remove('user-data');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!Cookies.get('auth-token');
  }

  // Get current user from cookies
  static getCurrentUser(): any | null {
    const userData = Cookies.get('user-data');
    return userData ? JSON.parse(userData) : null;
  }

  // Get auth token
  static getToken(): string | null {
    return Cookies.get('auth-token') || null;
  }
}
