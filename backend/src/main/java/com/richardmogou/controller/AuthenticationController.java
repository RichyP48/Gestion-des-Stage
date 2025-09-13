package com.richardmogou.controller;

import com.richardmogou.dto.CompanyRegistrationRequest;
import com.richardmogou.dto.JwtAuthenticationResponse;
import com.richardmogou.dto.LoginRequest;
import com.richardmogou.dto.StudentRegistrationRequest;
import com.richardmogou.dto.SchoolRegistrationRequest;
import com.richardmogou.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
// Consider adding @CrossOrigin annotation if CORS config needs controller-level specifics,
// but the global config in SecurityConfiguration is usually preferred.
public class AuthenticationController {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);
    private final AuthenticationService authenticationService;

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        log.info("Received request to register student: {}", request.getEmail());
        try {
            JwtAuthenticationResponse response = authenticationService.registerStudent(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Student registration failed for {}: {}", request.getEmail(), e.getMessage());
            // Return a more specific error DTO if needed
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during student registration for {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PostMapping("/register/company")
    public ResponseEntity<?> registerCompany(@Valid @RequestBody CompanyRegistrationRequest request) {
        log.info("Received request to register company: {}", request.getCompanyName());
         try {
            JwtAuthenticationResponse response = authenticationService.registerCompany(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Company registration failed for {}: {}", request.getCompanyName(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during company registration for {}", request.getCompanyName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PostMapping("/register/school")
    public ResponseEntity<?> registerSchool(@Valid @RequestBody SchoolRegistrationRequest request) {
        log.info("Received request to register school: {} with {} faculties", request.getSchoolName(), 
                request.getFacultyNames() != null ? request.getFacultyNames().size() : 0);
        log.debug("Faculty names: {}", request.getFacultyNames());
        try {
            JwtAuthenticationResponse response = authenticationService.registerSchool(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("School registration failed for {}: {}", request.getSchoolName(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during school registration for {}", request.getSchoolName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        log.info("Received login request for user: {}", request.getEmail());
         try {
            JwtAuthenticationResponse response = authenticationService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Authentication failed (handled in service, re-thrown as IllegalArgumentException)
             log.warn("Login failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials."); // Generic message for security
        } catch (Exception e) {
             log.error("Unexpected error during login for {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred during login.");
        }
    }

    // Optional: Add endpoint for token refresh if implementing refresh tokens
    // @PostMapping("/refresh")
    // public ResponseEntity<?> refreshToken(...) { ... }
}