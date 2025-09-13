package com.richardmogou.dto;

import com.richardmogou.entity.Notification;
import com.richardmogou.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String message;
    private NotificationType type;
    private boolean isRead;
    private String link; // Optional link to related resource
    private LocalDateTime createdAt;
    private Long recipientId; // Keep recipient ID for reference

    // Factory method
    public static NotificationResponse fromEntity(Notification notification) {
        if (notification == null) {
            return null;
        }
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .link(notification.getLink())
                .createdAt(notification.getCreatedAt())
                .recipientId(notification.getRecipient() != null ? notification.getRecipient().getId() : null)
                .build();
    }
}