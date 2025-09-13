package com.richardmogou.dto;

import com.richardmogou.entity.enums.InternshipOfferStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class InternshipOfferStatusUpdateRequest {

    @NotNull(message = "Status cannot be null")
    private InternshipOfferStatus status;
}