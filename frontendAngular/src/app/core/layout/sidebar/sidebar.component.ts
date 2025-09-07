import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';


export interface SidebarItem {
  label: string;
  route: string;
  icon: string;
}

export interface SidebarToggleEvent {
  isOpen: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 bg-primary-900 text-white min-h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out"
           [ngClass]="{'translate-x-0': isOpen, '-translate-x-full': !isOpen, 'md:translate-x-0': true}">
      
      <!-- Logo -->
      <div class="p-6 border-b border-primary-800">
        <h2 class="text-xl font-bold">
          <span class="text-orange-400">Stage</span>Richy48
        </h2>
      </div>

      <!-- Navigation -->
      <nav class="mt-10">
        <ul class="space-y-2 px-4">
          <li *ngFor="let item of menuItems; trackBy: trackByFn">
            <a [routerLink]="item.route" routerLinkActive="bg-orange-500 border-r-4 border-orange-300" class="flex items-center px-4 py-3 text-white hover:bg-primary-700 hover:text-orange-200 rounded-lg transition-colors duration-200 font-medium">
              <ng-container [ngSwitch]="item.icon">
                <svg *ngSwitchCase="'layout-dashboard'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <svg *ngSwitchCase="'file-text'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
                <svg *ngSwitchCase="'file-check'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <polyline points="9,15 11,17 15,13"></polyline>
                </svg>
                <svg *ngSwitchCase="'briefcase'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <svg *ngSwitchCase="'user'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <svg *ngSwitchCase="'users'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                </svg>
                <svg *ngSwitchCase="'building'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                  <path d="M6 12h4h4"></path>
                </svg>
                <svg *ngSwitchCase="'graduation-cap'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                <svg *ngSwitchCase="'building-2'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                  <path d="M6 12h4h4"></path>
                </svg>
                <svg *ngSwitchCase="'bar-chart'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <line x1="12" y1="20" x2="12" y2="10"></line>
                  <line x1="18" y1="20" x2="18" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
                <svg *ngSwitchCase="'settings'" class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33"></path>
                </svg>
              </ng-container>
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- User Info -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span class="text-sm font-bold text-primary-900">{{ userInitials }}</span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium">{{ userName }}</p>
              <p class="text-xs text-primary-300">{{ userRole }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            
             <button (click)="logout()" class="p-2 bg-red-600 hover:bg-red-700 text-white rounded" title="Déconnexion">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div *ngIf="isOpen" 
         class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
         (click)="toggleSidebar()">
    </div>
  `,
  styles: ``
})
export class SidebarComponent implements OnInit{
  @Input() menuItems: SidebarItem[] = [];
  @Input() userName: string = '';
  @Input() userRole: string = '';
  @Input() isOpen: boolean = true;

  @Output() sidebarToggled = new EventEmitter<boolean>();

 constructor(private authService: AuthService, private router: Router, loadUserDatal: DashboardLayoutComponent) {
    console.log('📱 DashboardLayoutComponent initialized');
    
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      console.log('❌ User not logged in, redirecting to login');
      this.router.navigate(['/auth/login']);
      return;
    }
    const loadBal=loadUserDatal.loadUserData();
    
  }
  
  get userInitials(): string {
    return this.userName.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  ngOnInit() {
    console.log("Menu Items in Sidebar:", this.menuItems);
}
  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggled.emit(this.isOpen);
  }
   logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  trackByFn(index: number, item: SidebarItem) {
    return item.route;
  }
}