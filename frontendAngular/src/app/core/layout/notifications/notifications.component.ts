import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService} from '../../../services/notification.service';
import { Notification, NotificationType} from '../../../models/notification.model';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative">
      <!-- Notification Bell -->
      <button (click)="toggleNotifications()" class="relative z-[500] text-primary-300 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        <!-- Badge for unread count -->
        <span *ngIf="unreadCount > 0" 
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>
      
      <!-- Dropdown for Notifications -->
      <div *ngIf="showNotifications" 
           class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center px-4 py-2 border-b">
          <h3 class="font-medium text-gray-700">Notifications</h3>
          <button *ngIf="notifications.length > 0" 
                  (click)="markAllAsRead()" 
                  class="text-xs text-primary-600 hover:text-primary-800">
            Mark all as read
          </button>
        </div>
        
        <ng-container *ngIf="notifications.length > 0; else noNotifications">
          <div *ngFor="let notification of notifications" 
               [ngClass]="{'bg-primary-50': notification.type === NotificationType.SYSTEM}"
               class="border-b last:border-b-0 border-primary-500">
            <div
               (click)="handleNotificationClick(notification)"
               class="block px-4 py-3 hover:bg-gray-50">
              <div class="flex justify-between">
                <p class="text-sm font-medium text-gray-900">{{ getNotificationTypeText(notification.type) }}</p>
                <button (click)="handleNotificationClick(notification)" class="text-xs text-red-500 hover:text-red-700">×</button>
              </div>
              <p class="mt-1 text-sm text-gray-700">{{ notification.message }}</p>
            </div>
          </div>
        </ng-container>
        
        <ng-template #noNotifications>
          <div class="px-4 py-6 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input() unreadCount = 0;
  
  notifications: Notification[] = [];
  showNotifications = false;
  NotificationType = NotificationType; // Expose enum to template
  
  private destroy$ = new Subject<void>();
  private currentPage = 0;
  private pageSize = 15;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    
    // Load notifications if showing the dropdown and none are loaded yet
    if (this.showNotifications && this.notifications.length === 0) {
      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    try {
      this.notificationService.getServerNotifications()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.notifications = response.content || response || [];
            this.updateUnreadCount();
          },
          error: (error: any) => {
            console.error('Erreur lors du chargement des notifications:', error);
            this.notifications = [];
            this.unreadCount = 0;
          }
        });
    } catch (error) {
      console.error('Erreur dans loadNotifications:', error);
      this.notifications = [];
      this.unreadCount = 0;
    }
  }

  markAllAsRead(): void {
    this.unreadCount = 0;
    this.notificationService.markAllServerNotificationsAsRead().subscribe({
      next: () => {
        this.notifications = [];
        this.unreadCount = 0;
      },
      error: (error: any) => console.error('Error clearing notifications:', error)
    });
    this.notifications = [];
  }

  handleNotificationClick(notification: Notification): void {
    if (!notification?.id) return;
    
    this.notifications = this.notifications.filter((n: Notification) => n.id !== notification.id);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter((n: Notification) => 
      n.type === NotificationType.APPLICATION_UPDATE || 
      n.type === NotificationType.AGREEMENT_UPDATE
    ).length;
  }


  getNotificationTypeText(type: NotificationType): string {
    switch (type) {
      case NotificationType.APPLICATION_UPDATE:
        return 'Application Update';
      case NotificationType.MESSAGE_RECEIVED:
        return 'New Message';
      case NotificationType.AGREEMENT_UPDATE:
        return 'Agreement Update';
      case NotificationType.SYSTEM:
        return 'System Notification';
      default:
        return 'Notification';
    }
  }
  


}
