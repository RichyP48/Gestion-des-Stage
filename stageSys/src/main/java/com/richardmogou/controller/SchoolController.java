package com.richardmogou.controller;

import com.richardmogou.entity.School;
import com.richardmogou.entity.Faculty;
import com.richardmogou.repository.SchoolRepository;
import com.richardmogou.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolRepository schoolRepository;
    private final FacultyRepository facultyRepository;

    @GetMapping
    public ResponseEntity<List<School>> getAllSchools() {
        return ResponseEntity.ok(schoolRepository.findAll());
    }

    @GetMapping("/{schoolId}/faculties")
    public ResponseEntity<List<Faculty>> getFacultiesBySchool(@PathVariable Long schoolId) {
        return ResponseEntity.ok(facultyRepository.findBySchoolId(schoolId));
    }

    @GetMapping("/{schoolId}")
    public ResponseEntity<School> getSchoolById(@PathVariable Long schoolId) {
        return schoolRepository.findById(schoolId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/debug")
    public ResponseEntity<String> debugSchoolsAndFaculties() {
        List<School> schools = schoolRepository.findAll();
        StringBuilder debug = new StringBuilder();
        debug.append("Schools and their faculties:\n");
        
        for (School school : schools) {
            debug.append(String.format("School: %s (ID: %d)\n", school.getName(), school.getId()));
            List<Faculty> faculties = facultyRepository.findBySchoolId(school.getId());
            debug.append(String.format("  Faculties count: %d\n", faculties.size()));
            for (Faculty faculty : faculties) {
                debug.append(String.format("  - %s (ID: %d)\n", faculty.getName(), faculty.getId()));
            }
            debug.append("\n");
        }
        
        return ResponseEntity.ok(debug.toString());
    }
}