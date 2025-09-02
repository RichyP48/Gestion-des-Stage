package com.richardmogou.controller;

import com.richardmogou.dto.AdminUserCreateRequest;
import com.richardmogou.dto.AdminUserUpdateRequest;
import com.richardmogou.dto.UserResponse;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.service.AdminUserService;
import jakarta.validation.Valid;
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

@RestController
@RequestMapping("/api/admin/users") // Base path for admin user operations
@PreAuthorize("hasRole('ADMIN')") // Secure all endpoints in this controller for ADMIN role
@RequiredArgsConstructor
public class AdminUserController {

    private static final Logger log = LoggerFactory.getLogger(AdminUserController.class);
    private final AdminUserService adminUserService;

    /**
     * GET /api/admin/users : List all users (paginated).
     */
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(size = 20, sort = "lastName,asc") Pageable pageable) {
        log.info("Admin request to list all users");
        Page<UserResponse> userPage = adminUserService.getAllUsers(pageable);
        return ResponseEntity.ok(userPage);
    }

     /**
     * GET /api/admin/users/{userId} : Get details of a specific user.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        log.info("Admin request to get user ID: {}", userId);
        try {
            UserResponse response = adminUserService.getUserById(userId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Admin user get failed, user not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error fetching user ID {} by admin", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the user.");
        }
    }


    /**
     * POST /api/admin/users : Create a new user.
     */
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUserCreateRequest request) {
        log.info("Admin request to create user with email: {}", request.getEmail());
        try {
            UserResponse response = adminUserService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (BadRequestException e) {
            log.warn("Admin user creation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error creating user by admin for email {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the user.");
        }
    }

    /**
     * PUT /api/admin/users/{userId} : Update an existing user.
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @Valid @RequestBody AdminUserUpdateRequest request) {
        log.info("Admin request to update user ID: {}", userId);
         try {
            UserResponse response = adminUserService.updateUser(userId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Admin user update failed, user not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
             log.warn("Admin user update failed: {}", e.getMessage());
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error updating user ID {} by admin", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the user.");
        }
    }

    /**
     * DELETE /api/admin/users/{userId} : Delete (or disable) a user.
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        log.info("Admin request to delete/disable user ID: {}", userId);
         try {
            adminUserService.deleteUser(userId);
            // Return No Content, whether hard deleted or disabled
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            log.warn("Admin user delete/disable failed, user not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        // Catch specific exceptions if delete constraints are added
        catch (Exception e) {
            log.error("Error deleting/disabling user ID {} by admin", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting/disabling the user.");
        }
    }
}