package com.richardmogou.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AgreementApprovalRequest {

    @NotNull(message = "Approval decision cannot be null")
    private Boolean approved; // true for approved, false for rejected

    private String rejectionReason; // Required only if approved is false
}