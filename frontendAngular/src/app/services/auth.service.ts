import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthResponse, CompanyRegistrationRequest, LoginRequest, StudentRegistrationRequest, User, UserRole } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';
  private userRoleKey = 'user_role';
  
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    console.log('🔐 AuthService initialized');
    // Check if user is already logged in on application start
    this.loadUserFromStorage();
  }

  loadUserFromStorage(): void {
    console.log('📱 Loading user from localStorage...');
    const token = localStorage.getItem(this.tokenKey);
    const userId = localStorage.getItem(this.userIdKey);
    const userRole = localStorage.getItem(this.userRoleKey);

    console.log('🔍 Storage check:', { 
      hasToken: !!token, 
      userId, 
      userRole,
      tokenPreview: token ? token.substring(0, 20) + '...' : null
    });

    if (token && userId && userRole) {
      console.log('✅ User found in storage, creating session');
      // We don't have complete user info, but we can create a partial user object
      // The complete user info can be loaded when needed via getUserProfile()
      this.currentUserSubject.next({
        id: parseInt(userId),
        role: userRole as UserRole,
        firstName: '',
        lastName: '',
        email: '',
        enabled: true,
        createdAt: '',
        updatedAt: ''
      });
    } else {
      console.log('❌ No valid user session found');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔑 Attempting login for:', credentials.email);
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        console.log('✅ Login successful:', { userId: response.userId, role: response.role });
        this.handleAuthResponse(response);
      }),
      catchError(error => {
        console.error('❌ Login failed:', error);
        return throwError(() => new Error(error.error || 'Login failed. Please check your credentials.'));
      })
    );
  }

  registerStudent(registrationData: StudentRegistrationRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register/student', registrationData).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Student registration error:', error);
        return throwError(() => new Error(error.error || 'Registration failed. Please try again.'));
      })
    );
  }

  registerCompany(registrationData: CompanyRegistrationRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register/company', registrationData).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Company registration error:', error);
        return throwError(() => new Error(error.error || 'Registration failed. Please try again.'));
      })
    );
  }

  registerSchool(registrationData: any): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register/school', registrationData).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('School registration error:', error);
        return throwError(() => new Error(error.error || 'Registration failed. Please try again.'));
      })
    );
  }

  getUserProfile(): Observable<User> {
    return this.apiService.get<User>('/users/me').pipe(
      tap(user => {
        // Update the stored user info
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Get user profile error:', error);
        return throwError(() => new Error('Failed to load user profile.'));
      })
    );
  }

  logout(): void {
    console.log('🚪 Logging out user');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userRoleKey);
    this.currentUserSubject.next(null);
    console.log('✅ Logout complete');
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.apiService.post('/users/change-password', {
      currentPassword,
      newPassword
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(role: UserRole): boolean {
    const userRole = localStorage.getItem(this.userRoleKey);
    return userRole === role;
  }

  isStudent(): boolean {
    return this.hasRole(UserRole.STUDENT);
  }

  isCompany(): boolean {
    return this.hasRole(UserRole.COMPANY);
  }

  isFaculty(): boolean {
    return this.hasRole(UserRole.FACULTY);
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId) : null;
  }

  getCurrentUserRole(): UserRole | null {
    const role = localStorage.getItem(this.userRoleKey);
    return role as UserRole || null;
  }

  private handleAuthResponse(response: AuthResponse): void {
    console.log('💾 Saving auth data to localStorage:', {
      userId: response.userId,
      role: response.role,
      tokenLength: response.token.length
    });
    
    // Save auth data to local storage
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userIdKey, response.userId.toString());
    localStorage.setItem(this.userRoleKey, response.role);
    
    // Update the current user subject
    this.loadUserFromStorage();
  }
}
