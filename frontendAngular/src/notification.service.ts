import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { WebSocketService } from './websocket.service';
import { UnreadCountResponse } from './app/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {
    // Listen for real-time notifications from WebSocket
    this.webSocketService.notifications$.subscribe(notification => {
      // Notification handling logic can be added here
      // For example, showing a toast or updating a notification badge
      console.log('New notification received:', notification);
    });
  }

  /**
   * Get user's notifications
   * @param page Page number
   * @param size Page size
   */
  getNotifications(page = 0, size = 15): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');
    
    return this.apiService.get<any>('/notifications/me', params);
  }

  /**
   * Get count of unread notifications
   */
  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.apiService.get<UnreadCountResponse>('/notifications/me/unread-count');
  }

  /**
   * Mark a notification as read
   * @param notificationId ID of the notification to mark as read
   */
  markAsRead(notificationId: number): Observable<Notification> {
    return this.apiService.put<Notification>(`/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<{ updatedCount: number }> {
    return this.apiService.put<{ updatedCount: number }>('/notifications/me/read-all');
  }
}
