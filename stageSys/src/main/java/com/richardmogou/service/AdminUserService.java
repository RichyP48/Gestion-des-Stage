package com.richardmogou.service;

import com.richardmogou.dto.AdminUserCreateRequest;
import com.richardmogou.dto.AdminUserUpdateRequest;
import com.richardmogou.dto.UserResponse;
import com.richardmogou.entity.User;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private static final Logger log = LoggerFactory.getLogger(AdminUserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Retrieves a paginated list of all users.
     * TODO: Add filtering capabilities (by role, name, email etc.)
     */
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        log.debug("Admin request to fetch all users");
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.map(UserResponse::fromEntity);
    }

    /**
     * Retrieves details of a specific user by ID.
     */
     @Transactional(readOnly = true)
     public UserResponse getUserById(Long userId) {
         log.debug("Admin request to fetch user ID: {}", userId);
         User user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
         return UserResponse.fromEntity(user);
     }


    /**
     * Creates a new user (typically Faculty or Admin) by an administrator.
     */
    @Transactional
    public UserResponse createUser(AdminUserCreateRequest request) {
        log.info("Admin request to create user with email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Admin user creation failed: Email already exists - {}", request.getEmail());
            throw new BadRequestException("Email address already in use: " + request.getEmail());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash password
        user.setRole(request.getRole());
        user.setEnabled(request.isEnabled());
        user.setPhoneNumber(request.getPhoneNumber());

        User savedUser = userRepository.save(user);
        log.info("Admin successfully created user ID: {}", savedUser.getId());
        return UserResponse.fromEntity(savedUser);
    }

    /**
     * Updates an existing user by an administrator.
     */
    @Transactional
    public UserResponse updateUser(Long userId, AdminUserUpdateRequest request) {
         log.info("Admin request to update user ID: {}", userId);
         User user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

         // Check if email is being changed and if the new email already exists for another user
         if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
              log.warn("Admin user update failed for ID {}: New email {} already exists.", userId, request.getEmail());
              throw new BadRequestException("Email address already in use: " + request.getEmail());
         }

         user.setFirstName(request.getFirstName());
         user.setLastName(request.getLastName());
         user.setEmail(request.getEmail());
         user.setRole(request.getRole());
         user.setEnabled(request.getEnabled());
         user.setPhoneNumber(request.getPhoneNumber());
         // Password is not updated here - use a separate reset mechanism

         User updatedUser = userRepository.save(user);
         log.info("Admin successfully updated user ID: {}", updatedUser.getId());
         return UserResponse.fromEntity(updatedUser);
    }

    /**
     * Deletes a user by an administrator.
     * Consider implications (e.g., associated records). Maybe disable instead?
     */
    @Transactional
    public void deleteUser(Long userId) {
        log.warn("Admin request to DELETE user ID: {}", userId); // Log as WARN due to destructive nature
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // TODO: Add checks for associations before deleting?
        // E.g., prevent deleting a company's primary contact without reassigning?
        // Prevent deleting admin if it's the last one?

        // Option 1: Hard Delete
        // userRepository.delete(user);
        // log.info("Admin successfully DELETED user ID: {}", userId);

        // Option 2: Soft Delete (Disable) - Safer
        if (user.isEnabled()) {
            user.setEnabled(false);
            userRepository.save(user);
            log.info("Admin successfully DISABLED user ID: {}", userId);
        } else {
             log.info("User ID {} was already disabled.", userId);
        }
    }
}