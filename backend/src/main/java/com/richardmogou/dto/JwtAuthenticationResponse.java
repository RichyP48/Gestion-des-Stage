package com.richardmogou.dto;

import com.richardmogou.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String token;
    private Long userId;
    private String email;
    private Role role;
    // Add other user details you might want to return upon login if needed
    // private String firstName;
    // private String lastName;
}