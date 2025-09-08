import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { WebSocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold">
              <span class="text-orange-500">Stage</span>
              <span class="text-primary-900">Richy48</span>
            </h1>
          </div>
          <nav class="hidden md:flex space-x-8">
            <a routerLink="/" class="text-gray-700 hover:text-orange-500">
              Accueil
            </a>
            <a routerLink="/offers" class="text-gray-700 hover:text-orange-500">
              Offres
            </a>
            <a href="#about" class="text-gray-700 hover:text-orange-500">
              À propos
            </a>
          </nav>
          <div class="flex items-center space-x-4"*ngIf="!isLoggedIn">
            <a routerLink="/auth/register">
              <button class="border-2 border-primary-900 text-primary-900 hover:bg-primary-100 px-4 py-2 rounded-md">
                S'inscrire
              </button>
            </a>
            <a routerLink="/auth/login">
              <button class="bg-primary-900 text-white hover:bg-primary-800 px-4 py-2 rounded-md">
                Se connecter
              </button>
            </a>
          </div>
          <div *ngIf="isLoggedIn" class="flex items-center space-x-4">
            <!-- Notifications Bell -->
            <div class="relative">
              <button 
                (click)="toggleNotifications()" 
                class="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span *ngIf="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{{unreadCount}}</span>
              </button>
              
              <!-- Notifications Dropdown -->
              <div *ngIf="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1 max-h-96 overflow-y-auto">
                  <div class="px-4 py-2 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                      <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                      <button *ngIf="unreadCount > 0" (click)="markAllAsRead()" class="text-xs text-primary-600 hover:text-primary-800">Tout marquer comme lu</button>
                    </div>
                  </div>
                  <div *ngIf="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                    Aucune notification
                  </div>
                  <div *ngFor="let notification of notifications" 
                       class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                       [class.bg-blue-50]="!notification.read"
                       (click)="markAsRead(notification)">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <p class="text-sm text-gray-900" [class.font-semibold]="!notification.read">{{notification.message}}</p>
                        <p class="text-xs text-gray-500 mt-1">{{formatDate(notification.createdAt)}}</p>
                      </div>
                      <div *ngIf="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button (click)="logout()" class="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: ``
})
export class NavbarComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  userRole: string | null = null;
  notifications: any[] = [];
  unreadCount: number = 0;
  showNotifications: boolean = false;
  private subscriptions: Subscription[] = [];

 get isLoggedIn(): boolean {
  try{
    return this.authService.isLoggedIn();
  }catch(error){
    console.error('Error checking login status:', error);
    return false;
  }
 }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService
  ) {
    if(this.authService.isLoggedIn()){
      this.userRole = this.authService.getCurrentUserRole();
      console.log('Role utilisateur:', this.userRole);
    }
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.loadNotifications();
      this.loadUnreadCount();
      this.initializeWebSocket();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.webSocketService.disconnect();
  }

  private initializeWebSocket(): void {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.webSocketService.connect(user.id.toString());
      
      const notificationSub = this.webSocketService.notifications$.subscribe((notification: any) => {
        if (notification) {
          this.notifications.unshift(notification);
          this.unreadCount++;
        }
      });
      
      this.subscriptions.push(notificationSub);
    }
  }

  private loadNotifications(): void {
    // Load server notifications
    const serverNotificationSub = this.notificationService.getServerNotifications().subscribe({
      next: (response: any) => {
        this.notifications = response.content || response || [];
      },
      error: (error: any) => console.error('Error loading server notifications:', error)
    });
    
    // Also subscribe to local notifications for real-time updates
    const localNotificationSub = this.notificationService.getNotifications().subscribe({
      next: (notifications: any) => {
        // Merge with server notifications if needed
        console.log('Local notifications updated:', notifications);
      },
      error: (error: any) => console.error('Error loading local notifications:', error)
    });
    
    this.subscriptions.push(serverNotificationSub, localNotificationSub);
  }

  private loadUnreadCount(): void {
    const countSub = this.notificationService.getServerUnreadCount().subscribe({
      next: (response: any) => {
        this.unreadCount = response.count || 0;
      },
      error: (error: any) => console.error('Error loading unread count:', error)
    });
    
    this.subscriptions.push(countSub);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notification: any): void {
    if (!notification.read) {
      const markSub = this.notificationService.markServerNotificationAsRead(notification.id).subscribe({
        next: () => {
          notification.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          if (notification.link) {
            this.router.navigate([notification.link]);
          }
        },
        error: (error: any) => console.error('Error marking notification as read:', error)
      });
      this.subscriptions.push(markSub);
    } else if (notification.link) {
      this.router.navigate([notification.link]);
    }
    
    this.showNotifications = false;
  }

  markAllAsRead(): void {
    const markAllSub = this.notificationService.markAllServerNotificationsAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      },
      error: (error: any) => console.error('Error marking all notifications as read:', error)
    });
    this.subscriptions.push(markAllSub);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  }
}
