package com.richardmogou.controller;

import com.richardmogou.dto.ApplicationResponse;
import com.richardmogou.dto.InternshipAgreementResponse;
import com.richardmogou.service.ApplicationService;
import com.richardmogou.service.InternshipAgreementService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin") // Base path for admin operations
@PreAuthorize("hasRole('ADMIN')") // Secure all endpoints for ADMIN role
@RequiredArgsConstructor
public class AdminOversightController {

    private static final Logger log = LoggerFactory.getLogger(AdminOversightController.class);
    private final ApplicationService applicationService;
    private final InternshipAgreementService agreementService;

    /**
     * GET /api/admin/applications : List all applications system-wide (paginated).
     */
    @GetMapping("/applications")
    public ResponseEntity<Page<ApplicationResponse>> getAllApplications(
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Admin request to list all applications");
        Page<ApplicationResponse> applicationPage = applicationService.getAllApplications(pageable);
        return ResponseEntity.ok(applicationPage);
    }

    /**
     * GET /api/admin/agreements : List all agreements system-wide (paginated).
     */
    @GetMapping("/agreements")
    public ResponseEntity<Page<InternshipAgreementResponse>> getAllAgreements(
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Admin request to list all agreements");
        Page<InternshipAgreementResponse> agreementPage = agreementService.getAllAgreements(pageable);
        return ResponseEntity.ok(agreementPage);
    }

    /**
     * GET /api/admin/agreements/pending : List agreements pending admin approval (paginated).
     */
    @GetMapping("/agreements/pending")
    public ResponseEntity<Page<InternshipAgreementResponse>> getPendingAgreements(
            @PageableDefault(size = 10) Pageable pageable) {
        log.info("Admin request to list pending agreements");
        Page<InternshipAgreementResponse> agreementPage = agreementService.getAgreementsPendingAdminApproval(pageable);
        return ResponseEntity.ok(agreementPage);
    }
}