package com.richardmogou.service;

import com.richardmogou.dto.SkillDto;
import com.richardmogou.entity.Skill;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Should be above the class definition
public class SkillService {

    // Logger should be declared inside the class
    private static final Logger log = LoggerFactory.getLogger(SkillService.class);
    private final SkillRepository skillRepository;

    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills() {
        // Return sorted by name
        return skillRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(SkillDto::fromEntity)
                .collect(Collectors.toList());
    }

    // --- Admin Operations ---

    @Transactional
    public SkillDto createSkill(SkillDto skillDto) {
        log.info("Admin request to create skill: {}", skillDto.getName());
        if (skillRepository.existsByNameIgnoreCase(skillDto.getName())) {
            throw new BadRequestException("Skill with name '" + skillDto.getName() + "' already exists.");
        }
        Skill skill = new Skill();
        skill.setName(skillDto.getName());
        Skill savedSkill = skillRepository.save(skill);
        log.info("Skill created successfully with ID: {}", savedSkill.getId());
        return SkillDto.fromEntity(savedSkill);
    }

    @Transactional
    public SkillDto updateSkill(Long skillId, SkillDto skillDto) {
        log.info("Admin request to update skill ID: {}", skillId);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        // Check if name is changing and if new name exists
        if (!skill.getName().equalsIgnoreCase(skillDto.getName()) && skillRepository.existsByNameIgnoreCase(skillDto.getName())) {
             throw new BadRequestException("Skill with name '" + skillDto.getName() + "' already exists.");
        }

        skill.setName(skillDto.getName());
        Skill updatedSkill = skillRepository.save(skill);
        log.info("Skill updated successfully for ID: {}", updatedSkill.getId());
        return SkillDto.fromEntity(updatedSkill);
    }

    @Transactional
    public void deleteSkill(Long skillId) {
        log.warn("Admin request to DELETE skill ID: {}", skillId);
         if (!skillRepository.existsById(skillId)) {
            throw new ResourceNotFoundException("Skill", "id", skillId);
        }
        // TODO: Check if skill is in use by any offers before deleting?
        // This might require adding a relationship or querying offers.
        // For now, allow deletion.
        try {
            skillRepository.deleteById(skillId);
            log.info("Skill deleted successfully for ID: {}", skillId);
        } catch (Exception e) {
             log.error("Error deleting skill ID {}: {}", skillId, e.getMessage(), e);
             // Catch DataIntegrityViolationException if constraints are added
             throw new BadRequestException("Could not delete skill ID " + skillId + ". It might be in use.");
        }
    }
}