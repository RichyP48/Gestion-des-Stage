package com.richardmogou.controller;

import com.richardmogou.dto.MessageResponse;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private static final Logger log = LoggerFactory.getLogger(MessageController.class);
    private final MessageService messageService;

    /**
     * GET /api/messages/conversation : Get historical messages between current user and another user.
     * Requires authentication.
     */
    @GetMapping("/conversation")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMessageHistory(
            @RequestParam Long otherUserId,
            @RequestParam(required = false) Long applicationId,
            @PageableDefault(size = 20, sort = "timestamp,asc") Pageable pageable) {

        log.info("Received request for message history with otherUserId: {}, applicationId: {}", otherUserId, applicationId);
        try {
            Page<MessageResponse> responsePage = messageService.getMessageHistory(otherUserId, applicationId, pageable);
            return ResponseEntity.ok(responsePage);
        } catch (ResourceNotFoundException e) {
            log.warn("Message history retrieval failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
            log.warn("Unauthorized attempt to access message history: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Message history retrieval failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error fetching message history between current user and user ID {}", otherUserId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching message history.");
        }
    }
}