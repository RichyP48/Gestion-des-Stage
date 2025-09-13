package com.richardmogou.controller;

import com.richardmogou.entity.Faculty;
import com.richardmogou.entity.User;
import com.richardmogou.repository.FacultyRepository;
import com.richardmogou.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private static final Logger log = LoggerFactory.getLogger(DebugController.class);
    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;

    @PostMapping("/fix-faculty-assignments")
    public ResponseEntity<String> fixFacultyAssignments() {
        log.info("Fixing faculty assignments...");
        
        // Find Alice and assign her to informatique faculty
        userRepository.findByEmail("alice.prof@university.edu").ifPresent(alice -> {
            facultyRepository.findByName("Informatique").ifPresent(informatique -> {
                alice.setFaculty(informatique);
                userRepository.save(alice);
                log.info("Assigned Alice to Informatique faculty");
            });
        });
        
        // Find John Doe and assign him to informatique faculty
        userRepository.findByEmail("john.doe@student.com").ifPresent(john -> {
            facultyRepository.findByName("Informatique").ifPresent(informatique -> {
                john.setFaculty(informatique);
                userRepository.save(john);
                log.info("Assigned John Doe to Informatique faculty");
            });
        });
        
        return ResponseEntity.ok("Faculty assignments fixed");
    }
}