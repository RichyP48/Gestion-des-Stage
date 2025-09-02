package com.richardmogou.controller;

import com.richardmogou.dto.ChatMessage;
import com.richardmogou.entity.Application;
import com.richardmogou.entity.Message;
import com.richardmogou.entity.User;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.repository.ApplicationRepository;
import com.richardmogou.repository.MessageRepository;
import com.richardmogou.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository; // For saving messages
    private final UserRepository userRepository; // To find users
    private final ApplicationRepository applicationRepository; // To link messages to applications

    /**
     * Handles incoming chat messages sent to "/app/chat.sendMessage".
     * Saves the message and forwards it to the recipient's private queue.
     *
     * @param chatMessage The incoming message payload.
     */
    @MessageMapping("/chat.sendMessage") // Destination clients send messages to
    @Transactional // Ensure message saving and sending are atomic (or handle potential failures)
    public void sendMessage(@Payload ChatMessage chatMessage) {
        log.info("Received chat message from {} to {}: {}", chatMessage.getSenderId(), chatMessage.getReceiverId(), chatMessage.getContent());

        // --- Validation and Entity Retrieval ---
        User sender = userRepository.findById(Long.parseLong(chatMessage.getSenderId())) // Assuming senderId is Long user ID
                .orElseThrow(() -> {
                    log.error("Sender user not found with ID: {}", chatMessage.getSenderId());
                    // How to handle errors in WebSocket? Sending error back might be complex. Log and potentially skip.
                    return new ResourceNotFoundException("User", "id", chatMessage.getSenderId());
                });

        User receiver = userRepository.findById(Long.parseLong(chatMessage.getReceiverId()))
                 .orElseThrow(() -> {
                    log.error("Receiver user not found with ID: {}", chatMessage.getReceiverId());
                    return new ResourceNotFoundException("User", "id", chatMessage.getReceiverId());
                });

        Application relatedApplication = null;
        if (chatMessage.getApplicationId() != null) {
            relatedApplication = applicationRepository.findById(chatMessage.getApplicationId())
                    .orElse(null); // Be lenient if application ID is optional or invalid? Or throw?
            if (relatedApplication == null) {
                 log.warn("Related application not found with ID: {}, message will not be linked.", chatMessage.getApplicationId());
            }
            // TODO: Add authorization check: Does the sender/receiver belong to this application context?
        }

        // --- Save Message to Database ---
        Message messageEntity = new Message();
        messageEntity.setSender(sender);
        messageEntity.setReceiver(receiver);
        messageEntity.setContent(chatMessage.getContent());
        messageEntity.setTimestamp(LocalDateTime.now()); // Use server time
        messageEntity.setRead(false); // Mark as unread initially
        messageEntity.setRelatedApplication(relatedApplication);

        try {
            messageRepository.save(messageEntity);
            log.debug("Message saved to database with ID: {}", messageEntity.getId());
        } catch (Exception e) {
            log.error("Failed to save chat message from {} to {}: {}", sender.getId(), receiver.getId(), e.getMessage(), e);
            // Decide how to proceed. Maybe don't send if save fails?
            return; // Exit if saving failed
        }

        // --- Send Message to Recipient via WebSocket ---
        // The destination is /user/{userId}/queue/private
        // SimpMessagingTemplate handles the /user prefix automatically based on the principal/session
        // We use the receiver's ID (as string) as the "user" part here.
        // The client needs to subscribe to "/user/queue/private"
        chatMessage.setTimestamp(messageEntity.getTimestamp()); // Ensure DTO has server timestamp
        chatMessage.setSenderName(sender.getFirstName()); // Add sender name for display

        String destination = "/queue/private"; // User-specific queue
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverId(), // The user ID (principal name expected by Spring)
                destination, // The user-specific destination part
                chatMessage // The payload
        );

        log.info("Message forwarded to user {} at destination {}", chatMessage.getReceiverId(), destination);

        // Optional: Send confirmation back to sender?
        // messagingTemplate.convertAndSendToUser(chatMessage.getSenderId(), "/queue/sent", chatMessage);
    }

    // TODO: Implement @MessageMapping("/chat.addUser") if needed for presence management
    // This would typically involve adding user to session attributes and broadcasting presence.
    // Requires Principal object injection in method signature.
    // @MessageMapping("/chat.addUser")
    // @SendTo("/topic/public") // Example: Broadcast join message
    // public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor, Principal principal) {
    //     // Add username in web socket session
    //     headerAccessor.getSessionAttributes().put("username", principal.getName()); // Or use user ID
    //     log.info("User connected: {}", principal.getName());
    //     chatMessage.setSenderName(principal.getName()); // Set sender name
    //     chatMessage.setType(ChatMessage.MessageType.JOIN);
    //     return chatMessage;
    // }

}