package com.richardmogou.repository;

import com.richardmogou.entity.Application;
import com.richardmogou.entity.Message;
import com.richardmogou.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Find messages between two users, ordered by timestamp (for chat history)
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp ASC")
    Page<Message> findConversation(@Param("user1") User user1, @Param("user2") User user2, Pageable pageable);

    // Find messages between two users related to a specific application
    @Query("SELECT m FROM Message m WHERE m.relatedApplication = :application AND ((m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1)) ORDER BY m.timestamp ASC")
    Page<Message> findConversationForApplication(@Param("user1") User user1, @Param("user2") User user2, @Param("application") Application application, Pageable pageable);

    // Find unread messages for a specific receiver
    List<Message> findByReceiverAndIsReadFalse(User receiver);

    // Count unread messages for a specific receiver
    long countByReceiverAndIsReadFalse(User receiver);
}