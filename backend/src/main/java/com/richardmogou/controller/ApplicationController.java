package com.richardmogou.controller;

import com.richardmogou.dto.ApplicationResponse;
import com.richardmogou.dto.ApplicationStatusUpdateRequest;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.FileStorageException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api") // Base path
@RequiredArgsConstructor
public class ApplicationController {

    private static final Logger log = LoggerFactory.getLogger(ApplicationController.class);
    private final ApplicationService applicationService;

    /**
     * POST /api/offers/{offerId}/apply : Submit a new application for an offer.
     * Requires STUDENT role. Consumes multipart/form-data.
     */
    @PostMapping(value = "/offers/{offerId}/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitApplication(
            @PathVariable Long offerId,
            @RequestPart("coverLetter") @Valid String coverLetter, // Assuming cover letter comes as a form part string
            @RequestPart("cv") MultipartFile cvFile) {

        log.info("Received application submission request for offer ID: {}", offerId);
        if (cvFile == null || cvFile.isEmpty()) {
            return ResponseEntity.badRequest().body("CV file is required.");
        }
        // Basic validation for PDF?
        if (!"application/pdf".equals(cvFile.getContentType())) {
             return ResponseEntity.badRequest().body("Invalid file type. Only PDF CVs are accepted.");
        }


        try {
            ApplicationResponse response = applicationService.submitApplication(offerId, coverLetter, cvFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Application submission failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException | FileStorageException e) {
            log.warn("Application submission failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized application submission attempt: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Application submission failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        catch (Exception e) {
            log.error("Error submitting application for offer ID {}", offerId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while submitting the application.");
        }
    }

    /**
     * GET /api/students/me/applications : List applications submitted by the logged-in student.
     * Requires STUDENT role.
     */
    @GetMapping("/students/me/applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getApplicationsForCurrentStudent(
            @PageableDefault(size = 10) Pageable pageable) {
        log.info("Received request to list applications for current student");
        try {
             Page<ApplicationResponse> responsePage = applicationService.getApplicationsForCurrentStudent(pageable);
             return ResponseEntity.ok(responsePage);
         } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to list student applications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Listing student applications failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
             log.error("Error fetching applications for current student", e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching student applications.");
         }
    }

    /**
     * GET /api/companies/me/applications : List applications received for the logged-in company's offers.
     * Requires COMPANY role. Can optionally filter by offerId.
     */
    @GetMapping("/companies/me/applications")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getApplicationsForCurrentCompany(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(required = false) Long offerId) { // Filter by offer ID
        log.info("Received request to list applications for current company, filterOfferId: {}", offerId);
         try {
             Page<ApplicationResponse> responsePage = applicationService.getApplicationsForCurrentCompany(pageable, offerId);
             return ResponseEntity.ok(responsePage);
         } catch (ResourceNotFoundException e) { // If company or filtered offer not found
             log.warn("Could not list company applications: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
         } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to list company applications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Listing company applications failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
             log.error("Error fetching applications for current company", e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching company applications.");
         }
    }

    /**
     * GET /api/applications/{applicationId} : Get details of a specific application.
     * Requires authentication and authorization (Student owner, Company owner, Admin, associated Faculty).
     */
    @GetMapping("/applications/{applicationId}")
    @PreAuthorize("isAuthenticated()") // Authorization handled in service layer
    public ResponseEntity<?> getApplicationById(@PathVariable Long applicationId) {
        log.info("Received request to get application ID: {}", applicationId);
         try {
            ApplicationResponse response = applicationService.getApplicationById(applicationId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Application get failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to access application ID {}: {}", applicationId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Application get failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        catch (Exception e) {
            log.error("Error fetching application ID {}", applicationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the application.");
        }
    }

    /**
     * PUT /api/applications/{applicationId}/status : Update the status of an application.
     * Requires COMPANY role and ownership of the associated offer.
     */
    @PutMapping("/applications/{applicationId}/status")
    @PreAuthorize("hasRole('COMPANY')") // Further ownership check in service
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        log.info("Received request to update status for application ID: {}", applicationId);
         try {
            ApplicationResponse response = applicationService.updateApplicationStatus(applicationId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Application status update failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
             log.warn("Application status update failed (bad request): {}", e.getMessage());
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to update status for application ID {}: {}", applicationId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Application status update failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        catch (Exception e) {
            log.error("Error updating status for application ID {}", applicationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the application status.");
        }
    }

    // GET /api/admin/applications - Admin endpoint for listing all applications would be in AdminController
}