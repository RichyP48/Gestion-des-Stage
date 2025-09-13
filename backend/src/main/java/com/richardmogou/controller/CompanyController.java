package com.richardmogou.controller;

import com.richardmogou.dto.CompanyResponse;
import com.richardmogou.dto.CompanyUpdateRequest;
import com.richardmogou.dto.InternshipOfferResponse;
import com.richardmogou.dto.InternshipAgreementResponse;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.service.CompanyService;
import com.richardmogou.service.InternshipOfferService;
import com.richardmogou.service.InternshipAgreementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private static final Logger log = LoggerFactory.getLogger(CompanyController.class);
    private final CompanyService companyService;
    private final InternshipOfferService offerService;
    private final InternshipAgreementService agreementService;

    /**
     * GET /api/companies/me : Get details of the company associated with the logged-in user.
     * Requires COMPANY role.
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getCurrentCompanyDetails() {
        log.info("Received request to get current company details");
        try {
            CompanyResponse companyResponse = companyService.getCurrentCompanyDetails();
            return ResponseEntity.ok(companyResponse);
        } catch (ResourceNotFoundException e) {
            log.warn("Could not find company details for current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Attempted to get company details for non-authenticated or invalid user state: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error or user not associated with a company.");
        }
        catch (Exception e) {
            log.error("Error fetching current company details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching company details.");
        }
    }

    /**
     * PUT /api/companies/me : Update details of the company associated with the logged-in user.
     * Requires COMPANY role.
     */
    @PutMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> updateCurrentCompanyDetails(@Valid @RequestBody CompanyUpdateRequest request) {
        log.info("Received request to update current company details");
         try {
            CompanyResponse updatedCompany = companyService.updateCurrentCompanyDetails(request);
            return ResponseEntity.ok(updatedCompany);
        } catch (ResourceNotFoundException e) {
            log.warn("Could not find company to update for current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Attempted to update company details for non-authenticated or invalid user state: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error or user not associated with a company.");
        } catch (Exception e) {
            log.error("Error updating current company details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating company details.");
        }
    }

    /**
     * GET /api/companies/me/offers : Get offers for the current company
     * Requires COMPANY role.
     */
    @GetMapping("/me/offers")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getCurrentCompanyOffers(Pageable pageable) {
        log.info("Received request to get offers for current company");
        try {
            Page<InternshipOfferResponse> offers = offerService.getOffersForCurrentCompany(pageable);
            return ResponseEntity.ok(offers);
        } catch (Exception e) {
            log.error("Error fetching offers for current company", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching offers.");
        }
    }

    /**
     * GET /api/companies/me/agreements : Get agreements for current company
     */
    @GetMapping("/me/agreements")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getCompanyAgreements(Pageable pageable) {
        log.info("Received request to get agreements for current company");
        try {
            Page<InternshipAgreementResponse> agreements = agreementService.getAgreementsForCurrentCompany(pageable);
            return ResponseEntity.ok(agreements);
        } catch (Exception e) {
            log.error("Error fetching company agreements", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching agreements.");
        }
    }

    /**
     * PUT /api/companies/me/agreements/{agreementId}/sign : Sign agreement as company
     */
    @PutMapping("/me/agreements/{agreementId}/sign")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> signAgreementAsCompany(@PathVariable Long agreementId) {
        log.info("Received request to sign agreement ID: {} as company", agreementId);
        try {
            InternshipAgreementResponse response = agreementService.signAgreementAsCompany(agreementId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error signing agreement ID {} as company", agreementId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while signing the agreement.");
        }
    }

    // Admin company management endpoints (GET /api/admin/companies, etc.)
    // will be in a separate AdminController or secured here.
}