export interface ChatMessage {
  id?: number;
  content: string;
  senderId: string;
  senderName?: string;
  receiverId: string;
  applicationId?: number;
  timestamp?: string;
  type?: string;
}

export interface MessageHistoryRequest {
  otherUserId: number;
  applicationId?: number;
}
