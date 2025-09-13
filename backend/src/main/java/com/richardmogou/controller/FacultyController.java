package com.richardmogou.controller;

import com.richardmogou.dto.InternshipAgreementResponse;
import com.richardmogou.service.InternshipAgreementService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private static final Logger log = LoggerFactory.getLogger(FacultyController.class);
    private final InternshipAgreementService agreementService;

    /**
     * GET /api/faculty/me/agreements/pending : Get agreements pending validation for current faculty
     */
    @GetMapping("/me/agreements/pending")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<Page<InternshipAgreementResponse>> getPendingAgreements(
            @PageableDefault(size = 10) Pageable pageable) {
        log.info("Faculty request to list pending agreements for validation");
        Page<InternshipAgreementResponse> agreements = agreementService.getAgreementsPendingFacultyValidation(pageable);
        return ResponseEntity.ok(agreements);
    }
}