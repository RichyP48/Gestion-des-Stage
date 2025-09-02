package com.richardmogou.dto;

import com.richardmogou.entity.InternshipOffer;
import com.richardmogou.entity.enums.InternshipOfferStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternshipOfferResponse {
    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private String domain;
    private String location;
    private String duration;
    private LocalDate startDate;
    private InternshipOfferStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Include basic company info
    private Long companyId;
    private String companyName;
    private String companyWebsite; // Optional, but useful for students

    // Factory method to convert InternshipOffer entity to DTO
    public static InternshipOfferResponse fromEntity(InternshipOffer offer) {
        if (offer == null) {
            return null;
        }
        return InternshipOfferResponse.builder()
                .id(offer.getId())
                .title(offer.getTitle())
                .description(offer.getDescription())
                .requiredSkills(offer.getRequiredSkills())
                .domain(offer.getDomain())
                .location(offer.getLocation())
                .duration(offer.getDuration())
                .startDate(offer.getStartDate())
                .status(offer.getStatus())
                .createdAt(offer.getCreatedAt())
                .updatedAt(offer.getUpdatedAt())
                .companyId(offer.getCompany() != null ? offer.getCompany().getId() : null)
                .companyName(offer.getCompany() != null ? offer.getCompany().getName() : null)
                .companyWebsite(offer.getCompany() != null ? offer.getCompany().getWebsite() : null)
                .build();
    }
}