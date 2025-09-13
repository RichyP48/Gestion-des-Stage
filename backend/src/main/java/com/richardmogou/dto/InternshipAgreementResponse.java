package com.richardmogou.dto;

import com.richardmogou.entity.InternshipAgreement;
import com.richardmogou.entity.enums.InternshipAgreementStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternshipAgreementResponse {
    private Long id;
    private InternshipAgreementStatus status;
    private String agreementPdfPath; // Relative path or identifier
    private LocalDateTime facultyValidationDate;
    private LocalDateTime adminApprovalDate;
    private String facultyRejectionReason;
    private String adminRejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Signature fields
    private Boolean signedByStudent;
    private Boolean signedByCompany;
    private Boolean signedByFaculty;
    private LocalDateTime studentSignatureDate;
    private LocalDateTime companySignatureDate;
    private LocalDateTime facultySignatureDate;

    // Related Info
    private Long applicationId;
    private Long studentId;
    private String studentName; // Combine first/last
    private Long offerId;
    private String offerTitle;
    private Long companyId;
    private String companyName;
    private Long facultyValidatorId;
    private String facultyValidatorName;
    private Long adminApproverId;
    private String adminApproverName;


    // Factory method
    public static InternshipAgreementResponse fromEntity(InternshipAgreement agreement) {
        if (agreement == null) {
            return null;
        }
        ApplicationResponse applicationDto = ApplicationResponse.fromEntity(agreement.getApplication()); // Reuse ApplicationResponse logic

        return InternshipAgreementResponse.builder()
                .id(agreement.getId())
                .status(agreement.getStatus())
                .agreementPdfPath(agreement.getAgreementPdfPath()) // Consider generating download URL
                .facultyValidationDate(agreement.getFacultyValidationDate())
                .adminApprovalDate(agreement.getAdminApprovalDate())
                .facultyRejectionReason(agreement.getFacultyRejectionReason())
                .adminRejectionReason(agreement.getAdminRejectionReason())
                .createdAt(agreement.getCreatedAt())
                .updatedAt(agreement.getUpdatedAt())
                // Extract from nested DTO or directly if needed
                .applicationId(applicationDto != null ? applicationDto.getId() : null)
                .studentId(applicationDto != null ? applicationDto.getStudentId() : null)
                .studentName(applicationDto != null ? applicationDto.getStudentFirstName() + " " + applicationDto.getStudentLastName() : null)
                .offerId(applicationDto != null ? applicationDto.getOfferId() : null)
                .offerTitle(applicationDto != null ? applicationDto.getOfferTitle() : null)
                .companyId(applicationDto != null ? applicationDto.getCompanyId() : null)
                .companyName(applicationDto != null ? applicationDto.getCompanyName() : null)
                .facultyValidatorId(agreement.getFacultyValidator() != null ? agreement.getFacultyValidator().getId() : null)
                .facultyValidatorName(agreement.getFacultyValidator() != null ? agreement.getFacultyValidator().getFirstName() + " " + agreement.getFacultyValidator().getLastName() : null)
                .adminApproverId(agreement.getAdminApprover() != null ? agreement.getAdminApprover().getId() : null)
                .adminApproverName(agreement.getAdminApprover() != null ? agreement.getAdminApprover().getFirstName() + " " + agreement.getAdminApprover().getLastName() : null)
                .signedByStudent(agreement.getSignedByStudent())
                .signedByCompany(agreement.getSignedByCompany())
                .signedByFaculty(agreement.getSignedByFaculty())
                .studentSignatureDate(agreement.getStudentSignatureDate())
                .companySignatureDate(agreement.getCompanySignatureDate())
                .facultySignatureDate(agreement.getFacultySignatureDate())
                .build();
    }
}