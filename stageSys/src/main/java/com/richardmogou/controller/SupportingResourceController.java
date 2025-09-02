package com.richardmogou.controller;

import com.richardmogou.dto.DomainDto;
import com.richardmogou.dto.SectorDto;
import com.richardmogou.dto.SkillDto;
import com.richardmogou.service.DomainService;
import com.richardmogou.service.SectorService;
import com.richardmogou.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api") // Base path
@RequiredArgsConstructor
public class SupportingResourceController {

    private static final Logger log = LoggerFactory.getLogger(SupportingResourceController.class);
    private final SkillService skillService;
    private final DomainService domainService;
    private final SectorService sectorService;

    /**
     * GET /api/skills : Get all available skills.
     * Publicly accessible.
     */
    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> getAllSkills() {
        log.debug("Request received for all skills");
        List<SkillDto> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }

    /**
     * GET /api/domains : Get all available domains.
     * Publicly accessible.
     */
    @GetMapping("/domains")
    public ResponseEntity<List<DomainDto>> getAllDomains() {
         log.debug("Request received for all domains");
        List<DomainDto> domains = domainService.getAllDomains();
        return ResponseEntity.ok(domains);
    }

    /**
     * GET /api/sectors : Get all available industry sectors.
     * Publicly accessible.
     */
    @GetMapping("/sectors")
    public ResponseEntity<List<SectorDto>> getAllSectors() {
         log.debug("Request received for all sectors");
        List<SectorDto> sectors = sectorService.getAllSectors();
        return ResponseEntity.ok(sectors);
    }

    // Admin CRUD endpoints for these resources would go in Admin controllers.
}