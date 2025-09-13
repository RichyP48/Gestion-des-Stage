package com.richardmogou.service;

import com.richardmogou.dto.AgreementApprovalRequest;
import com.richardmogou.dto.AgreementValidationRequest;
import com.richardmogou.dto.InternshipAgreementResponse;
import com.richardmogou.entity.Application;
import com.richardmogou.entity.InternshipAgreement;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.ApplicationStatus;
import com.richardmogou.entity.enums.InternshipAgreementStatus;
import com.richardmogou.entity.enums.NotificationType;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InternshipAgreementService {

    private static final Logger log = LoggerFactory.getLogger(InternshipAgreementService.class);
    private final InternshipAgreementRepository agreementRepository;
    private final ApplicationRepository applicationRepository; // To find the application
    private final UserRepository userRepository; // To find faculty/admin users
    private final UserService userService; // To get current user
    private final PdfGenerationService pdfGenerationService;
    private final NotificationService notificationService;

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
        Optional<InternshipAgreement> existingAgreement = agreementRepository.findByApplication(application);
        if (existingAgreement.isPresent()) {
             log.info("Agreement already exists for application ID: {}, returning existing agreement", applicationId);
             return existingAgreement.get();
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

        // Notify all stakeholders about new agreement
        notifyNewAgreement(savedAgreement);

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
        
        log.info("Fetching agreements pending validation for faculty: {}", currentFaculty.getEmail());
        
        // Debug: Check faculty assignment
        User facultyWithFaculty = userRepository.findByEmail(currentFaculty.getEmail()).orElse(null);
        if (facultyWithFaculty != null && facultyWithFaculty.getFaculty() != null) {
            log.info("Faculty {} belongs to faculty: {} (ID: {})", 
                    currentFaculty.getEmail(), 
                    facultyWithFaculty.getFaculty().getName(), 
                    facultyWithFaculty.getFaculty().getId());
        } else {
            log.warn("Faculty {} has no faculty assigned!", currentFaculty.getEmail());
        }
        
        // Debug: Check all agreements
        long totalAgreements = agreementRepository.count();
        long pendingAgreements = agreementRepository.findByStatus(InternshipAgreementStatus.PENDING_FACULTY_VALIDATION, Pageable.unpaged()).getTotalElements();
        log.info("Total agreements in DB: {}, Pending faculty validation: {}", totalAgreements, pendingAgreements);
        
        // Apply default sorting if no sort is specified
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                Sort.by(Sort.Direction.ASC, "createdAt"));
        }
        
        // Use custom query to find agreements by faculty email
        Page<InternshipAgreement> agreementPage = agreementRepository.findAgreementsByFacultyEmailAndStatus(
                currentFaculty.getEmail(), InternshipAgreementStatus.PENDING_FACULTY_VALIDATION, pageable);
        
        log.info("Found {} agreements pending validation for this faculty", agreementPage.getTotalElements());
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

        // Check if faculty can validate this agreement (same faculty as student)
        Application application = agreement.getApplication();
        User student = application.getStudent();
        
        boolean canValidate = false;
        if (agreement.getFacultyValidator() != null && agreement.getFacultyValidator().getId().equals(currentFaculty.getId())) {
            canValidate = true; // Direct assignment
        } else if (currentFaculty.getFaculty() != null && student.getFaculty() != null && 
                   currentFaculty.getFaculty().getId().equals(student.getFaculty().getId())) {
            canValidate = true; // Same faculty
            agreement.setFacultyValidator(currentFaculty); // Assign for tracking
        }
        
        if (!canValidate) {
            log.warn("Faculty ID {} cannot validate agreement ID {} - not same faculty as student", currentFaculty.getId(), agreementId);
            throw new UnauthorizedAccessException("You are not authorized to validate this agreement.");
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
            
            // Notify student of validation
            notifyStudentOfValidation(agreement, true);
        } else {
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                 throw new BadRequestException("Rejection reason is required when rejecting an agreement.");
            }
            agreement.setStatus(InternshipAgreementStatus.REJECTED);
            agreement.setFacultyValidationDate(LocalDateTime.now()); // Record rejection time
            agreement.setFacultyRejectionReason(request.getRejectionReason());
            log.info("Agreement ID {} rejected by faculty ID {} with reason: {}", agreementId, currentFaculty.getId(), request.getRejectionReason());
            
            // Notify student of rejection
            notifyStudentOfValidation(agreement, false);
        }

        InternshipAgreement updatedAgreement = agreementRepository.save(agreement);
        
        // Notify stakeholders about validation result
        notifyAgreementValidation(updatedAgreement, request.getValidated());
        
        return InternshipAgreementResponse.fromEntity(updatedAgreement);
    }


     /**
     * Retrieves agreements pending approval by Admin users.
     */
    @Transactional(readOnly = true)
    public Page<InternshipAgreementResponse> getAgreementsPendingAdminApproval(Pageable pageable) {
         // No specific admin assigned here, just fetching by status
         log.debug("Fetching agreements pending admin approval");
         
         // Apply default sorting if no sort is specified
         if (pageable.getSort().isUnsorted()) {
             pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                 Sort.by(Sort.Direction.ASC, "createdAt"));
         }
         
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
        } else {
             if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                 throw new BadRequestException("Rejection reason is required when rejecting an agreement.");
            }
            agreement.setStatus(InternshipAgreementStatus.REJECTED);
            agreement.setAdminApprover(currentAdmin); // Record who rejected
            agreement.setAdminApprovalDate(LocalDateTime.now()); // Record rejection time
            agreement.setAdminRejectionReason(request.getRejectionReason());
             log.info("Agreement ID {} rejected by admin ID {} with reason: {}", agreementId, currentAdmin.getId(), request.getRejectionReason());
        }

        InternshipAgreement updatedAgreement = agreementRepository.save(agreement);
        
        // Notify stakeholders about approval result
        notifyAgreementApproval(updatedAgreement, request.getApproved());
        
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
        
        // Apply default sorting if no sort is specified
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        
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
        
        // Apply default sorting if no sort is specified
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        
        Page<InternshipAgreement> agreementPage = agreementRepository.findAll(pageable);
        return agreementPage.map(InternshipAgreementResponse::fromEntity);
    }

    /**
     * Notifies all stakeholders when a new agreement is created
     */
    private void notifyNewAgreement(InternshipAgreement agreement) {
        try {
            Application application = agreement.getApplication();
            
            // Notify student
            notificationService.createAndSendNotification(
                application.getStudent(),
                NotificationType.NEW_AGREEMENT_CREATED,
                "Nouvelle convention de stage créée pour votre candidature",
                "/agreements/" + agreement.getId()
            );
            
            log.info("Notifications sent for new agreement ID: {}", agreement.getId());
        } catch (Exception e) {
            log.error("Error sending notifications for agreement ID: {}", agreement.getId(), e);
            // Continue without failing the agreement creation
        }
    }
    
    /**
     * Notifies stakeholders about faculty validation result
     */
    private void notifyAgreementValidation(InternshipAgreement agreement, boolean validated) {
        log.info("Agreement validation notification for ID: {} - validated: {}", agreement.getId(), validated);
        // Simplified notification - just log for now
    }
    
    /**
     * Notifies student about faculty validation result
     */
    private void notifyStudentOfValidation(InternshipAgreement agreement, boolean validated) {
        try {
            Application application = agreement.getApplication();
            User student = application.getStudent();
            
            if (validated) {
                notificationService.createNotification(
                    student,
                    NotificationType.AGREEMENT_VALIDATED,
                    "Votre convention de stage a été validée par la faculté",
                    "/student/agreements"
                );
                log.info("Validation notification sent to student ID: {} for agreement ID: {}", student.getId(), agreement.getId());
            } else {
                String reason = agreement.getFacultyRejectionReason();
                notificationService.createNotification(
                    student,
                    NotificationType.AGREEMENT_REJECTED,
                    "Votre convention de stage a été rejetée par la faculté. Raison: " + reason,
                    "/student/agreements"
                );
                log.info("Rejection notification sent to student ID: {} for agreement ID: {}", student.getId(), agreement.getId());
            }
        } catch (Exception e) {
            log.error("Error sending validation notification for agreement ID: {}", agreement.getId(), e);
        }
    }
    
    /**
     * Notifies stakeholders about admin approval result
     */
    private void notifyAgreementApproval(InternshipAgreement agreement, boolean approved) {
        log.info("Agreement approval notification for ID: {} - approved: {}", agreement.getId(), approved);
        // Simplified notification - just log for now
    }

    /**
     * Creates a new agreement from request data
     */
    @Transactional
    public InternshipAgreementResponse createAgreement(Map<String, Object> agreementData) {
        log.info("Creating new agreement from request data");
        
        Long applicationId = Long.valueOf(agreementData.get("applicationId").toString());
        return InternshipAgreementResponse.fromEntity(createAgreementForApplication(applicationId));
    }

    /**
     * Signs an agreement by the current authenticated user
     */
    @Transactional
    public InternshipAgreementResponse signAgreement(Long agreementId) {
        User currentUser = userService.getCurrentUser();
        log.info("User {} attempting to sign agreement ID: {}", currentUser.getId(), agreementId);

        InternshipAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipAgreement", "id", agreementId));

        Application application = agreement.getApplication();
        LocalDateTime now = LocalDateTime.now();
        boolean updated = false;

        // Determine who is signing based on user role and relationship to the agreement
        switch (currentUser.getRole()) {
            case STUDENT:
                if (application.getStudent().getId().equals(currentUser.getId()) && !agreement.getSignedByStudent()) {
                    agreement.setSignedByStudent(true);
                    agreement.setStudentSignatureDate(now);
                    updated = true;
                    log.info("Student signed agreement ID: {}", agreementId);
                }
                break;
            case COMPANY:
                if (application.getInternshipOffer().getCompany().getPrimaryContactUser().getId().equals(currentUser.getId()) && !agreement.getSignedByCompany()) {
                    agreement.setSignedByCompany(true);
                    agreement.setCompanySignatureDate(now);
                    updated = true;
                    log.info("Company signed agreement ID: {}", agreementId);
                }
                break;
            case FACULTY:
                if (agreement.getFacultyValidator() != null && agreement.getFacultyValidator().getId().equals(currentUser.getId()) && !agreement.getSignedByFaculty()) {
                    agreement.setSignedByFaculty(true);
                    agreement.setFacultySignatureDate(now);
                    updated = true;
                    log.info("Faculty signed agreement ID: {}", agreementId);
                }
                break;
        }

        if (!updated) {
            throw new BadRequestException("User is not authorized to sign this agreement or has already signed");
        }

        // Check if all parties have signed
        if (agreement.getSignedByStudent() && agreement.getSignedByCompany() && agreement.getSignedByFaculty()) {
            agreement.setStatus(InternshipAgreementStatus.SIGNED);
            log.info("Agreement ID {} is now fully signed", agreementId);
        }
        
        InternshipAgreement savedAgreement = agreementRepository.save(agreement);
        return InternshipAgreementResponse.fromEntity(savedAgreement);
    }

    /**
     * Signs an agreement specifically as a student
     */
    @Transactional
    public InternshipAgreementResponse signAgreementAsStudent(Long agreementId) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.STUDENT) {
            throw new UnauthorizedAccessException("User does not have STUDENT role.");
        }
        
        InternshipAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipAgreement", "id", agreementId));

        // Vérifier que l'utilisateur peut signer cette convention
        Application application = agreement.getApplication();
        if (application == null || application.getStudent() == null ||
            !application.getStudent().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("User is not authorized to sign this agreement");
        }

        if (Boolean.TRUE.equals(agreement.getSignedByStudent())) {
            throw new BadRequestException("Agreement already signed by student");
        }

        agreement.setSignedByStudent(true);
        agreement.setStudentSignatureDate(LocalDateTime.now());
        
        InternshipAgreement savedAgreement = agreementRepository.save(agreement);
        return InternshipAgreementResponse.fromEntity(savedAgreement);
    }

    /**
     * Signs an agreement specifically as a company
     */
    @Transactional
    public InternshipAgreementResponse signAgreementAsCompany(Long agreementId) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.COMPANY) {
            throw new UnauthorizedAccessException("User does not have COMPANY role.");
        }
        
        InternshipAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipAgreement", "id", agreementId));

        // Vérifier que l'utilisateur peut signer cette convention
        Application application = agreement.getApplication();
        if (application == null || application.getInternshipOffer() == null || 
            application.getInternshipOffer().getCompany() == null ||
            application.getInternshipOffer().getCompany().getPrimaryContactUser() == null ||
            !application.getInternshipOffer().getCompany().getPrimaryContactUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("User is not authorized to sign this agreement");
        }

        if (Boolean.TRUE.equals(agreement.getSignedByCompany())) {
            throw new BadRequestException("Agreement already signed by company");
        }

        agreement.setSignedByCompany(true);
        agreement.setCompanySignatureDate(LocalDateTime.now());
        
        InternshipAgreement savedAgreement = agreementRepository.save(agreement);
        return InternshipAgreementResponse.fromEntity(savedAgreement);
    }

    /**
     * Retrieves agreements for the current company
     */
    @Transactional(readOnly = true)
    public Page<InternshipAgreementResponse> getAgreementsForCurrentCompany(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.COMPANY) {
            throw new UnauthorizedAccessException("User does not have COMPANY role.");
        }
        
        log.debug("Fetching agreements for company user ID: {}", currentUser.getId());
        
        // Apply default sorting if no sort is specified
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        
        // Find agreements where the company is the offer's company
        Page<InternshipAgreement> agreementPage = agreementRepository.findByApplication_InternshipOffer_Company_PrimaryContactUser(currentUser, pageable);
        return agreementPage.map(InternshipAgreementResponse::fromEntity);
    }

}