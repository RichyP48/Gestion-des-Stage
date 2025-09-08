import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3">
      <div *ngFor="let notification of visibleNotifications; let i = index" 
           [ngClass]="getNotificationClass(notification.type)"
           [style.transform]="'translateY(' + (i * 10) + 'px)'"
           [style.z-index]="50 - i"
           class="w-[450px] bg-white shadow-xl rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out animate-slide-in">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg *ngIf="notification.type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg *ngIf="notification.type === 'error'" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg *ngIf="notification.type === 'warning'" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <svg *ngIf="notification.type === 'info'" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">
                {{notification.message}}
              </p>
              <p class="mt-1 text-sm text-gray-500">
                {{notification.timestamp | date:'short'}}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button (click)="removeNotification(notification.id)"
                      class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class NotificationToastComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  visibleNotifications: Notification[] = [];
  private subscription: Subscription = new Subscription();
  private notificationQueue: Notification[] = [];
  private isProcessingQueue = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription.add(
      this.notificationService.getNotifications().subscribe(notifications => {
        const newNotifications = notifications.filter(n => 
          !this.notifications.some(existing => existing.id === n.id)
        );
        
        this.notifications = notifications;
        
        if (newNotifications.length > 0) {
          this.notificationQueue.push(...newNotifications);
          this.processQueue();
        }
      })
    );
  }
  
  private async processQueue() {
    if (this.isProcessingQueue || this.notificationQueue.length === 0) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift()!;
      
      // Limiter à 3 notifications visibles maximum
      if (this.visibleNotifications.length >= 3) {
        this.visibleNotifications.pop();
      }
      
      this.visibleNotifications.unshift(notification);
      
      // Attendre 500ms avant la prochaine notification
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    this.isProcessingQueue = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string) {
    this.visibleNotifications = this.visibleNotifications.filter(n => n.id !== id);
    this.notificationService.removeNotification(id);
  }

  getNotificationClass(type: string): string {
    const baseClass = 'border-l-4 ';
    switch (type) {
      case 'success':
        return baseClass + 'border-green-400 bg-green-50';
      case 'error':
        return baseClass + 'border-red-400 bg-red-50';
      case 'warning':
        return baseClass + 'border-yellow-400 bg-yellow-50';
      case 'info':
        return baseClass + 'border-blue-400 bg-blue-50';
      default:
        return baseClass + 'border-gray-400 bg-gray-50';
    }
  }
}