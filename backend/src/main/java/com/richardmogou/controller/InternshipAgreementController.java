package com.richardmogou.controller;

import com.richardmogou.dto.AgreementApprovalRequest;
import com.richardmogou.dto.AgreementValidationRequest;
import com.richardmogou.dto.InternshipAgreementResponse;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.service.InternshipAgreementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.Role;
import com.richardmogou.service.UserService;

@RestController
@RequestMapping("/api/agreements")
@RequiredArgsConstructor
public class InternshipAgreementController {

    private static final Logger log = LoggerFactory.getLogger(InternshipAgreementController.class);
    private final InternshipAgreementService agreementService;
    private final UserService userService;

    /**
     * GET /api/agreements/{agreementId} : Get details of a specific agreement.
     * Requires authentication and appropriate role/ownership (checked in service).
     */
    @GetMapping("/{agreementId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAgreementById(@PathVariable Long agreementId) {
        log.info("Received request to get agreement ID: {}", agreementId);
        try {
            InternshipAgreementResponse response = agreementService.getAgreementById(agreementId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Agreement get failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
            log.warn("Unauthorized attempt to access agreement ID {}: {}", agreementId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Agreement get failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error fetching agreement ID {}", agreementId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the agreement.");
        }
    }

    /**
     * GET /api/agreements/{agreementId}/pdf : Download the PDF agreement file.
     * Requires authentication and appropriate role/ownership (checked in service).
     * TODO: Implement PDF download logic using FileStorageService/PdfGenerationService.
     */
    @GetMapping("/{agreementId}/pdf")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> downloadAgreementPdf(@PathVariable Long agreementId) {
        log.info("Received request to download PDF for agreement ID: {}", agreementId);
        try {
            // 1. Verify user has access to the agreement (call getAgreementById or similar check)
            InternshipAgreementResponse agreementMeta = agreementService.getAgreementById(agreementId); // Reuses auth check

            // 2. Load the actual PDF file resource (needs service method)
            // Resource pdfResource = fileStorageService.loadAgreementAsResource(agreementMeta.getAgreementPdfPath()); // Example
            Resource pdfResource = null; // Placeholder

             if (pdfResource == null) { // Or if service throws specific exception
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Agreement PDF file not found.");
             }

            // 3. Return the resource with appropriate headers
            String contentType = "application/pdf";
            // Suggest a filename for the download
            String headerValue = "attachment; filename=\"" + agreementMeta.getAgreementPdfPath() + "\""; // Use stored path or generate a better name

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(pdfResource);

        } catch (ResourceNotFoundException e) {
            log.warn("PDF download failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
            log.warn("Unauthorized attempt to download PDF for agreement ID {}: {}", agreementId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("PDF download failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        // Catch specific file loading exceptions if needed
        catch (Exception e) {
            log.error("Error downloading PDF for agreement ID {}", agreementId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while downloading the agreement PDF.");
        }
    }


    /**
     * GET /api/agreements/faculty/pending : List agreements pending validation for the logged-in faculty.
     * Requires FACULTY role.
     */
    @GetMapping("/faculty/pending") // Corrected route
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<?> getAgreementsPendingFacultyValidation(
             @PageableDefault(size = 10) Pageable pageable) {
         log.info("Received request to list agreements pending validation for current faculty");
         try {
             Page<InternshipAgreementResponse> responsePage = agreementService.getAgreementsPendingFacultyValidation(pageable);
             return ResponseEntity.ok(responsePage);
         } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to list pending faculty agreements: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Listing pending faculty agreements failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
             log.error("Error fetching pending faculty agreements", e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching pending agreements.");
         }
    }

    /**
     * PUT /api/agreements/{agreementId}/validate : Validate or reject an agreement.
     * Requires FACULTY role and assignment (checked in service).
     */
    @PutMapping("/{agreementId}/validate")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<?> validateAgreement(
            @PathVariable Long agreementId,
            @Valid @RequestBody AgreementValidationRequest request) {
        log.info("Received request to validate/reject agreement ID: {}", agreementId);
         try {
            InternshipAgreementResponse response = agreementService.validateAgreement(agreementId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Agreement validation failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
             log.warn("Agreement validation failed (bad request): {}", e.getMessage());
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to validate agreement ID {}: {}", agreementId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Agreement validation failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        catch (Exception e) {
            log.error("Error validating agreement ID {}", agreementId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while validating the agreement.");
        }
    }

     /**
     * GET /api/agreements/admin/pending : List agreements pending final approval by Admin.
     * Requires ADMIN role.
     */
    @GetMapping("/admin/pending") // Corrected route
    @PreAuthorize("hasRole('ADMIN')")
     public ResponseEntity<?> getAgreementsPendingAdminApproval(
             @PageableDefault(size = 10) Pageable pageable) {
         log.info("Received request to list agreements pending admin approval");
         try {
             Page<InternshipAgreementResponse> responsePage = agreementService.getAgreementsPendingAdminApproval(pageable);
             return ResponseEntity.ok(responsePage);
         } catch (Exception e) { // Less specific exceptions needed here unless service throws them
             log.error("Error fetching pending admin agreements", e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching pending agreements.");
         }
    }


    /**
     * PUT /api/agreements/{agreementId}/approve : Approve or reject an agreement.
     * Requires ADMIN role.
     */
    @PutMapping("/{agreementId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveAgreement(
            @PathVariable Long agreementId,
            @Valid @RequestBody AgreementApprovalRequest request) {
        log.info("Received request to approve/reject agreement ID: {}", agreementId);
         try {
            InternshipAgreementResponse response = agreementService.approveAgreement(agreementId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Agreement approval failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
             log.warn("Agreement approval failed (bad request): {}", e.getMessage());
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (UnauthorizedAccessException e) { // Should not happen due to @PreAuthorize, but good practice
             log.warn("Unauthorized attempt to approve agreement ID {}: {}", agreementId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Agreement approval failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        catch (Exception e) {
            log.error("Error approving agreement ID {}", agreementId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while approving the agreement.");
        }
    }

    /**
     * GET /api/agreements : List agreements for the current authenticated user.
     * Works for all roles - returns agreements based on user's role and permissions.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAgreementsForCurrentUser(
             @PageableDefault(size = 10) Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        
        try {
            Page<InternshipAgreementResponse> responsePage;
            
            switch (currentUser.getRole()) {
                case STUDENT:
                    responsePage = agreementService.getAgreementsForCurrentStudent(pageable);
                    break;
                case FACULTY:
                    responsePage = agreementService.getAgreementsPendingFacultyValidation(pageable);
                    break;
                case ADMIN:
                    responsePage = agreementService.getAllAgreements(pageable);
                    break;
                case COMPANY:
                    // For companies, we might need a specific method
                    responsePage = agreementService.getAllAgreements(pageable); // Placeholder
                    break;
                default:
                    throw new UnauthorizedAccessException("Invalid user role");
            }
            
            return ResponseEntity.ok(responsePage);
        } catch (UnauthorizedAccessException e) {
            log.warn("Unauthorized attempt to list agreements: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
            log.warn("Listing agreements failed due to illegal state: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error fetching agreements for current user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching agreements.");
        }
    }



    /**
     * POST /api/agreements : Create a new internship agreement.
     * Requires authentication (typically called when application is accepted).
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createAgreement(@Valid @RequestBody Map<String, Object> agreementData) {
        log.info("Received request to create new agreement");
        try {
            InternshipAgreementResponse response = agreementService.createAgreement(agreementData);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (BadRequestException e) {
            log.warn("Agreement creation failed (bad request): {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            log.warn("Agreement creation failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
            log.warn("Unauthorized attempt to create agreement: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
            log.warn("Agreement creation failed due to illegal state: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error creating agreement", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the agreement.");
        }
    }

    /**
     * PUT /api/agreements/{agreementId}/sign : Sign an agreement.
     * The system determines who is signing based on the authenticated user.
     */
    @PutMapping("/{agreementId}/sign")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> signAgreement(@PathVariable Long agreementId) {
        log.info("Received request to sign agreement ID: {}", agreementId);
        try {
            InternshipAgreementResponse response = agreementService.signAgreement(agreementId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Agreement signing failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
            log.warn("Agreement signing failed (bad request): {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
            log.warn("Unauthorized attempt to sign agreement ID {}: {}", agreementId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
            log.warn("Agreement signing failed due to illegal state: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        } catch (Exception e) {
            log.error("Error signing agreement ID {}", agreementId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while signing the agreement.");
        }
    }

    // GET /api/admin/agreements - Admin endpoint for listing all agreements would be in AdminController
}