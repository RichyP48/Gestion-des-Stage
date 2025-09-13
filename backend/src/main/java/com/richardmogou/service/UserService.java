package com.richardmogou.service;

import com.richardmogou.dto.UserProfileUpdateRequest;
import com.richardmogou.dto.UserResponse;
import com.richardmogou.entity.User;
import com.richardmogou.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    /**
     * Gets the currently authenticated user from the Security Context.
     *
     * @return The User entity.
     * @throws UsernameNotFoundException if the user is not found (should not happen if authenticated).
     * @throws IllegalStateException if the authentication principal is not a UserDetails instance.
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found in security context.");
        }

        String username; // This will be the email
        Object principal = authentication.getPrincipal();

        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
             username = (String) principal; // Sometimes it might just be the username string
        }
         else {
            log.error("Unexpected principal type: {}", principal.getClass().getName());
            throw new IllegalStateException("Unexpected principal type in security context.");
        }


        return userRepository.findByEmail(username)
                .orElseThrow(() -> {
                     log.error("Authenticated user '{}' not found in database.", username);
                     return new UsernameNotFoundException("User not found: " + username);
                });
    }

    /**
     * Gets the profile details of the currently logged-in user.
     *
     * @return UserResponse DTO.
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile() {
        User currentUser = getCurrentUser();
        log.info("Fetching profile for user ID: {}", currentUser.getId());
        return UserResponse.fromEntity(currentUser);
    }

    /**
     * Updates the profile details of the currently logged-in user.
     *
     * @param request DTO containing updated profile information.
     * @return Updated UserResponse DTO.
     */
    @Transactional
    public UserResponse updateCurrentUserProfile(UserProfileUpdateRequest request) {
        User currentUser = getCurrentUser();
        log.info("Updating profile for user ID: {}", currentUser.getId());

        currentUser.setFirstName(request.getFirstName());
        currentUser.setLastName(request.getLastName());
        currentUser.setPhoneNumber(request.getPhoneNumber());
        // Note: email, password, role changes are handled elsewhere (admin or specific endpoints)

        User updatedUser = userRepository.save(currentUser);
        log.info("Profile updated successfully for user ID: {}", updatedUser.getId());
        return UserResponse.fromEntity(updatedUser);
    }

    // Admin-specific user management methods will go into a separate AdminUserService
    // or stay here and be secured using @PreAuthorize or similar.
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}