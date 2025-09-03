import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConnectorService } from '../../services/api-connector.service';
import { AppInitializerService } from '../../services/app-initializer.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-api-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">🔗 État des Connexions API</h3>
      
      <!-- Overall Status -->
      <div class="mb-4 p-3 rounded-lg" [ngClass]="{
        'bg-green-100 border border-green-300': appStatus?.backendConnection?.overall,
        'bg-red-100 border border-red-300': !appStatus?.backendConnection?.overall,
        'bg-yellow-100 border border-yellow-300': !appStatus
      }">
        <div class="flex items-center">
          <span class="text-2xl mr-2">
            {{ appStatus?.backendConnection?.overall ? '✅' : '❌' }}
          </span>
          <span class="font-medium">
            {{ appStatus?.backendConnection?.overall ? 'Backend Connecté' : 'Backend Déconnecté' }}
          </span>
        </div>
      </div>

      <!-- Detailed Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="space-y-2">
          <h4 class="font-medium text-gray-700">Services Backend:</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span>Backend Principal:</span>
              <span [ngClass]="{
                'text-green-600': connectionStatus?.backend,
                'text-red-600': !connectionStatus?.backend
              }">
                {{ connectionStatus?.backend ? '✅ Connecté' : '❌ Déconnecté' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>API Offres:</span>
              <span [ngClass]="{
                'text-green-600': connectionStatus?.offers,
                'text-red-600': !connectionStatus?.offers
              }">
                {{ connectionStatus?.offers ? '✅ Connecté' : '❌ Déconnecté' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>API Applications:</span>
              <span [ngClass]="{
                'text-green-600': connectionStatus?.applications,
                'text-red-600': !connectionStatus?.applications
              }">
                {{ connectionStatus?.applications ? '✅ Connecté' : '❌ Déconnecté' }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="font-medium text-gray-700">Session Utilisateur:</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span>Authentifié:</span>
              <span [ngClass]="{
                'text-green-600': appStatus?.userAuthenticated,
                'text-red-600': !appStatus?.userAuthenticated
              }">
                {{ appStatus?.userAuthenticated ? '✅ Oui' : '❌ Non' }}
              </span>
            </div>
            <div class="flex justify-between" *ngIf="appStatus?.currentUser">
              <span>Rôle:</span>
              <span class="text-blue-600 font-medium">
                {{ appStatus.currentUser.role }}
              </span>
            </div>
            <div class="flex justify-between" *ngIf="appStatus?.currentUser">
              <span>ID:</span>
              <span class="text-gray-600">
                {{ appStatus.currentUser.id }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex space-x-3">
        <button 
          (click)="testConnections()"
          [disabled]="testing"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ testing ? '🔄 Test en cours...' : '🔍 Tester Connexions' }}
        </button>
        
        <button 
          (click)="refreshStatus()"
          [disabled]="refreshing"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ refreshing ? '🔄 Actualisation...' : '🔄 Actualiser' }}
        </button>
      </div>

      <!-- Last Update -->
      <div class="mt-4 text-xs text-gray-500">
        Dernière mise à jour: {{ lastUpdate | date:'medium' }}
      </div>
    </div>
  `
})
export class ApiStatusComponent implements OnInit {
  appStatus: any = null;
  connectionStatus: any = null;
  testing = false;
  refreshing = false;
  lastUpdate = new Date();

  constructor(
    private apiConnector: ApiConnectorService,
    private appInitializer: AppInitializerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.appStatus = this.appInitializer.getAppStatus();
    this.connectionStatus = this.apiConnector.getConnectionStatus();
    this.lastUpdate = new Date();
  }

  testConnections(): void {
    this.testing = true;
    this.apiConnector.testAllConnections().subscribe({
      next: (results) => {
        console.log('🔍 Connection test results:', results);
        this.loadStatus();
        this.testing = false;
      },
      error: (error) => {
        console.error('❌ Connection test failed:', error);
        this.testing = false;
      }
    });
  }

  refreshStatus(): void {
    this.refreshing = true;
    this.appInitializer.reinitialize().subscribe({
      next: (result) => {
        console.log('🔄 App reinitialized:', result);
        this.loadStatus();
        this.refreshing = false;
      },
      error: (error) => {
        console.error('❌ App reinitialization failed:', error);
        this.refreshing = false;
      }
    });
  }
}