package com.richardmogou.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AgreementValidationRequest {

    @NotNull(message = "Validation decision cannot be null")
    private Boolean validated; // true for validated, false for rejected

    private String rejectionReason; // Required only if validated is false
}