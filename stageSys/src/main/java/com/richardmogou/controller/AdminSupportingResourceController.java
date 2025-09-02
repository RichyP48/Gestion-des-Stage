package com.richardmogou.controller;

import com.richardmogou.dto.DomainDto;
import com.richardmogou.dto.SectorDto;
import com.richardmogou.dto.SkillDto;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.service.DomainService;
import com.richardmogou.service.SectorService;
import com.richardmogou.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin") // Base path for admin operations
@PreAuthorize("hasRole('ADMIN')") // Secure all endpoints for ADMIN role
@RequiredArgsConstructor
public class AdminSupportingResourceController {

    private static final Logger log = LoggerFactory.getLogger(AdminSupportingResourceController.class);
    private final SkillService skillService;
    private final DomainService domainService;
    private final SectorService sectorService;

    // --- Skill Management ---

    @PostMapping("/skills")
    public ResponseEntity<?> createSkill(@Valid @RequestBody SkillDto request) {
        log.info("Admin request to create skill: {}", request.getName());
        try {
            SkillDto response = skillService.createSkill(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error creating skill '{}'", request.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating skill.");
        }
    }

    @PutMapping("/skills/{skillId}")
    public ResponseEntity<?> updateSkill(@PathVariable Long skillId, @Valid @RequestBody SkillDto request) {
        log.info("Admin request to update skill ID: {}", skillId);
        try {
            SkillDto response = skillService.updateSkill(skillId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error updating skill ID {}", skillId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating skill.");
        }
    }

    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long skillId) {
        log.info("Admin request to delete skill ID: {}", skillId);
        try {
            skillService.deleteSkill(skillId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error deleting skill ID {}", skillId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting skill.");
        }
    }

    // --- Domain Management ---

     @PostMapping("/domains")
    public ResponseEntity<?> createDomain(@Valid @RequestBody DomainDto request) {
        log.info("Admin request to create domain: {}", request.getName());
        try {
            DomainDto response = domainService.createDomain(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error creating domain '{}'", request.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating domain.");
        }
    }

    @PutMapping("/domains/{domainId}")
    public ResponseEntity<?> updateDomain(@PathVariable Long domainId, @Valid @RequestBody DomainDto request) {
         log.info("Admin request to update domain ID: {}", domainId);
        try {
            DomainDto response = domainService.updateDomain(domainId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error updating domain ID {}", domainId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating domain.");
        }
    }

    @DeleteMapping("/domains/{domainId}")
    public ResponseEntity<?> deleteDomain(@PathVariable Long domainId) {
        log.info("Admin request to delete domain ID: {}", domainId);
        try {
            domainService.deleteDomain(domainId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error deleting domain ID {}", domainId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting domain.");
        }
    }

     // --- Sector Management ---

     @PostMapping("/sectors")
    public ResponseEntity<?> createSector(@Valid @RequestBody SectorDto request) {
        log.info("Admin request to create sector: {}", request.getName());
        try {
            SectorDto response = sectorService.createSector(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error creating sector '{}'", request.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating sector.");
        }
    }

    @PutMapping("/sectors/{sectorId}")
    public ResponseEntity<?> updateSector(@PathVariable Long sectorId, @Valid @RequestBody SectorDto request) {
         log.info("Admin request to update sector ID: {}", sectorId);
        try {
            SectorDto response = sectorService.updateSector(sectorId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error updating sector ID {}", sectorId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating sector.");
        }
    }

    @DeleteMapping("/sectors/{sectorId}")
    public ResponseEntity<?> deleteSector(@PathVariable Long sectorId) {
        log.info("Admin request to delete sector ID: {}", sectorId);
        try {
            sectorService.deleteSector(sectorId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error deleting sector ID {}", sectorId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting sector.");
        }
    }

}