package com.richardmogou.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String content;
    private String senderId; // User ID of the sender (e.g., "user1")
    private String senderName; // Display name of sender
    private String receiverId; // User ID of the recipient (for private messages)
    private Long applicationId; // Optional: To scope the chat to an application
    private LocalDateTime timestamp;
    private MessageType type; // Enum for different message types if needed (CHAT, JOIN, LEAVE etc.)

    // Optional: Enum for message type
    public enum MessageType {
        CHAT,
        JOIN, // Example: If users join a "room" tied to an application
        LEAVE // Example
    }
}