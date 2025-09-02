package com.richardmogou.service;

import com.richardmogou.dto.AgreementApprovalRequest;
import com.richardmogou.dto.AgreementValidationRequest;
import com.richardmogou.dto.InternshipAgreementResponse;
import com.richardmogou.entity.Application;
import com.richardmogou.entity.InternshipAgreement;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.ApplicationStatus;
import com.richardmogou.entity.enums.InternshipAgreementStatus;
import com.richardmogou.entity.enums.Role;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.repository.ApplicationRepository;
import com.richardmogou.repository.InternshipAgreementRepository;
import com.richardmogou.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InternshipAgreementService {

    private static final Logger log = LoggerFactory.getLogger(InternshipAgreementService.class);
    private final InternshipAgreementRepository agreementRepository;
    private final ApplicationRepository applicationRepository; // To find the application
    private final UserRepository userRepository; // To find faculty/admin users
    private final UserService userService; // To get current user
    private final PdfGenerationService pdfGenerationService;
    // private final NotificationService notificationService; // Inject later

    /**
     * Creates an Internship Agreement when an application is accepted.
     * This might be triggered by the ApplicationService or a listener.
     *
     * @param applicationId The ID of the accepted application.
     * @return The created InternshipAgreement entity.
     */
    @Transactional
    public InternshipAgreement createAgreementForApplication(Long applicationId) {
        log.info("Attempting to create agreement for application ID: {}", applicationId);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        // Ensure application is actually accepted
        if (application.getStatus() != ApplicationStatus.ACCEPTED) {
            log.warn("Cannot create agreement for application ID {} with status {}", applicationId, application.getStatus());
            throw new BadRequestException("Agreement can only be created for ACCEPTED applications.");
        }

        // Check if agreement already exists
        if (agreementRepository.findByApplication(application).isPresent()) {
             log.warn("Agreement already exists for application ID: {}", applicationId);
             // Decide how to handle: return existing, throw error? Let's throw for now.
             throw new BadRequestException("An agreement already exists for this application.");
        }

        // TODO: Assign Faculty Validator - How is this determined?
        // For now, leave it null or assign a default/placeholder if logic exists.
        // User facultyValidator = userRepository.findById(SOME_LOGIC_TO_FIND_FACULTY_ID).orElse(null);
        User facultyValidator = null; // Placeholder

        // Generate PDF
        String pdfPath;
        try {
            pdfPath = pdfGenerationService.generateAgreementPdf(application);
        } catch (IOException e) {
            log.error("Failed to generate PDF for application ID: {}", applicationId, e);
            // Depending on requirements, might throw a specific error or handle differently
            throw new RuntimeException("Failed to generate agreement PDF", e);
        }

        InternshipAgreement agreement = new InternshipAgreement();
        agreement.setApplication(application);
        agreement.setAgreementPdfPath(pdfPath);
        agreement.setStatus(InternshipAgreementStatus.PENDING_FACULTY_VALIDATION);
        agreement.setFacultyValidator(facultyValidator); // Assign faculty if found
        // Admin approver is assigned later

        InternshipAgreement savedAgreement = agreementRepository.save(agreement);
        log.info("Internship agreement created successfully with ID: {} for application ID: {}", savedAgreement.getId(), applicationId);

        // Update application status
        application.setStatus(ApplicationStatus.AWAITING_AGREEMENT);
        applicationRepository.save(application);

        // TODO: Trigger notification to assigned faculty (if any) and student.

        return savedAgreement;
    }

     /**
     * Retrieves details of a specific agreement.
     * Authorization checks needed based on user role.
     */
    @Transactional(readOnly = true)
    public InternshipAgreementResponse getAgreementById(Long agreementId) {
        User currentUser = userService.getCurrentUser();
        log.debug("Fetching agreement ID: {} for user ID: {}", agreementId, currentUser.getId());

        InternshipAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipAgreement", "id", agreementId));

        // Authorization Check
        Application application = agreement.getApplication();
        boolean isStudentOwner = currentUser.getRole() == Role.STUDENT && application.getStudent().getId().equals(currentUser.getId());
        boolean isCompanyOwner = currentUser.getRole() == Role.COMPANY && application.getInternshipOffer().getCompany().getPrimaryContactUser().getId().equals(currentUser.getId());
        boolean isAssignedFaculty = currentUser.getRole() == Role.FACULTY && agreement.getFacultyValidator() != null && agreement.getFacultyValidator().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        // TODO: Add check for Admin Approver if needed for viewing

        if (!isStudentOwner && !isCompanyOwner && !isAssignedFaculty && !isAdmin) {
            log.warn("Unauthorized attempt to access agreement ID: {} by user ID: {}", agreementId, currentUser.getId());
            throw new UnauthorizedAccessException("User is not authorized to view this agreement.");
        }

        return InternshipAgreementResponse.fromEntity(agreement);
    }

     /**
     * Retrieves agreements pending validation by the currently logged-in faculty member.
     */
    @Transactional(readOnly = true)
    public Page<InternshipAgreementResponse> getAgreementsPendingFacultyValidation(Pageable pageable) {
        User currentFaculty = userService.getCurrentUser();
        if (currentFaculty.getRole() != Role.FACULTY) {
            throw new UnauthorizedAccessException("User does not have FACULTY role.");
        }
        log.debug("Fetching agreements pending validation for faculty ID: {}", currentFaculty.getId());
        // This assumes faculty is assigned directly. If based on department/student, logic needs adjustment.
        Page<InternshipAgreement> agreementPage = agreementRepository.findByFacultyValidatorAndStatus(
                currentFaculty, InternshipAgreementStatus.PENDING_FACULTY_VALIDATION, pageable);
        return agreementPage.map(InternshipAgreementResponse::fromEntity);
    }

    /**
     * Allows a Faculty member to validate or reject an agreement.
     */
    @Transactional
    public InternshipAgreementResponse validateAgreement(Long agreementId, AgreementValidationRequest request) {
        User currentFaculty = userService.getCurrentUser();
         if (currentFaculty.getRole() != Role.FACULTY) {
            throw new UnauthorizedAccessException("User does not have FACULTY role.");
        }
        log.info("Attempting validation for agreement ID: {} by faculty ID: {}", agreementId, currentFaculty.getId());

        InternshipAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipAgreement", "id", agreementId));

        // Check if faculty is assigned (if assignment logic exists)
        if (agreement.getFacultyValidator() == null || !agreement.getFacultyValidator().getId().equals(currentFaculty.getId())) {
             log.warn("Faculty ID {} is not assigned to validate agreement ID {}", currentFaculty.getId(), agreementId);
             throw new UnauthorizedAccessException("You are not assigned to validate this agreement.");
        }

        // Check current status
        if (agreement.getStatus() != InternshipAgreementStatus.PENDING_FACULTY_VALIDATION) {
            log.warn("Attempted to validate agreement ID {} with status {}", agreementId, agreement.getStatus());
            throw new BadRequestException("Agreement is not pending faculty validation.");
        }

        if (request.getValidated()) {
            agreement.setStatus(InternshipAgreementStatus.PENDING_ADMIN_APPROVAL);
            agreement.setFacultyValidationDate(LocalDateTime.now());
            agreement.setFacultyRejectionReason(null); // Clear reason if previously rejected
            log.info("Agreement ID {} validated by faculty ID {}", agreementId, currentFaculty.getId());
            // TODO: Assign Admin Approver? Or is there a pool? For now, leave null.
            // TODO: Notify assigned Admin (if any) and student/company.
        } else {
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                 throw new BadRequestException("Rejection reason is required when rejecting an agreement.");
            }
            agreement.setStatus(InternshipAgreementStatus.REJECTED);
            agreement.setFacultyValidationDate(LocalDateTime.now()); // Record rejection time
            agreement.setFacultyRejectionReason(request.getRejectionReason());
            log.info("Agreement ID {} rejected by faculty ID {} with reason: {}", agreementId, currentFaculty.getId(), request.getRejectionReason());
            // TODO: Notify student/company of rejection.
        }

        InternshipAgreement updatedAgreement = agreementRepository.save(agreement);
        return InternshipAgreementResponse.fromEntity(updatedAgreement);
    }


     /**
     * Retrieves agreements pending approval by Admin users.
     */
    @Transactional(readOnly = true)
    public Page<InternshipAgreementResponse> getAgreementsPendingAdminApproval(Pageable pageable) {
         // No specific admin assigned here, just fetching by status
         log.debug("Fetching agreements pending admin approval");
         Page<InternshipAgreement> agreementPage = agreementRepository.findByStatus(
                 InternshipAgreementStatus.PENDING_ADMIN_APPROVAL, pageable);
        return agreementPage.map(InternshipAgreementResponse::fromEntity);
    }


    /**
     * Allows an Admin user to approve or reject an agreement.
     */
    @Transactional
    public InternshipAgreementResponse approveAgreement(Long agreementId, AgreementApprovalRequest request) {
        User currentAdmin = userService.getCurrentUser();
         if (currentAdmin.getRole() != Role.ADMIN) {
            throw new UnauthorizedAccessException("User does not have ADMIN role.");
        }
        log.info("Attempting approval for agreement ID: {} by admin ID: {}", agreementId, currentAdmin.getId());

        InternshipAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipAgreement", "id", agreementId));

         // Check current status
        if (agreement.getStatus() != InternshipAgreementStatus.PENDING_ADMIN_APPROVAL) {
            log.warn("Attempted to approve agreement ID {} with status {}", agreementId, agreement.getStatus());
            throw new BadRequestException("Agreement is not pending admin approval.");
        }

        if (request.getApproved()) {
            agreement.setStatus(InternshipAgreementStatus.APPROVED);
            agreement.setAdminApprover(currentAdmin); // Record who approved
            agreement.setAdminApprovalDate(LocalDateTime.now());
            agreement.setAdminRejectionReason(null);
            log.info("Agreement ID {} approved by admin ID {}", agreementId, currentAdmin.getId());
            // TODO: Notify student/company/faculty of final approval.
        } else {
             if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                 throw new BadRequestException("Rejection reason is required when rejecting an agreement.");
            }
            agreement.setStatus(InternshipAgreementStatus.REJECTED);
            agreement.setAdminApprover(currentAdmin); // Record who rejected
            agreement.setAdminApprovalDate(LocalDateTime.now()); // Record rejection time
            agreement.setAdminRejectionReason(request.getRejectionReason());
             log.info("Agreement ID {} rejected by admin ID {} with reason: {}", agreementId, currentAdmin.getId(), request.getRejectionReason());
             // TODO: Notify student/company/faculty of rejection.
        }

        InternshipAgreement updatedAgreement = agreementRepository.save(agreement);
        return InternshipAgreementResponse.fromEntity(updatedAgreement);
    }

     /**
     * Retrieves agreements related to the currently logged-in student.
     */
    @Transactional(readOnly = true)
    public Page<InternshipAgreementResponse> getAgreementsForCurrentStudent(Pageable pageable) {
        User currentStudent = userService.getCurrentUser();
         if (currentStudent.getRole() != Role.STUDENT) {
            throw new UnauthorizedAccessException("User does not have STUDENT role.");
        }
        log.debug("Fetching agreements for student ID: {}", currentStudent.getId());
        Page<InternshipAgreement> agreementPage = agreementRepository.findByApplication_Student(currentStudent, pageable);
        return agreementPage.map(InternshipAgreementResponse::fromEntity);
    }

    // TODO: Method to get PDF resource for download
    // public Resource getAgreementPdfResource(Long agreementId) { ... }


    // --- Admin Operations ---

     /**
     * Retrieves all agreements system-wide (for admin oversight).
     */
    @Transactional(readOnly = true)
    public Page<InternshipAgreementResponse> getAllAgreements(Pageable pageable) {
        // No specific filtering here, admin sees all. Add filters if needed.
        log.debug("Admin request to fetch all agreements");
        Page<InternshipAgreement> agreementPage = agreementRepository.findAll(pageable);
        return agreementPage.map(InternshipAgreementResponse::fromEntity);
    }

}