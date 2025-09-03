package com.richardmogou.controller;

import com.richardmogou.dto.CompanyResponse;
import com.richardmogou.dto.CompanyUpdateRequest;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.service.AdminCompanyService;
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

@RestController
@RequestMapping("/api/admin/companies") // Base path for admin company operations
@PreAuthorize("hasRole('ADMIN')") // Secure all endpoints for ADMIN role
@RequiredArgsConstructor
public class AdminCompanyController {

    private static final Logger log = LoggerFactory.getLogger(AdminCompanyController.class);
    private final AdminCompanyService adminCompanyService;

    /**
     * GET /api/admin/companies : List all companies (paginated).
     */
    @GetMapping
    public ResponseEntity<Page<CompanyResponse>> getAllCompanies(
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Admin request to list all companies");
        Page<CompanyResponse> companyPage = adminCompanyService.getAllCompanies(pageable);
        return ResponseEntity.ok(companyPage);
    }

     /**
     * GET /api/admin/companies/{companyId} : Get details of a specific company.
     */
    @GetMapping("/{companyId}")
    public ResponseEntity<?> getCompanyById(@PathVariable Long companyId) {
        log.info("Admin request to get company ID: {}", companyId);
        try {
            CompanyResponse response = adminCompanyService.getCompanyById(companyId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Admin company get failed, company not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error fetching company ID {} by admin", companyId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the company.");
        }
    }

    /**
     * PUT /api/admin/companies/{companyId} : Update an existing company.
     */
    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateCompany(@PathVariable Long companyId, @Valid @RequestBody CompanyUpdateRequest request) {
        log.info("Admin request to update company ID: {}", companyId);
         try {
            CompanyResponse response = adminCompanyService.updateCompany(companyId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Admin company update failed, company not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) { // Catch potential errors like duplicate name if implemented
             log.warn("Admin company update failed: {}", e.getMessage());
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error updating company ID {} by admin", companyId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the company.");
        }
    }

    /**
     * DELETE /api/admin/companies/{companyId} : Delete a company.
     * Use with caution! Consider disabling instead.
     */
    @DeleteMapping("/{companyId}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long companyId) {
        log.info("Admin request to delete company ID: {}", companyId);
         try {
            adminCompanyService.deleteCompany(companyId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            log.warn("Admin company delete failed, company not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) { // Catch constraint violation errors
             log.warn("Admin company delete failed: {}", e.getMessage());
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error deleting company ID {} by admin", companyId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the company.");
        }
    }

     // POST /api/admin/companies - Omitted for now as per service implementation note.
}