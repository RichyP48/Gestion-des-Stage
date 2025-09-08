import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationMessage {
  id: number;
  type: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private connected = false;
  private notificationsSubject = new BehaviorSubject<NotificationMessage | null>(null);
  
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  public connect(userId: string): void {
    if (this.connected || this.socket) {
      return;
    }

    try {
      // Use native WebSocket instead of SockJS
      const wsUrl = `ws://localhost:8080/ws?userId=${userId}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.connected = true;
      };

      this.socket.onmessage = (event) => {
        try {
          const notification: NotificationMessage = JSON.parse(event.data);
          this.notificationsSubject.next(notification);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.connected = false;
        this.socket = null;
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public sendMessage(message: any): void {
    if (this.socket && this.connected) {
      this.socket.send(JSON.stringify(message));
    }
  }
}