package com.richardmogou.controller;

import com.richardmogou.dto.InternshipOfferRequest;
import com.richardmogou.dto.InternshipOfferResponse;
import com.richardmogou.dto.InternshipOfferStatusUpdateRequest;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.service.InternshipOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api") // Base path for offers
@RequiredArgsConstructor
public class InternshipOfferController {

    private static final Logger log = LoggerFactory.getLogger(InternshipOfferController.class);
    private final InternshipOfferService internshipOfferService;

    /**
     * POST /api/offers : Create a new internship offer.
     * Requires COMPANY role.
     */
    @PostMapping("/offers")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> createOffer(@Valid @RequestBody InternshipOfferRequest request) {
        log.info("Received request to create internship offer: {}", request.getTitle());
        try {
            InternshipOfferResponse response = internshipOfferService.createOffer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) { // If company not found for user
             log.warn("Offer creation failed: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) { // If user context is wrong
             log.warn("Offer creation failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        catch (Exception e) {
            log.error("Error creating internship offer '{}'", request.getTitle(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the offer.");
        }
    }

    /**
     * GET /api/offers : List available internship offers with filtering and pagination.
     * Publicly accessible, but filtering might differ based on role (handled in service).
     */
    @GetMapping("/offers")
    public ResponseEntity<Page<InternshipOfferResponse>> getAllOffers(
            @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable,
            @RequestParam(required = false) Map<String, String> filters) { // Capture all query params as filters
        log.info("Received request to list offers with filters: {}", filters);
        Page<InternshipOfferResponse> offerPage = internshipOfferService.getAllOffers(pageable, filters);
        return ResponseEntity.ok(offerPage);
    }

     /**
     * GET /api/offers/{offerId} : Get details of a specific internship offer.
     * Publicly accessible.
     */
    @GetMapping("/offers/{offerId}")
    public ResponseEntity<?> getOfferById(@PathVariable Long offerId) {
        log.info("Received request to get offer with ID: {}", offerId);
         try {
            InternshipOfferResponse response = internshipOfferService.getOfferById(offerId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Offer not found with ID {}: {}", offerId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error fetching offer with ID {}", offerId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the offer.");
        }
    }

    /**
     * GET /api/companies/me/offers : List offers created by the logged-in company user.
     * Requires COMPANY role.
     * Note: Could also be placed under /api/offers?company=me, but this follows the spec.
     */
    @GetMapping("/companies/me/offers")
    @PreAuthorize("hasRole('COMPANY')")
     public ResponseEntity<?> getOffersForCurrentCompany(
             @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable) {
        log.info("Received request to list offers for current company");
         try {
             Page<InternshipOfferResponse> offerPage = internshipOfferService.getOffersForCurrentCompany(pageable);
             return ResponseEntity.ok(offerPage);
         } catch (ResourceNotFoundException e) { // If company not found for user
             log.warn("Could not list offers for current company: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
         } catch (IllegalStateException e) { // If user context is wrong
             log.warn("Offer listing failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
         } catch (Exception e) {
             log.error("Error fetching offers for current company", e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching company offers.");
         }
    }


    /**
     * PUT /api/offers/{offerId} : Update an existing internship offer.
     * Requires COMPANY role and ownership.
     */
    @PutMapping("/offers/{offerId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> updateOffer(@PathVariable Long offerId, @Valid @RequestBody InternshipOfferRequest request) {
        log.info("Received request to update offer ID: {}", offerId);
         try {
            InternshipOfferResponse response = internshipOfferService.updateOffer(offerId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Offer update failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to update offer ID {}: {}", offerId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Offer update failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        catch (Exception e) {
            log.error("Error updating offer ID {}", offerId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the offer.");
        }
    }

     /**
     * PUT /api/offers/{offerId}/status : Update the status of an existing internship offer.
     * Requires COMPANY (owner) or ADMIN role.
     */
    @PutMapping("/offers/{offerId}/status")
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<?> updateOfferStatus(@PathVariable Long offerId, @Valid @RequestBody InternshipOfferStatusUpdateRequest request) {
        log.info("Received request to update status for offer ID: {}", offerId);
         try {
            InternshipOfferResponse response = internshipOfferService.updateOfferStatus(offerId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Offer status update failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to update status for offer ID {}: {}", offerId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Offer status update failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        catch (Exception e) {
            log.error("Error updating status for offer ID {}", offerId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the offer status.");
        }
    }


    /**
     * DELETE /api/offers/{offerId} : Delete an internship offer.
     * Requires COMPANY role and ownership.
     */
    @DeleteMapping("/offers/{offerId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> deleteOffer(@PathVariable Long offerId) {
        log.info("Received request to delete offer ID: {}", offerId);
         try {
            internshipOfferService.deleteOffer(offerId);
            return ResponseEntity.noContent().build(); // Standard for successful DELETE
        } catch (ResourceNotFoundException e) {
            log.warn("Offer deletion failed, resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedAccessException e) {
             log.warn("Unauthorized attempt to delete offer ID {}: {}", offerId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
             log.warn("Offer deletion failed due to illegal state: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication context error.");
        }
        // Consider adding catch for DataIntegrityViolationException if deletion is constrained
        catch (Exception e) {
            log.error("Error deleting offer ID {}", offerId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the offer.");
        }
    }
}