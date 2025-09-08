import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { WebSocketService } from '../../../services/websocket.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
          <button 
            *ngIf="unreadCount > 0" 
            (click)="markAllAsRead()" 
            class="text-sm text-primary-600 hover:text-primary-800"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>
      
      <div *ngIf="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      </div>
      
      <div *ngIf="!loading" class="max-h-96 overflow-y-auto">
        <div *ngIf="notifications.length === 0" class="p-6 text-center text-gray-500">
          Aucune notification
        </div>
        
        <div *ngFor="let notification of notifications" 
             class="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
             [class.bg-blue-50]="!notification.read"
             (click)="handleNotificationClick(notification)">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      [ngClass]="getTypeClass(notification.type)">
                  {{getTypeLabel(notification.type)}}
                </span>
                <div *ngIf="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <p class="text-sm text-gray-900 mt-1" [class.font-semibold]="!notification.read">
                {{notification.message}}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{formatDate(notification.createdAt)}}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NotificationPanelComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  loading = false;
  unreadCount = 0;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
    this.subscribeToNewNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private subscribeToNewNotifications(): void {
    const notificationSub = this.webSocketService.notifications$.subscribe(notification => {
      if (notification) {
        this.notifications.unshift(notification);
        this.unreadCount++;
      }
    });
    
    this.subscriptions.push(notificationSub);
  }

  loadNotifications(): void {
    this.loading = true;
    const notificationSub = this.notificationService.getServerNotifications(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.notifications = response.content || [];
        this.totalPages = response.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
    
    this.subscriptions.push(notificationSub);
  }

  private loadUnreadCount(): void {
    const countSub = this.notificationService.getServerUnreadCount().subscribe({
      next: (response) => {
        this.unreadCount = response.count || 0;
      },
      error: (error) => console.error('Error loading unread count:', error)
    });
    
    this.subscriptions.push(countSub);
  }

  handleNotificationClick(notification: any): void {
    if (!notification.read) {
      this.markAsRead(notification);
    } else if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  markAsRead(notification: any): void {
    const markSub = this.notificationService.markServerNotificationAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        if (notification.link) {
          this.router.navigate([notification.link]);
        }
      },
      error: (error) => console.error('Error marking notification as read:', error)
    });
    
    this.subscriptions.push(markSub);
  }

  markAllAsRead(): void {
    const markAllSub = this.notificationService.markAllServerNotificationsAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      },
      error: (error) => console.error('Error marking all notifications as read:', error)
    });
    
    this.subscriptions.push(markAllSub);
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'NEW_AGREEMENT_CREATED': return 'bg-blue-100 text-blue-800';
      case 'AGREEMENT_VALIDATED': return 'bg-green-100 text-green-800';
      case 'AGREEMENT_APPROVED': return 'bg-green-100 text-green-800';
      case 'AGREEMENT_REJECTED': return 'bg-red-100 text-red-800';
      case 'AGREEMENT_ACTION_REQUIRED': return 'bg-yellow-100 text-yellow-800';
      case 'NEW_APPLICATION': return 'bg-purple-100 text-purple-800';
      case 'APPLICATION_UPDATE': return 'bg-indigo-100 text-indigo-800';
      case 'MESSAGE_RECEIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'NEW_AGREEMENT_CREATED': return 'Convention';
      case 'AGREEMENT_VALIDATED': return 'Validée';
      case 'AGREEMENT_APPROVED': return 'Approuvée';
      case 'AGREEMENT_REJECTED': return 'Rejetée';
      case 'AGREEMENT_ACTION_REQUIRED': return 'Action requise';
      case 'NEW_APPLICATION': return 'Candidature';
      case 'APPLICATION_UPDATE': return 'Mise à jour';
      case 'MESSAGE_RECEIVED': return 'Message';
      default: return 'Notification';
    }
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