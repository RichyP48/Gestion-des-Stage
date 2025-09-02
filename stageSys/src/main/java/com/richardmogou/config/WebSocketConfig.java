package com.richardmogou.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Enables WebSocket message handling, backed by a message broker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Configure a simple message broker for destinations prefixed with "/topic" and "/queue"
        // /topic is typically for broadcast messages (e.g., public chat rooms, notifications to all admins)
        // /queue is typically for user-specific messages (e.g., private chats, specific user notifications)
        config.enableSimpleBroker("/topic", "/queue");

        // Configure the prefix for messages bound for methods annotated with @MessageMapping
        // e.g., a message sent to "/app/chat" will be routed to a @MessageMapping("/chat") method
        config.setApplicationDestinationPrefixes("/app");

        // Configure the prefix for user-specific destinations (used with SimpMessagingTemplate.convertAndSendToUser)
        // Default is "/user/", so messages sent to a user 'alice' at destination '/queue/messages'
        // will actually be sent to '/user/alice/queue/messages'
        // config.setUserDestinationPrefix("/user"); // Default is usually fine
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the "/ws" endpoint, enabling SockJS fallback options so that web browsers
        // that don't support WebSocket natively can still connect.
        // Allow requests from the frontend origin.
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200", "http://127.0.0.1:4200") // Match CORS config
                .withSockJS(); // Enable SockJS fallback
    }

    // TODO: Add WebSocket Security Configuration (e.g., using Spring Security)
    // This is crucial to ensure only authenticated users can connect and subscribe/publish messages.
    // Typically involves intercepting CONNECT messages and validating JWT tokens.
}