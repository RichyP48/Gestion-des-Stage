import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { WebSocketService } from './websocket.service';
import { ChatMessage } from './app/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {}

  /**
   * Get message history between current user and another user
   * @param otherUserId ID of the other user
   * @param applicationId Optional application ID to scope the conversation
   * @param page Page number
   * @param size Page size
   */
  getMessageHistory(otherUserId: number, applicationId?: number, page = 0, size = 20): Observable<any> {
    let params = new HttpParams()
      .set('otherUserId', otherUserId.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'timestamp,asc');
    
    if (applicationId) {
      params = params.set('applicationId', applicationId.toString());
    }
    
    return this.apiService.get<any>('/messages/conversation', params);
  }

  /**
   * Send a message to another user
   * @param message Message to send
   */
  sendMessage(message: ChatMessage): void {
    this.webSocketService.sendMessage(message);
  }

  /**
   * Get messages from WebSocket
   * @returns Observable of chat messages
   */
  getMessages(): Observable<ChatMessage> {
    return this.webSocketService.messages$;
  }

  /**
   * Connect to the WebSocket for real-time messaging
   */
  connectToWebSocket(): void {
    this.webSocketService.connect();
  }

  /**
   * Disconnect from the WebSocket
   */
  disconnectFromWebSocket(): void {
    this.webSocketService.disconnect();
  }
}
