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
      <button (click)="toggleNotifications()" class="relative text-primary-600 focus:outline-none">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span *ngIf="unreadCount > 0" 
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>
      
      <div *ngIf="showNotifications" 
           class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center px-4 py-2 border-b">
          <h3 class="font-medium text-gray-700">Notifications</h3>
          <button *ngIf="unreadCount > 0" (click)="markAllAsRead()" class="text-xs text-primary-600">
            Tout marquer
          </button>
        </div>
        
        <div *ngIf="notifications.length === 0" class="px-4 py-6 text-center text-gray-500">
          Aucune notification
        </div>
        
        <div *ngFor="let notification of notifications" 
             class="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
             [class.bg-blue-50]="!notification.read"
             (click)="handleNotificationClick(notification)">
          <p class="text-sm text-gray-900">{{ notification.message }}</p>
        </div>
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
  notifications: any[] = [];
  showNotifications = false;
  unreadCount = 0;
  private subscriptions: any[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) this.loadNotifications();
  }

  loadNotifications(): void {
    const sub = this.notificationService.getServerNotifications().subscribe({
      next: (response: any) => {
        this.notifications = response.content || response || [];
        this.unreadCount = this.notifications.filter(n => !n.read).length;
      },
      error: () => {
        this.notifications = [];
        this.unreadCount = 0;
      }
    });
    this.subscriptions.push(sub);
  }

  markAllAsRead(): void {
    const sub = this.notificationService.markAllServerNotificationsAsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
      this.unreadCount = 0;
    });
    this.subscriptions.push(sub);
  }

  handleNotificationClick(notification: any): void {
    if (!notification.read) {
      const sub = this.notificationService.markServerNotificationAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      });
      this.subscriptions.push(sub);
    }
    
  }
}
