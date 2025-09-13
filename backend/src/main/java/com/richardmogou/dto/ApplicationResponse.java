package com.richardmogou.dto;

import com.richardmogou.entity.Application;
import com.richardmogou.entity.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private ApplicationStatus status;
    private LocalDateTime applicationDate;
    private String coverLetter;
    private String cvPath; // Relative path or identifier, not full system path
    private String companyFeedback;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Include relevant related info
    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private String studentEmail;

    private Long offerId;
    private String offerTitle;

    private Long companyId;
    private String companyName;

    // Factory method to convert Application entity to DTO
    public static ApplicationResponse fromEntity(Application application) {
        if (application == null) {
            return null;
        }
        return ApplicationResponse.builder()
                .id(application.getId())
                .status(application.getStatus())
                .applicationDate(application.getApplicationDate())
                .coverLetter(application.getCoverLetter())
                .cvPath(application.getCvPath()) // Consider generating a download URL here instead
                .companyFeedback(application.getCompanyFeedback())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())
                .studentId(application.getStudent() != null ? application.getStudent().getId() : null)
                .studentFirstName(application.getStudent() != null ? application.getStudent().getFirstName() : null)
                .studentLastName(application.getStudent() != null ? application.getStudent().getLastName() : null)
                .studentEmail(application.getStudent() != null ? application.getStudent().getEmail() : null)
                .offerId(application.getInternshipOffer() != null ? application.getInternshipOffer().getId() : null)
                .offerTitle(application.getInternshipOffer() != null ? application.getInternshipOffer().getTitle() : null)
                .companyId(application.getInternshipOffer() != null && application.getInternshipOffer().getCompany() != null
                        ? application.getInternshipOffer().getCompany().getId() : null)
                .companyName(application.getInternshipOffer() != null && application.getInternshipOffer().getCompany() != null
                        ? application.getInternshipOffer().getCompany().getName() : null)
                .build();
    }
}