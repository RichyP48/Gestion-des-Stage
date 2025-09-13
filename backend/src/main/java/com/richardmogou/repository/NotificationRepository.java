package com.richardmogou.repository;

import com.richardmogou.entity.Notification;
import com.richardmogou.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications for a specific recipient, ordered by creation date descending
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);

    // Find unread notifications for a specific recipient
    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient);

    // Count unread notifications for a specific recipient
    long countByRecipientAndIsReadFalse(User recipient);

    // Mark all notifications for a user as read
    @Modifying // Required for update/delete queries
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient = :recipient AND n.isRead = false")
    int markAllAsReadForRecipient(@Param("recipient") User recipient);

}