package com.richardmogou.dto;

import com.richardmogou.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private boolean isRead;
    private Long senderId;
    private String senderFirstName;
    private String senderLastName;
    private Long receiverId;
    private String receiverFirstName;
    private String receiverLastName;
    private Long relatedApplicationId;

    // Factory method
    public static MessageResponse fromEntity(Message message) {
        if (message == null) {
            return null;
        }
        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .isRead(message.isRead())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderFirstName(message.getSender() != null ? message.getSender().getFirstName() : null)
                .senderLastName(message.getSender() != null ? message.getSender().getLastName() : null)
                .receiverId(message.getReceiver() != null ? message.getReceiver().getId() : null)
                .receiverFirstName(message.getReceiver() != null ? message.getReceiver().getFirstName() : null)
                .receiverLastName(message.getReceiver() != null ? message.getReceiver().getLastName() : null)
                .relatedApplicationId(message.getRelatedApplication() != null ? message.getRelatedApplication().getId() : null)
                .build();
    }
}