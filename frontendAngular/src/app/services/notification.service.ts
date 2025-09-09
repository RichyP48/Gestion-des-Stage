import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

export interface ServerNotification {
  id: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$.asObservable();
  }

  showSuccess(message: string): void {
    this.addNotification('success', message);
  }

  showError(message: string): void {
    this.addNotification('error', message);
  }

  showWarning(message: string): void {
    this.addNotification('warning', message);
  }

  showInfo(message: string): void {
    this.addNotification('info', message);
  }

  private addNotification(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notifications$.value;
    const updatedNotifications = [notification, ...currentNotifications];
    
    this.notifications$.next(updatedNotifications);
    this.updateUnreadCount();

    // Auto-remove success notifications after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 5000);
    }
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notifications$.value.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notifications$.next(notifications);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const notifications = this.notifications$.value.map(n => ({ ...n, read: true }));
    this.notifications$.next(notifications);
    this.updateUnreadCount();
  }

  removeNotification(notificationId: string): void {
    const notifications = this.notifications$.value.filter(n => n.id !== notificationId);
    this.notifications$.next(notifications);
    this.updateUnreadCount();
  }

  clearAll(): void {
    this.notifications$.next([]);
    this.unreadCount$.next(0);
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notifications$.value.filter(n => !n.read).length;
    this.unreadCount$.next(unreadCount);
  }

  // Server notifications methods
  getServerNotifications(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications?page=${page}&size=${size}`);
  }

  getServerUnreadCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/unread-count`);
  }

  markServerNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }

  markAllServerNotificationsAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/mark-all-read`, {});
  }

  deleteServerNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/${notificationId}`);
  }

  // Combined method to load server notifications into local state
  loadServerNotifications(): void {
    this.getServerNotifications().subscribe({
      next: (response) => {
        const serverNotifications = response.content || response;
        const localNotifications: Notification[] = serverNotifications.map((sn: ServerNotification) => ({
          id: sn.id.toString(),
          type: this.mapServerTypeToLocal(sn.type),
          message: sn.message,
          timestamp: new Date(sn.createdAt),
          read: sn.read,
          link: sn.link
        }));
        
        this.notifications$.next(localNotifications);
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error loading server notifications:', error);
      }
    });
  }

  private mapServerTypeToLocal(serverType: string): 'success' | 'error' | 'warning' | 'info' {
    switch (serverType) {
      case 'AGREEMENT_VALIDATED':
      case 'APPLICATION_ACCEPTED':
        return 'success';
      case 'AGREEMENT_REJECTED':
      case 'APPLICATION_REJECTED':
        return 'error';
      case 'AGREEMENT_ACTION_REQUIRED':
        return 'warning';
      default:
        return 'info';
    }
  }
}