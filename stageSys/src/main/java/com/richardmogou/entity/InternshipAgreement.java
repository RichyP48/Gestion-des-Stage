package com.richardmogou.entity;

import com.richardmogou.entity.enums.InternshipAgreementStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "internship_agreements")
@Data
@NoArgsConstructor
public class InternshipAgreement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", unique = true, nullable = false) // One agreement per application
    private Application application;

    @NotBlank
    @Column(nullable = false)
    private String agreementPdfPath; // Path/URL to the generated PDF

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InternshipAgreementStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_validator_user_id")
    private User facultyValidator; // User with FACULTY role

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_approver_user_id")
    private User adminApprover; // User with ADMIN role

    private LocalDateTime facultyValidationDate;

    private LocalDateTime adminApprovalDate;

    @Column(columnDefinition = "TEXT")
    private String facultyRejectionReason;

    @Column(columnDefinition = "TEXT")
    private String adminRejectionReason;

    // Signature tracking fields
    @Column(nullable = true)
    private Boolean signedByStudent = false;

    @Column(nullable = true)
    private Boolean signedByCompany = false;

    @Column(nullable = true)
    private Boolean signedByFaculty = false;

    private LocalDateTime studentSignatureDate;
    private LocalDateTime companySignatureDate;
    private LocalDateTime facultySignatureDate;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}