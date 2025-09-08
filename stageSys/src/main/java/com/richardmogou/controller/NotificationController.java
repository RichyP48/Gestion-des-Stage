package com.richardmogou.controller;

import com.richardmogou.entity.Notification;
import com.richardmogou.entity.User;
import com.richardmogou.service.NotificationService;
import com.richardmogou.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<Notification>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        try {
            User currentUser = userService.findByEmail(authentication.getName());
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Notification> notifications = notificationService.getUserNotifications(currentUser, pageable);
            
            log.info("Retrieved {} notifications for user {}", notifications.getTotalElements(), currentUser.getEmail());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error retrieving notifications", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        try {
            User currentUser = userService.findByEmail(authentication.getName());
            long unreadCount = notificationService.getUnreadCount(currentUser);
            
            return ResponseEntity.ok(Map.of("count", unreadCount));
        } catch (Exception e) {
            log.error("Error getting unread count", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {
        
        try {
            User currentUser = userService.findByEmail(authentication.getName());
            notificationService.markAsRead(notificationId, currentUser);
            
            log.info("Notification {} marked as read by user {}", notificationId, currentUser.getEmail());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error marking notification as read", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        try {
            User currentUser = userService.findByEmail(authentication.getName());
            notificationService.markAllAsRead(currentUser);
            
            log.info("All notifications marked as read for user {}", currentUser.getEmail());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error marking all notifications as read", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId,
            Authentication authentication) {
        
        try {
            User currentUser = userService.findByEmail(authentication.getName());
            notificationService.deleteNotification(notificationId, currentUser);
            
            log.info("Notification {} deleted by user {}", notificationId, currentUser.getEmail());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting notification", e);
            return ResponseEntity.badRequest().build();
        }
    }
}