package com.richardmogou.service;

import com.richardmogou.dto.ApplicationResponse;
import com.richardmogou.dto.ApplicationStatusUpdateRequest;
import com.richardmogou.entity.Application;
import com.richardmogou.entity.Company;
import com.richardmogou.entity.InternshipOffer;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.ApplicationStatus;
import com.richardmogou.entity.enums.InternshipOfferStatus;
import com.richardmogou.entity.enums.Role;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.repository.ApplicationRepository;
import com.richardmogou.repository.InternshipOfferRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ApplicationService.class);
    private final ApplicationRepository applicationRepository;
    private final InternshipOfferRepository internshipOfferRepository;
    private final UserService userService;
    private final CompanyService companyService;
    private final FileStorageService fileStorageService;
    // private final NotificationService notificationService; // Inject later for notifications

    /**
     * Submits a new application for an internship offer.
     */
    @Transactional
    public ApplicationResponse submitApplication(Long offerId, String coverLetter, MultipartFile cvFile) {
        User currentStudent = userService.getCurrentUser();
        if (currentStudent.getRole() != Role.STUDENT) {
            throw new UnauthorizedAccessException("Only users with STUDENT role can submit applications.");
        }

        log.info("Attempting application submission by student ID: {} for offer ID: {}", currentStudent.getId(), offerId);

        InternshipOffer offer = internshipOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipOffer", "id", offerId));

        // Check if offer is open
        if (offer.getStatus() != InternshipOfferStatus.OPEN) {
            log.warn("Application submission failed: Offer ID {} is not OPEN.", offerId);
            throw new BadRequestException("Applications are not accepted for this offer (Status: " + offer.getStatus() + ").");
        }

        // Check if student already applied
        if (applicationRepository.existsByStudentAndInternshipOffer(currentStudent, offer)) {
            log.warn("Application submission failed: Student ID {} already applied to offer ID {}.", currentStudent.getId(), offerId);
            throw new BadRequestException("You have already applied to this internship offer.");
        }

        // Store the CV file
        String cvFileName = fileStorageService.storeFile(cvFile);
        log.info("CV file stored as: {}", cvFileName);

        Application application = new Application();
        application.setStudent(currentStudent);
        application.setInternshipOffer(offer);
        application.setCvPath(cvFileName); // Store the unique filename/path
        application.setCoverLetter(coverLetter);
        application.setStatus(ApplicationStatus.PENDING);
        application.setApplicationDate(LocalDateTime.now());

        Application savedApplication = applicationRepository.save(application);
        log.info("Application submitted successfully with ID: {}", savedApplication.getId());

        // TODO: Trigger notification to the company

        return ApplicationResponse.fromEntity(savedApplication);
    }

    /**
     * Retrieves applications submitted by the currently logged-in student.
     */
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsForCurrentStudent(Pageable pageable) {
        User currentStudent = userService.getCurrentUser();
         if (currentStudent.getRole() != Role.STUDENT) {
            // This check might be redundant if endpoint is secured by role, but good practice
            throw new UnauthorizedAccessException("User does not have STUDENT role.");
        }
        log.debug("Fetching applications for student ID: {}", currentStudent.getId());
        Page<Application> applicationPage = applicationRepository.findByStudent(currentStudent, pageable);
        return applicationPage.map(ApplicationResponse::fromEntity);
    }

     /**
     * Retrieves applications received for offers posted by the currently logged-in company user.
     */
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsForCurrentCompany(Pageable pageable, Long filterOfferId) {
        Company currentCompany = companyService.getCurrentUserCompany();
        log.debug("Fetching applications for company ID: {}", currentCompany.getId());

        Page<Application> applicationPage;
        if (filterOfferId != null) {
             // Optional: Verify the filtered offer belongs to the company
             InternshipOffer offer = internshipOfferRepository.findById(filterOfferId)
                 .orElseThrow(() -> new ResourceNotFoundException("InternshipOffer", "id", filterOfferId));
             if (!offer.getCompany().getId().equals(currentCompany.getId())) {
                 throw new UnauthorizedAccessException("Offer ID " + filterOfferId + " does not belong to the current company.");
             }
             log.debug("Filtering applications for offer ID: {}", filterOfferId);
             applicationPage = applicationRepository.findByInternshipOffer(offer, pageable);
        } else {
             applicationPage = applicationRepository.findByInternshipOffer_Company_Id(currentCompany.getId(), pageable);
        }

        return applicationPage.map(ApplicationResponse::fromEntity);
    }

    /**
     * Retrieves details of a specific application.
     * Access control: Student owner, Company owner, associated Faculty, Admin.
     */
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long applicationId) {
        User currentUser = userService.getCurrentUser();
        log.debug("Fetching application ID: {} for user ID: {}", applicationId, currentUser.getId());

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        // Authorization Check
        boolean isStudentOwner = currentUser.getRole() == Role.STUDENT && application.getStudent().getId().equals(currentUser.getId());
        boolean isCompanyOwner = currentUser.getRole() == Role.COMPANY && application.getInternshipOffer().getCompany().getPrimaryContactUser().getId().equals(currentUser.getId());
        // TODO: Add checks for associated Faculty and Admin roles once agreement logic is in place
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isFacultyAssociated = false; // Placeholder for faculty check

        if (!isStudentOwner && !isCompanyOwner && !isAdmin && !isFacultyAssociated) {
             log.warn("Unauthorized attempt to access application ID: {} by user ID: {}", applicationId, currentUser.getId());
            throw new UnauthorizedAccessException("User is not authorized to view this application.");
        }

        // Optionally update status to VIEWED if company views it for the first time
        if (isCompanyOwner && application.getStatus() == ApplicationStatus.PENDING) {
            application.setStatus(ApplicationStatus.VIEWED);
            applicationRepository.save(application);
            log.info("Application ID {} status updated to VIEWED by company user ID {}", applicationId, currentUser.getId());
        }


        return ApplicationResponse.fromEntity(application);
    }

    /**
     * Updates the status of an application (e.g., ACCEPTED, REJECTED).
     * Only the company that owns the offer associated with the application can do this.
     */
    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest request) {
        Company currentCompany = companyService.getCurrentUserCompany(); // Ensures user is COMPANY role
        log.info("Attempting to update status for application ID: {} by company ID: {}", applicationId, currentCompany.getId());

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        // Ownership check: Does the application belong to an offer owned by this company?
        if (!application.getInternshipOffer().getCompany().getId().equals(currentCompany.getId())) {
             log.warn("Unauthorized attempt to update status for application ID: {} by company ID: {}", applicationId, currentCompany.getId());
            throw new UnauthorizedAccessException("User is not authorized to update the status of this application.");
        }

        // Basic state transition validation (can add more complex rules)
        if (application.getStatus() == ApplicationStatus.ACCEPTED || application.getStatus() == ApplicationStatus.REJECTED) {
             log.warn("Attempted to update status for already finalized application ID: {}", applicationId);
             throw new BadRequestException("Application status cannot be updated once it is ACCEPTED or REJECTED.");
        }
         if (request.getStatus() == ApplicationStatus.PENDING || request.getStatus() == ApplicationStatus.VIEWED) {
             log.warn("Attempted invalid status update for application ID: {} to {}", applicationId, request.getStatus());
             throw new BadRequestException("Cannot manually set status to PENDING or VIEWED.");
         }


        application.setStatus(request.getStatus());
        application.setCompanyFeedback(request.getFeedback());
        Application updatedApplication = applicationRepository.save(application);
        log.info("Application ID {} status updated to {} by company ID: {}", applicationId, request.getStatus(), currentCompany.getId());

        // TODO: Trigger notification to the student about the status update.
        // TODO: If status is ACCEPTED, potentially trigger agreement creation process.

        return ApplicationResponse.fromEntity(updatedApplication);
    }

    // --- Admin Operations ---

    /**
     * Retrieves all applications system-wide (for admin oversight).
     */
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getAllApplications(Pageable pageable) {
        // No specific filtering here, admin sees all. Add filters if needed.
        log.debug("Admin request to fetch all applications");
        Page<Application> applicationPage = applicationRepository.findAll(pageable);
        return applicationPage.map(ApplicationResponse::fromEntity);
    }

}