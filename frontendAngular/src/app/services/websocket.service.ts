import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChatMessage } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private messageSubject = new Subject<ChatMessage>();
  private notificationSubject = new Subject<any>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  messages$ = this.messageSubject.asObservable();
  notifications$ = this.notificationSubject.asObservable();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {
    console.log('WebSocket service disabled');
  }

  connect(): void {
    console.log('WebSocket connect() called - service disabled');
  }

  disconnect(): void {
    console.log('WebSocket disconnect() called - service disabled');
  }

  sendMessage(chatMessage: ChatMessage): void {
    console.log('WebSocket sendMessage() called - service disabled', chatMessage);
  }
}
