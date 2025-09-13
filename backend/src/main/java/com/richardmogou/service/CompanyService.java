package com.richardmogou.service;

import com.richardmogou.dto.CompanyResponse;
import com.richardmogou.dto.CompanyUpdateRequest;
import com.richardmogou.entity.Company;
import com.richardmogou.entity.User;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private static final Logger log = LoggerFactory.getLogger(CompanyService.class);
    private final CompanyRepository companyRepository;
    private final UserService userService; // To get the current user

    /**
     * Gets the Company entity associated with the currently authenticated user.
     * Assumes the current user has the COMPANY role.
     *
     * @return The Company entity.
     * @throws ResourceNotFoundException if no company is associated with the current user.
     */
    public Company getCurrentUserCompany() { // Changed from private to public
        User currentUser = userService.getCurrentUser();
        return companyRepository.findByPrimaryContactUser(currentUser)
                .orElseThrow(() -> {
                    log.warn("No company found associated with user ID: {}", currentUser.getId());
                    return new ResourceNotFoundException("Company", "userId", currentUser.getId());
                });
    }

    /**
     * Gets the details of the company associated with the currently logged-in user.
     *
     * @return CompanyResponse DTO.
     */
    @Transactional(readOnly = true)
    public CompanyResponse getCurrentCompanyDetails() {
        Company company = getCurrentUserCompany();
        log.info("Fetching details for company ID: {}", company.getId());
        return CompanyResponse.fromEntity(company);
    }

    /**
     * Updates the details of the company associated with the currently logged-in user.
     *
     * @param request DTO containing updated company information.
     * @return Updated CompanyResponse DTO.
     */
    @Transactional
    public CompanyResponse updateCurrentCompanyDetails(CompanyUpdateRequest request) {
        Company company = getCurrentUserCompany();
        log.info("Updating details for company ID: {}", company.getId());

        // Update allowed fields
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setAddress(request.getAddress());
        company.setIndustrySector(request.getIndustrySector());

        Company updatedCompany = companyRepository.save(company);
        log.info("Company details updated successfully for company ID: {}", updatedCompany.getId());
        return CompanyResponse.fromEntity(updatedCompany);
    }

    // Admin-specific company management methods will go into a separate AdminCompanyService
    // or be secured appropriately.
}