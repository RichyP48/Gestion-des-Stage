package com.richardmogou.service;

import com.richardmogou.dto.CompanyRegistrationRequest;
import com.richardmogou.dto.JwtAuthenticationResponse;
import com.richardmogou.dto.LoginRequest;
import com.richardmogou.dto.StudentRegistrationRequest;
import com.richardmogou.entity.Company;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.Role;
import com.richardmogou.repository.CompanyRepository;
import com.richardmogou.repository.UserRepository;
import com.richardmogou.service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional // Ensure atomicity
    public JwtAuthenticationResponse registerStudent(StudentRegistrationRequest request) {
        log.info("Registering new student with email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already exists - {}", request.getEmail());
            throw new IllegalArgumentException("Email address already in use.");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);
        user.setEnabled(true); // Or set to false if email verification is needed
        user.setPhoneNumber(request.getPhoneNumber());

        User savedUser = userRepository.save(user);
        log.info("Student registered successfully with ID: {}", savedUser.getId());

        // Generate token upon successful registration
        // Note: Spring Security UserDetails uses username, which is email here
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name());
        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User(savedUser.getEmail(), savedUser.getPassword(), Collections.singletonList(authority));

        String jwtToken = jwtService.generateToken(userDetails);
        return JwtAuthenticationResponse.builder()
                .token(jwtToken)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    @Transactional // Ensure atomicity
    public JwtAuthenticationResponse registerCompany(CompanyRegistrationRequest request) {
        log.info("Registering new company contact with email: {}", request.getContactEmail());
        if (userRepository.existsByEmail(request.getContactEmail())) {
            log.warn("Registration failed: Contact email already exists - {}", request.getContactEmail());
            throw new IllegalArgumentException("Contact email address already in use.");
        }
        if (companyRepository.existsByName(request.getCompanyName())) {
             log.warn("Registration failed: Company name already exists - {}", request.getCompanyName());
            throw new IllegalArgumentException("Company name already exists.");
        }

        // 1. Create the User (Company Contact)
        User user = new User();
        user.setFirstName(request.getContactFirstName());
        user.setLastName(request.getContactLastName());
        user.setEmail(request.getContactEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.COMPANY);
        user.setEnabled(true);
        user.setPhoneNumber(request.getContactPhoneNumber());
        User savedUser = userRepository.save(user);
        log.info("Company contact user registered successfully with ID: {}", savedUser.getId());

        // 2. Create the Company
        Company company = new Company();
        company.setName(request.getCompanyName());
        company.setDescription(request.getCompanyDescription());
        company.setWebsite(request.getCompanyWebsite());
        company.setAddress(request.getCompanyAddress());
        company.setIndustrySector(request.getCompanyIndustrySector());
        company.setPrimaryContactUser(savedUser); // Link the user
        Company savedCompany = companyRepository.save(company);
        log.info("Company registered successfully with ID: {}", savedCompany.getId());


        // Generate token upon successful registration
        SimpleGrantedAuthority companyAuthority = new SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name());
        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User(savedUser.getEmail(), savedUser.getPassword(), Collections.singletonList(companyAuthority));

        String jwtToken = jwtService.generateToken(userDetails);
        return JwtAuthenticationResponse.builder()
                .token(jwtToken)
                .userId(savedUser.getId()) // Return user ID
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    public JwtAuthenticationResponse login(LoginRequest request) {
        log.info("Attempting login for user: {}", request.getEmail());
        try {
            // This performs the authentication check using UserDetailsService and PasswordEncoder
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            log.warn("Login failed for user {}: {}", request.getEmail(), e.getMessage());
            // Consider throwing a more specific exception or returning a specific error response
            throw new IllegalArgumentException("Invalid email or password.", e);
        }

        // If authentication is successful, load user details and generate token
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found after successful authentication - should not happen")); // Should not happen if auth succeeded

        log.info("Login successful for user: {}", request.getEmail());
        SimpleGrantedAuthority loginAuthority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Collections.singletonList(loginAuthority));

        String jwtToken = jwtService.generateToken(userDetails);
        return JwtAuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}