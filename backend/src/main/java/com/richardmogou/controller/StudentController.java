package com.richardmogou.controller;

import com.richardmogou.dto.InternshipAgreementResponse;
import com.richardmogou.service.InternshipAgreementService;
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
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);
    private final InternshipAgreementService agreementService;

    /**
     * GET /api/students/me/agreements : Get agreements for current student
     */
    @GetMapping("/me/agreements")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getStudentAgreements(@PageableDefault(size = 10) Pageable pageable) {
        log.info("Received request to get agreements for current student");
        try {
            Page<InternshipAgreementResponse> agreements = agreementService.getAgreementsForCurrentStudent(pageable);
            return ResponseEntity.ok(agreements);
        } catch (Exception e) {
            log.error("Error fetching student agreements", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching agreements.");
        }
    }

    /**
     * PUT /api/students/me/agreements/{agreementId}/sign : Sign agreement as student
     */
    @PutMapping("/me/agreements/{agreementId}/sign")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> signAgreementAsStudent(@PathVariable Long agreementId) {
        log.info("Received request to sign agreement ID: {} as student", agreementId);
        try {
            InternshipAgreementResponse response = agreementService.signAgreementAsStudent(agreementId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error signing agreement ID {} as student", agreementId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while signing the agreement.");
        }
    }
}