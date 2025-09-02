package com.richardmogou.controller;

import com.richardmogou.dto.NotificationResponse;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
    private final NotificationService notificationService;

    /**
     * GET /api/notifications/me : Get notifications for the current user.
     * Requires authentication.
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getNotificationsForCurrentUser(
            @PageableDefault(size = 15, sort = "createdAt,desc") Pageable pageable) {
        log.info("Received request to get notifications for current user");
        try {
            Page<NotificationResponse> responsePage = notificationService.getNotificationsForCurrentUser(pageable);
            return ResponseEntity.ok(responsePage);
        } catch (IllegalStateException e) {
             log.warn("Fetching notifications failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error fetching notifications for current user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching notifications.");
        }
    }

     /**
     * GET /api/notifications/me/unread-count : Get count of unread notifications for the current user.
     * Requires authentication.
     */
    @GetMapping("/me/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUnreadNotificationCount() {
        log.debug("Received request for unread notification count");
         try {
            long count = notificationService.countUnreadNotificationsForCurrentUser();
            // Return count in a simple JSON object
            return ResponseEntity.ok(Map.of("unreadCount", count));
        } catch (IllegalStateException e) {
             log.warn("Fetching unread count failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error fetching unread notification count", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching unread count.");
        }
    }


    /**
     * PUT /api/notifications/{notificationId}/read : Mark a specific notification as read.
     * Requires authentication.
     */
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long notificationId) {
        log.info("Received request to mark notification ID {} as read", notificationId);
        try {
            NotificationResponse response = notificationService.markNotificationAsRead(notificationId);
            return ResponseEntity.ok(response); // Return updated notification
        } catch (ResourceNotFoundException e) {
            log.warn("Mark as read failed, notification not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
            log.warn("Unauthorized attempt to mark notification {} as read: {}", notificationId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Mark as read failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error marking notification {} as read", notificationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while marking notification as read.");
        }
    }

    /**
     * PUT /api/notifications/me/read-all : Mark all unread notifications for the current user as read.
     * Requires authentication.
     */
    @PutMapping("/me/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAllNotificationsAsRead() {
        log.info("Received request to mark all notifications as read for current user");
         try {
            int count = notificationService.markAllNotificationsAsReadForCurrentUser();
            // Return count of updated notifications in a simple JSON object
            return ResponseEntity.ok(Map.of("updatedCount", count));
        } catch (IllegalStateException e) {
             log.warn("Mark all as read failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error marking all notifications as read", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while marking all notifications as read.");
        }
    }
}