import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent, SidebarItem } from '../sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';
import { NotificationsComponent } from "../notifications/notifications.component";
enum UserRole{
  STUDENT='STUDENT',
  COMPANY='COMPANY',
  FACULTY='FACULTY',
  ADMIN='ADMIN'
}
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NotificationsComponent, NotificationsComponent],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <!-- DEBUG -->
      <div class="fixed top-0 right-0 bg-red-500 text-white p-2 z-50">
        Role: {{currentUser.role}} | Items: {{getMenuItems().length}}
      </div>
      
      <app-sidebar 
        [menuItems]="menuItems" 
        [userName]="currentUser. firstName || 'Utilisateur'"
        [userRole]="currentUser.role || 'USER'"
        [isOpen]="sidebarOpen"
        (sidebarToggled)="onSidebarToggle($event)">
      </app-sidebar>
      
      <div class="flex-1 transition-all duration-300 md:ml-64" [ngClass]="{'ml-0': !sidebarOpen}">
        <!-- Top bar -->
        <header class="bg-white shadow-sm border-b ">
          <div class="flex items-center justify-between px-6 py-4">
            <button (click)="toggleSidebar()" class="md:hidden text-primary-600 hover:text-primary-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            <div class="flex items-center space-x-4 ml-auto">
              <div class="relative">
                <!-- <svg class="w-6 h-6 text-primary-600 hover:text-primary-800 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span> -->
              <app-notifications/>
              </div>
              
              <button class="flex items-center space-x-3 text-primary-700 hover:text-primary-900">
                <div class="text-right">
                  <p class="text-sm font-medium text-primary-900">{{ currentUser. firstName }}</p>
                  <p class="text-xs text-primary-600">{{ currentUser.role }}</p>
                </div>
                <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold text-white">{{ userInitials }}</span>
                </div>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
             
            </div>
          </div>
        </header>

        <!-- Main content -->
        <main class="p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
      
      <!-- Notifications -->
      
    </div>
  `,
  styles: ``
})
export class DashboardLayoutComponent {
  sidebarOpen: boolean = true;
  
  currentUser: any = {
    firstName: 'Utilisateur',
    lastName: '',
    role: 'STUDENT',
    email: ''
  };

  menuItems: SidebarItem[] = [];

  constructor(private authService: AuthService, private router: Router) {
    console.log('📱 DashboardLayoutComponent initialized');
    
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      console.log('❌ User not logged in, redirecting to login');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.loadUserData();
  }

  public loadUserData(): void {
    console.log('👤 Loading user data...');
    
    // Récupérer l'utilisateur depuis le service d'auth
    const authUser = this.authService.getCurrentUser();
    if (authUser) {
      console.log('✅ User found in auth service:', authUser);
      this.currentUser = {
        firstName: authUser.firstName || 'Utilisateur',
        lastName: authUser.lastName || '',
        role: authUser.role || 'STUDENT',
        email: authUser.email || '',
        id: authUser.id
      };
      this.updateMenuItems();
    } else {
      console.log('⚠️ No user in auth service, trying to load from storage...');
      
      // Fallback: utiliser les données du localStorage
      const userRole = this.authService.getCurrentUserRole();
      const userId = this.authService.getCurrentUserId();
      
      if (userRole && userId) {
        console.log('✅ User data found in storage:', { role: userRole, id: userId });
        this.currentUser = {
          firstName: 'Utilisateur',
          lastName: '',
          role: userRole,
          email: '',
          id: userId
        };
        this.updateMenuItems();
        
        // Essayer de charger le profil complet
        this.loadUserProfile();
      } else {
        console.error('❌ No user data found, redirecting to login');
        this.router.navigate(['/auth/login']);
      }
    }
  }

  private loadUserProfile(): void {
    console.log('📄 Loading user profile from API...');
    
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        console.log('✅ User profile loaded:', profile);
        this.currentUser = {
          firstName: profile.firstName || 'Utilisateur',
          lastName: profile.lastName || '',
          role: profile.role,
          email: profile.email || '',
          id: profile.id
        };
        this.updateMenuItems();
      },
      error: (error) => {
        console.error('❌ Error loading user profile:', error);
        // Continue with existing data from storage
      }
    });
  }

  private updateMenuItems(): void {
    console.log('📝 Updating menu items for role:', this.currentUser.role);
    this.menuItems = this.getMenuItems();
    console.log('📝 Menu items updated:', this.menuItems);
  }
onSidebarToggle(open: boolean) {
  this.sidebarOpen = open;
}

  getMenuItems(): SidebarItem[] {
    console.log("Current User Role:", this.currentUser.role); // Pour déboguer
    switch (this.currentUser.role) {
      case 'STUDENT':
        return this.getStudentMenu();
      case 'COMPANY':
        return this.getCompanyMenu();
      case 'FACULTY':
        return this.getFacultyMenu();
      case 'ADMIN':
        return this.getAdminMenu();
      default:
        return [];
    }
  }

  private getStudentMenu(): SidebarItem[] {
    return [
      { label: 'Tableau de bord', route: '/student/dashboard', icon: 'layout-dashboard' },
      { label: 'Mes candidatures', route: '/student/applications', icon: 'file-text' },
      { label: 'Mes conventions', route: '/student/agreements', icon: 'file-check' },
      { label: 'Offres de stage', route: '/offers', icon: 'briefcase' },
      { label: 'Profil', route: '/profile', icon: 'user' }
    ];
  }

  private getCompanyMenu(): SidebarItem[] {
    return [
      { label: 'Tableau de bord', route: '/company/dashboard', icon: 'layout-dashboard' },
      { label: 'Mes offres', route: '/company/offers', icon: 'briefcase' },
      { label: 'Candidatures', route: '/company/applications', icon: 'users' },
      { label: 'Conventions', route: '/company/agreements', icon: 'file-check' },
      { label: 'Rapports', route: '/company/reports', icon: 'bar-chart' },
      { label: 'Profil entreprise', route: '/profile', icon: 'building' }
    ];
  }

  private getFacultyMenu(): SidebarItem[] {
    return [
      { label: 'Tableau de bord', route: '/faculty/dashboard', icon: 'layout-dashboard' },
      { label: 'Étudiants', route: '/faculty/students', icon: 'graduation-cap' },
      { label: 'Entreprises', route: '/faculty/companies', icon: 'building-2' },
      { label: 'Conventions', route: '/faculty/agreements', icon: 'file-check' },
      { label: 'Rapports', route: '/faculty/reports', icon: 'bar-chart' }
    ];
  }

  private getAdminMenu(): SidebarItem[] {
    return [
      { label: 'Tableau de bord', route: '/admin/dashboard', icon: 'layout-dashboard' },
      { label: 'Utilisateurs', route: '/admin/users', icon: 'users' },
      { label: 'Entreprises', route: '/admin/companies', icon: 'building-2' },
      { label: 'Conventions', route: '/admin/agreements', icon: 'file-check' },
      { label: 'Paramètres', route: '/admin/settings', icon: 'settings' },
      { label: 'Rapports', route: '/admin/reports', icon: 'bar-chart' }
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get userInitials(): string {
    const firstName = this.currentUser.firstName || 'U';
    const lastName = this.currentUser.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
