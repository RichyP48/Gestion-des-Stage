package com.richardmogou.controller;

import com.richardmogou.dto.UserProfileUpdateRequest;
import com.richardmogou.dto.UserResponse;
import com.richardmogou.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    /**
     * GET /api/users/me : Get current user's profile
     * Requires authentication.
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()") // Ensure user is authenticated
    public ResponseEntity<?> getCurrentUserProfile() {
        log.info("Received request to get current user profile");
        try {
            UserResponse userResponse = userService.getCurrentUserProfile();
            return ResponseEntity.ok(userResponse);
        } catch (IllegalStateException e) {
             // This might happen if the token is valid but user somehow doesn't exist or context is wrong
            log.warn("Attempted to get profile for non-authenticated or invalid user state: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
         catch (Exception e) {
            log.error("Error fetching current user profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the user profile.");
        }
    }

    /**
     * PUT /api/users/me : Update current user's profile
     * Requires authentication.
     */
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateCurrentUserProfile(@Valid @RequestBody UserProfileUpdateRequest request) {
         log.info("Received request to update current user profile");
         try {
            UserResponse updatedUser = userService.updateCurrentUserProfile(request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalStateException e) {
            log.warn("Attempted to update profile for non-authenticated or invalid user state: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error updating current user profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the profile.");
        }
    }

    // Admin user management endpoints (GET /api/admin/users, POST /api/admin/users, etc.)
    // will be in a separate AdminController or secured here with @PreAuthorize("hasRole('ADMIN')")
}