package com.richardmogou.dto;

import com.richardmogou.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

// Allows admin to update more fields than regular user profile update
@Data
@NoArgsConstructor
public class AdminUserUpdateRequest {

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email; // Allow email change by admin? Requires careful consideration of uniqueness.

    @NotNull(message = "Role cannot be null")
    private Role role;

    @NotNull(message = "Enabled status cannot be null")
    private Boolean enabled; // Admin can enable/disable accounts

    private String phoneNumber; // Optional

    // Password reset should likely be a separate endpoint for security.
    // private String password;
}