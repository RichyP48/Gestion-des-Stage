package com.richardmogou.dto;

import com.richardmogou.entity.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApplicationStatusUpdateRequest {

    @NotNull(message = "Status cannot be null")
    private ApplicationStatus status; // e.g., ACCEPTED, REJECTED

    private String feedback; // Optional feedback from the company
}