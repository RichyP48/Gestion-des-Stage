import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, UserProfileUpdateRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Get current user's profile
   */
  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('/users/me');
  }

  /**
   * Alias for getCurrentUser - used by profile components
   */
  getCurrentUserProfile(): Observable<User> {
    return this.getCurrentUser();
  }

  /**
   * Update current user's profile
   * @param userData Updated user profile data
   */
  updateProfile(userData: UserProfileUpdateRequest): Observable<User> {
    return this.apiService.put<User>('/users/me', userData);
  }

  /**
   * Alias for updateProfile - used by profile components
   * @param userData Updated user profile data
   */
  updateUserProfile(userData: UserProfileUpdateRequest): Observable<User> {
    return this.updateProfile(userData);
  }

  // Admin-only methods
  
  /**
   * Get all users (admin only)
   * @param page Page number
   * @param size Page size
   */
  getAllUsers(page = 0, size = 20): Observable<any> {
    return this.apiService.get<any>(`/admin/users?page=${page}&size=${size}`);
  }

  /**
   * Get user by ID (admin only)
   * @param userId User ID
   */
  getUserById(userId: number): Observable<User> {
    return this.apiService.get<User>(`/admin/users/${userId}`);
  }

  /**
   * Create a new user (admin only)
   * @param userData User data
   */
  createUser(userData: any): Observable<User> {
    return this.apiService.post<User>('/admin/users', userData);
  }

  /**
   * Update a user (admin only)
   * @param userId User ID
   * @param userData Updated user data
   */
  updateUser(userId: number, userData: any): Observable<User> {
    return this.apiService.put<User>(`/admin/users/${userId}`, userData);
  }

  /**
   * Delete/disable a user (admin only)
   * @param userId User ID
   */
  deleteUser(userId: number): Observable<void> {
    return this.apiService.delete<void>(`/admin/users/${userId}`);
  }

  /**
   * Get students for faculty
   * @param page Page number
   * @param size Page size
   */
  getStudentsForFaculty(page = 0, size = 20): Observable<any> {
    return this.apiService.get<any>(`/faculty/students?page=${page}&size=${size}`);
  }
}
