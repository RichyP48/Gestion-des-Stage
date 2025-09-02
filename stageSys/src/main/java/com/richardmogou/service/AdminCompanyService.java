package com.richardmogou.service;

import com.richardmogou.dto.CompanyResponse;
import com.richardmogou.dto.CompanyUpdateRequest;
import com.richardmogou.entity.Company;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCompanyService {

    private static final Logger log = LoggerFactory.getLogger(AdminCompanyService.class);
    private final CompanyRepository companyRepository;
    // No need for UserService here as admin acts globally

    /**
     * Retrieves a paginated list of all companies.
     * TODO: Add filtering capabilities.
     */
    @Transactional(readOnly = true)
    public Page<CompanyResponse> getAllCompanies(Pageable pageable) {
        log.debug("Admin request to fetch all companies");
        Page<Company> companyPage = companyRepository.findAll(pageable);
        // Need to handle lazy loading of primaryContactUser if CompanyResponse needs it
        return companyPage.map(CompanyResponse::fromEntity);
    }

    /**
     * Retrieves details of a specific company by ID.
     */
     @Transactional(readOnly = true)
     public CompanyResponse getCompanyById(Long companyId) {
         log.debug("Admin request to fetch company ID: {}", companyId);
         Company company = companyRepository.findById(companyId)
                 .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
         return CompanyResponse.fromEntity(company);
     }

    /**
     * Updates an existing company by an administrator.
     * Allows updating fields potentially restricted for the company user themselves.
     */
    @Transactional
    public CompanyResponse updateCompany(Long companyId, CompanyUpdateRequest request) {
         log.info("Admin request to update company ID: {}", companyId);
         Company company = companyRepository.findById(companyId)
                 .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

         // Admins can update fields like description, website, address, sector
         company.setDescription(request.getDescription());
         company.setWebsite(request.getWebsite());
         company.setAddress(request.getAddress());
         company.setIndustrySector(request.getIndustrySector());

         // TODO: Consider admin ability to change company name (check uniqueness)
         // if (StringUtils.hasText(request.getName()) && !company.getName().equalsIgnoreCase(request.getName())) {
         //     if (companyRepository.existsByName(request.getName())) {
         //         throw new BadRequestException("Company name already exists: " + request.getName());
         //     }
         //     company.setName(request.getName());
         // }

         // TODO: Consider admin ability to reassign primary contact user

         Company updatedCompany = companyRepository.save(company);
         log.info("Admin successfully updated company ID: {}", updatedCompany.getId());
         return CompanyResponse.fromEntity(updatedCompany);
    }

     /**
     * Creates a company manually by an administrator.
     * Note: This usually isn't the primary way companies are created (self-registration is more common).
     * Requires assigning a primary contact user or handling null contact.
     * For simplicity, we'll omit this for now unless specifically requested again,
     * as it adds complexity around user creation/assignment.
     */
     // @Transactional
     // public CompanyResponse createCompany(AdminCompanyCreateRequest request) { ... }


     /**
     * Deletes a company by an administrator.
     * HIGHLY DANGEROUS - Consider implications (offers, applications, agreements).
     * Soft delete (disabling?) is strongly recommended.
     */
     @Transactional
     public void deleteCompany(Long companyId) {
         log.warn("Admin request to DELETE company ID: {}", companyId);
         Company company = companyRepository.findById(companyId)
                 .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

         // TODO: Implement checks for associated offers/applications before deletion.
         // Or implement soft delete logic (e.g., add an 'enabled' flag to Company).

         // Hard delete (use with extreme caution)
         try {
             companyRepository.delete(company);
             log.info("Admin successfully DELETED company ID: {}", companyId);
         } catch (Exception e) {
             // Catch DataIntegrityViolationException specifically if constraints exist
             log.error("Error deleting company ID {} by admin. It might have associated records.", companyId, e);
             throw new BadRequestException("Cannot delete company ID " + companyId + " as it may have associated records (offers, applications). Consider disabling instead.");
         }
     }
}