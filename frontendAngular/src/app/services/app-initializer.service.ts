import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiConnectorService } from './api-connector.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  constructor(
    private apiConnector: ApiConnectorService,
    private authService: AuthService
  ) {}

  /**
   * Initialize the application
   * This method is called when the app starts
   */
  initializeApp(): Observable<any> {
    console.log('🚀 Initializing application...');
    
    return new Observable(observer => {
      // Step 1: Test backend connectivity
      console.log('📡 Step 1: Testing backend connectivity...');
      this.apiConnector.testAllConnections().pipe(
        tap(connectionResults => {
          console.log('✅ Backend connectivity test completed:', connectionResults);
        }),
        catchError(error => {
          console.error('❌ Backend connectivity test failed:', error);
          return of({ error: 'Backend connection failed' });
        })
      ).subscribe({
        next: (connectionResults) => {
          // Step 2: Initialize user session if logged in
          if (this.authService.isLoggedIn()) {
            console.log('👤 Step 2: User is logged in, initializing session...');
            this.apiConnector.initializeUserSession().pipe(
              tap(sessionData => {
                console.log('✅ User session initialized:', sessionData);
              }),
              catchError(error => {
                console.error('❌ User session initialization failed:', error);
                return of({ error: 'Session initialization failed' });
              })
            ).subscribe({
              next: (sessionData) => {
                observer.next({
                  connectionResults,
                  sessionData,
                  status: 'success',
                  message: 'Application initialized successfully'
                });
                observer.complete();
              },
              error: (error) => {
                observer.next({
                  connectionResults,
                  sessionData: null,
                  status: 'partial',
                  message: 'Application initialized with session errors',
                  error
                });
                observer.complete();
              }
            });
          } else {
            console.log('👤 Step 2: No user logged in, skipping session initialization');
            observer.next({
              connectionResults,
              sessionData: null,
              status: 'success',
              message: 'Application initialized successfully (no user session)'
            });
            observer.complete();
          }
        },
        error: (error) => {
          observer.next({
            connectionResults: null,
            sessionData: null,
            status: 'error',
            message: 'Application initialization failed',
            error
          });
          observer.complete();
        }
      });
    });
  }

  /**
   * Get application status
   */
  getAppStatus(): any {
    return {
      backendConnection: this.apiConnector.getConnectionStatus(),
      userAuthenticated: this.authService.isLoggedIn(),
      currentUser: this.authService.getCurrentUser(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reinitialize the application
   */
  reinitialize(): Observable<any> {
    console.log('🔄 Reinitializing application...');
    return this.initializeApp();
  }
}

/**
 * Factory function for APP_INITIALIZER
 */
export function appInitializerFactory(appInitializer: AppInitializerService) {
  return () => {
    return new Promise((resolve) => {
      appInitializer.initializeApp().subscribe({
        next: (result) => {
          console.log('🎯 App initialization completed:', result);
          resolve(result);
        },
        error: (error) => {
          console.error('💥 App initialization failed:', error);
          resolve({ error: 'Initialization failed' });
        }
      });
    });
  };
}