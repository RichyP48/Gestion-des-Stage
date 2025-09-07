package com.richardmogou.service;

import com.richardmogou.dto.NotificationResponse;
import com.richardmogou.entity.Notification;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.NotificationType;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate; // To push notifications via WebSocket

    /**
     * Creates and saves a notification, and pushes it via WebSocket.
     * This method would typically be called by other services.
     */
    @Transactional
    public void createAndSendNotification(User recipient, NotificationType type, String message, String link) {
        if (recipient == null) {
            log.warn("Attempted to create notification for null recipient. Type: {}, Message: {}", type, message);
            return; // Or throw an exception
        }
        log.info("Creating notification for user ID {}: Type={}, Message={}", recipient.getId(), type, message);
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setRead(false);
        // createdAt is set automatically by @CreationTimestamp

        Notification savedNotification = notificationRepository.save(notification);

        // Push notification via WebSocket to the specific user's queue
        NotificationResponse responseDto = NotificationResponse.fromEntity(savedNotification);
        String destination = "/queue/notifications"; // User-specific notification queue
        messagingTemplate.convertAndSendToUser(
                recipient.getId().toString(), // User ID needs to be string for STOMP user destination
                destination,
                responseDto
        );
        log.info("Notification ID {} pushed to user ID {} via WebSocket destination {}", savedNotification.getId(), recipient.getId(), destination);
    }


    /**
     * Retrieves notifications for the currently logged-in user.
     */
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsForCurrentUser(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        log.debug("Fetching notifications for user ID: {}", currentUser.getId());
        
        // Apply default sorting if no sort is specified
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        
        Page<Notification> notificationPage = notificationRepository.findByRecipientOrderByCreatedAtDesc(currentUser, pageable);
        return notificationPage.map(NotificationResponse::fromEntity);
    }

    /**
     * Marks a specific notification as read.
     * Ensures the notification belongs to the current user.
     */
    @Transactional
    public NotificationResponse markNotificationAsRead(Long notificationId) {
        User currentUser = userService.getCurrentUser();
        log.info("Attempting to mark notification ID {} as read for user ID {}", notificationId, currentUser.getId());

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        // Authorization check
        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            log.warn("Unauthorized attempt by user ID {} to mark notification ID {} as read.", currentUser.getId(), notificationId);
            throw new UnauthorizedAccessException("User is not authorized to mark this notification as read.");
        }

        if (!notification.isRead()) {
            notification.setRead(true);
            Notification updatedNotification = notificationRepository.save(notification);
            log.info("Notification ID {} marked as read for user ID {}", notificationId, currentUser.getId());
            return NotificationResponse.fromEntity(updatedNotification);
        } else {
             log.debug("Notification ID {} was already marked as read for user ID {}", notificationId, currentUser.getId());
             return NotificationResponse.fromEntity(notification); // Return current state
        }
    }

    /**
     * Marks all unread notifications for the current user as read.
     * Returns the number of notifications marked as read.
     */
    @Transactional
    public int markAllNotificationsAsReadForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        log.info("Attempting to mark all notifications as read for user ID {}", currentUser.getId());
        int updatedCount = notificationRepository.markAllAsReadForRecipient(currentUser);
        log.info("Marked {} notifications as read for user ID {}", updatedCount, currentUser.getId());
        return updatedCount;
    }

     /**
     * Counts unread notifications for the current user.
     */
     @Transactional(readOnly = true)
     public long countUnreadNotificationsForCurrentUser() {
         User currentUser = userService.getCurrentUser();
         return notificationRepository.countByRecipientAndIsReadFalse(currentUser);
     }

}