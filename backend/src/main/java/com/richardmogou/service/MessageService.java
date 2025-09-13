package com.richardmogou.service;

import com.richardmogou.dto.MessageResponse;
import com.richardmogou.entity.Application;
import com.richardmogou.entity.Message;
import com.richardmogou.entity.User;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.repository.ApplicationRepository;
import com.richardmogou.repository.MessageRepository;
import com.richardmogou.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private static final Logger log = LoggerFactory.getLogger(MessageService.class);
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final UserService userService; // To get current user

    /**
     * Retrieves historical messages between the current user and another user,
     * optionally filtered by application ID.
     */
    @Transactional(readOnly = true)
    public Page<MessageResponse> getMessageHistory(Long otherUserId, Long applicationId, Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        log.debug("Fetching message history for user ID {} with other user ID {}, application ID {}",
                currentUser.getId(), otherUserId, applicationId);

        // Apply default sorting if no sort is specified
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                Sort.by(Sort.Direction.ASC, "timestamp"));
        }

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", otherUserId));

        Page<Message> messagePage;

        if (applicationId != null) {
            // Fetch messages scoped to an application
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

            // Authorization check: Ensure current user is part of this application's context
            // (either the student or the company contact)
            boolean isStudent = currentUser.getId().equals(application.getStudent().getId());
            boolean isCompanyContact = currentUser.getId().equals(application.getInternshipOffer().getCompany().getPrimaryContactUser().getId());

            if (!isStudent && !isCompanyContact) {
                 log.warn("User ID {} attempted to access messages for application ID {} without authorization.", currentUser.getId(), applicationId);
                 throw new UnauthorizedAccessException("User is not authorized to view messages for this application.");
            }
            // Ensure the otherUser is also part of the application context
             boolean isOtherUserStudent = otherUser.getId().equals(application.getStudent().getId());
             boolean isOtherUserCompanyContact = otherUser.getId().equals(application.getInternshipOffer().getCompany().getPrimaryContactUser().getId());
             if (!isOtherUserStudent && !isOtherUserCompanyContact) {
                  log.warn("Requested otherUser ID {} is not part of the application ID {} context.", otherUserId, applicationId);
                  // Or maybe just return empty results? Throwing seems safer.
                  throw new ResourceNotFoundException("User", "id", otherUserId + " (not associated with application " + applicationId + ")");
             }


            messagePage = messageRepository.findConversationForApplication(currentUser, otherUser, application, pageable);
        } else {
            // Fetch general messages between the two users (not tied to a specific application)
            // We might need additional authorization here depending on requirements (e.g., are general chats allowed?)
            // For now, assume any authenticated user can fetch direct messages with another user.
            messagePage = messageRepository.findConversation(currentUser, otherUser, pageable);
        }

        return messagePage.map(MessageResponse::fromEntity);
    }

    // Message saving logic could also be moved here from ChatController if desired
}