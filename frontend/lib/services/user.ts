import { apiClient } from '../api-client';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/api';

export class UserService {
  // Get all users
  static async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }

  // Create new user
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  }

  // Update user
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, userData);
    return response.data;
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  // Activate user
  static async activateUser(id: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/activate`);
    return response.data;
  }

  // Deactivate user
  static async deactivateUser(id: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/deactivate`);
    return response.data;
  }
}
