package com.richardmogou.service;

import com.richardmogou.dto.InternshipOfferRequest;
import com.richardmogou.dto.InternshipOfferResponse;
import com.richardmogou.dto.InternshipOfferStatusUpdateRequest;
import com.richardmogou.entity.Company;
import com.richardmogou.entity.InternshipOffer;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.InternshipOfferStatus;
import com.richardmogou.entity.enums.Role;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.exception.UnauthorizedAccessException;
import com.richardmogou.repository.InternshipOfferRepository;
import com.richardmogou.service.specification.InternshipOfferSpecification;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class InternshipOfferService {

    private static final Logger log = LoggerFactory.getLogger(InternshipOfferService.class);
    private final InternshipOfferRepository internshipOfferRepository;
    private final CompanyService companyService; // To get current company
    private final UserService userService; // To get current user for checks

    /**
     * Creates a new internship offer associated with the currently logged-in company user.
     */
    @Transactional
    public InternshipOfferResponse createOffer(InternshipOfferRequest request) {
        Company currentCompany = companyService.getCurrentUserCompany(); // Ensures user is COMPANY and associated
        log.info("Creating new offer '{}' for company ID: {}", request.getTitle(), currentCompany.getId());

        InternshipOffer offer = new InternshipOffer();
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setRequiredSkills(request.getRequiredSkills());
        offer.setDomain(request.getDomain());
        offer.setLocation(request.getLocation());
        offer.setDuration(request.getDuration());
        offer.setStartDate(request.getStartDate());
        offer.setStatus(InternshipOfferStatus.OPEN); // Default to OPEN or DRAFT? Let's use OPEN for now.
        offer.setCompany(currentCompany);

        InternshipOffer savedOffer = internshipOfferRepository.save(offer);
        log.info("Offer created successfully with ID: {}", savedOffer.getId());
        return InternshipOfferResponse.fromEntity(savedOffer);
    }

    /**
     * Retrieves a single internship offer by its ID. Accessible publicly.
     */
    @Transactional(readOnly = true)
    public InternshipOfferResponse getOfferById(Long offerId) {
        log.debug("Fetching offer with ID: {}", offerId);
        InternshipOffer offer = internshipOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipOffer", "id", offerId));
        return InternshipOfferResponse.fromEntity(offer);
    }

    /**
     * Retrieves a paginated list of internship offers, optionally filtered.
     * Filters for status=OPEN by default if no status filter is provided by public users.
     */
    @Transactional(readOnly = true)
    public Page<InternshipOfferResponse> getAllOffers(Pageable pageable, Map<String, String> filters) {
        log.debug("Fetching all offers with filters: {}", filters);

        // Apply default sorting if no sort is specified
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        // Default filter for public view: only show OPEN offers unless a specific status is requested
        if (!filters.containsKey("status")) {
             User currentUser = null;
             try {
                 currentUser = userService.getCurrentUser(); // Check if user is logged in
             } catch (IllegalStateException | ResourceNotFoundException e) {
                 // Not logged in or user not found, apply default public filter
                 filters.put("status", InternshipOfferStatus.OPEN.name());
                 log.debug("Applying default filter: status=OPEN for public access");
             }
             // If logged in, don't apply default status filter unless they are a student?
             // Let's keep it simple: only OPEN by default for non-logged-in users.
             // Logged-in users (non-admin) might see OPEN by default too, unless they specify filters.
             // Admins should see all by default if no filter applied.
             if (currentUser == null || (currentUser.getRole() != Role.ADMIN && !filters.containsKey("status"))) {
                  filters.putIfAbsent("status", InternshipOfferStatus.OPEN.name());
                  log.debug("Applying default filter: status=OPEN for non-admin/public");
             }
        }


        Specification<InternshipOffer> spec = InternshipOfferSpecification.filterBy(filters);
        Page<InternshipOffer> offerPage = internshipOfferRepository.findAll(spec, pageable);
        return offerPage.map(InternshipOfferResponse::fromEntity);
    }

     /**
     * Retrieves offers created by the currently logged-in company user.
     */
    @Transactional(readOnly = true)
    public Page<InternshipOfferResponse> getOffersForCurrentCompany(Pageable pageable) {
        Company currentCompany = companyService.getCurrentUserCompany();
        log.debug("Fetching offers for company ID: {}", currentCompany.getId());
        
        // Apply default sorting if no sort is specified
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), 
                Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        
        Page<InternshipOffer> offerPage = internshipOfferRepository.findByCompany(currentCompany, pageable);
        return offerPage.map(InternshipOfferResponse::fromEntity);
    }


    /**
     * Updates an existing internship offer. Only the company that owns the offer can update it.
     */
    @Transactional
    public InternshipOfferResponse updateOffer(Long offerId, InternshipOfferRequest request) {
        Company currentCompany = companyService.getCurrentUserCompany();
        log.info("Attempting to update offer ID: {} for company ID: {}", offerId, currentCompany.getId());

        InternshipOffer offer = internshipOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipOffer", "id", offerId));

        // Ownership check
        if (!offer.getCompany().getId().equals(currentCompany.getId())) {
            log.warn("Unauthorized attempt to update offer ID: {} by company ID: {}", offerId, currentCompany.getId());
            throw new UnauthorizedAccessException("User is not authorized to update this offer.");
        }

        // Update fields
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setRequiredSkills(request.getRequiredSkills());
        offer.setDomain(request.getDomain());
        offer.setLocation(request.getLocation());
        offer.setDuration(request.getDuration());
        offer.setStartDate(request.getStartDate());
        // Status is updated via a separate endpoint

        InternshipOffer updatedOffer = internshipOfferRepository.save(offer);
        log.info("Offer ID: {} updated successfully by company ID: {}", offerId, currentCompany.getId());
        return InternshipOfferResponse.fromEntity(updatedOffer);
    }

     /**
     * Updates the status of an existing internship offer.
     * Can be done by the owning company or an admin.
     */
    @Transactional
    public InternshipOfferResponse updateOfferStatus(Long offerId, InternshipOfferStatusUpdateRequest request) {
        User currentUser = userService.getCurrentUser();
        log.info("Attempting to update status for offer ID: {} by user ID: {}", offerId, currentUser.getId());

        InternshipOffer offer = internshipOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipOffer", "id", offerId));

        // Authorization check: Allow owning company or admin
        boolean isOwner = currentUser.getRole() == Role.COMPANY && offer.getCompany().getPrimaryContactUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
             log.warn("Unauthorized attempt to update status for offer ID: {} by user ID: {}", offerId, currentUser.getId());
            throw new UnauthorizedAccessException("User is not authorized to update the status of this offer.");
        }

        offer.setStatus(request.getStatus());
        InternshipOffer updatedOffer = internshipOfferRepository.save(offer);
        log.info("Offer ID: {} status updated to {} by user ID: {}", offerId, request.getStatus(), currentUser.getId());
        return InternshipOfferResponse.fromEntity(updatedOffer);
    }


    /**
     * Deletes an internship offer. Only the company that owns the offer can delete it.
     */
    @Transactional
    public void deleteOffer(Long offerId) {
         Company currentCompany = companyService.getCurrentUserCompany();
         log.info("Attempting to delete offer ID: {} by company ID: {}", offerId, currentCompany.getId());

         InternshipOffer offer = internshipOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipOffer", "id", offerId));

        // Ownership check
        if (!offer.getCompany().getId().equals(currentCompany.getId())) {
             log.warn("Unauthorized attempt to delete offer ID: {} by company ID: {}", offerId, currentCompany.getId());
            throw new UnauthorizedAccessException("User is not authorized to delete this offer.");
        }

        // Consider implications: What happens to existing applications?
        // Maybe change status to CLOSED/CANCELLED instead of hard delete?
        // For now, we proceed with deletion as requested by API spec.
        internshipOfferRepository.delete(offer);
        log.info("Offer ID: {} deleted successfully by company ID: {}", offerId, currentCompany.getId());
    }
}