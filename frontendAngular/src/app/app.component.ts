import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomMonitorService } from './services/dom-monitor.service';
import { ApiConnectorService } from './services/api-connector.service';
import { AppInitializerService } from './services/app-initializer.service';
import { AuthService } from './services/auth.service';
import { ApiStatusComponent } from './components/shared/api-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ApiStatusComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Development API Status (only show in development) -->
      <div *ngIf="showApiStatus" class="bg-blue-50 border-b border-blue-200 p-2">
        <div class="container mx-auto">
          <div class="flex items-center justify-between text-sm">
            <span class="text-blue-700">🔧 Mode Développement - État API</span>
            <div class="flex items-center space-x-4">
              <span [ngClass]="{
                'text-green-600': apiStatus?.overall,
                'text-red-600': !apiStatus?.overall
              }">
                {{ apiStatus?.overall ? '✅ Backend Connecté' : '❌ Backend Déconnecté' }}
              </span>
              <span *ngIf="isAuthenticated" class="text-blue-600">
                👤 {{ currentUserRole }}
              </span>
              <button 
                (click)="toggleApiStatus()"
                class="text-blue-600 hover:text-blue-800">
                {{ showDetailedStatus ? '▼' : '▶' }} Détails
              </button>
            </div>
          </div>
          
          <!-- Detailed API Status -->
          <div *ngIf="showDetailedStatus" class="mt-2 p-3 bg-white rounded border">
            <app-api-status></app-api-status>
          </div>
        </div>
      </div>

      <!-- Main Application Content -->
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'stagerichy48';
  showApiStatus = !window.location.href.includes('production');
  showDetailedStatus = false;
  apiStatus: any = null;
  isAuthenticated = false;
  currentUserRole: string | null = null;

  constructor(
    private domMonitor: DomMonitorService,
    private apiConnector: ApiConnectorService,
    private appInitializer: AppInitializerService,
    private authService: AuthService
  ) {
    console.log('🚀 AppComponent constructor called');
    console.log('📱 Application starting...', {
      title: this.title,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  ngOnInit(): void {
    console.log('✅ AppComponent initialized');
    this.domMonitor.logComponentLoad('AppComponent');
    
    // Log environment info
    console.log('🌍 Environment info:', {
      production: !window.location.href.includes('localhost'),
      protocol: window.location.protocol,
      host: window.location.host,
      pathname: window.location.pathname
    });

    // Log API connection status
    console.log('🔗 API Connection Status:', this.apiConnector.getConnectionStatus());
    console.log('👤 Authentication Status:', {
      isLoggedIn: this.authService.isLoggedIn(),
      currentUser: this.authService.getCurrentUser(),
      userRole: this.authService.getCurrentUserRole()
    });

    // Log app initialization status
    console.log('🎯 App Status:', this.appInitializer.getAppStatus());

    // Update component properties
    this.updateStatus();
  }

  updateStatus(): void {
    this.apiStatus = this.apiConnector.getConnectionStatus();
    this.isAuthenticated = this.authService.isLoggedIn();
    this.currentUserRole = this.authService.getCurrentUserRole();
  }

  toggleApiStatus(): void {
    this.showDetailedStatus = !this.showDetailedStatus;
  }
}
