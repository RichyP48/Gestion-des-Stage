package com.richardmogou.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserProfileUpdateRequest {

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    // Email change is usually restricted or requires verification, not included here.
    // Password change should be a separate endpoint.
    // Role change is an admin function.

    private String phoneNumber; // Optional
}