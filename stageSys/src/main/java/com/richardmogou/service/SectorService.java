package com.richardmogou.service;

import com.richardmogou.dto.SectorDto;
import com.richardmogou.entity.Sector;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.repository.SectorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectorService {

    private final SectorRepository sectorRepository;

    @Transactional(readOnly = true)
    public List<SectorDto> getAllSectors() {
         return sectorRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(SectorDto::fromEntity)
                .collect(Collectors.toList());
   }

    // --- Admin Operations ---

   private static final Logger log = LoggerFactory.getLogger(SectorService.class); // Add logger

   @Transactional
   public SectorDto createSector(SectorDto sectorDto) {
       log.info("Admin request to create sector: {}", sectorDto.getName());
       if (sectorRepository.existsByNameIgnoreCase(sectorDto.getName())) {
           throw new BadRequestException("Sector with name '" + sectorDto.getName() + "' already exists.");
       }
       Sector sector = new Sector();
       sector.setName(sectorDto.getName());
       Sector savedSector = sectorRepository.save(sector);
       log.info("Sector created successfully with ID: {}", savedSector.getId());
       return SectorDto.fromEntity(savedSector);
   }

   @Transactional
   public SectorDto updateSector(Long sectorId, SectorDto sectorDto) {
       log.info("Admin request to update sector ID: {}", sectorId);
       Sector sector = sectorRepository.findById(sectorId)
               .orElseThrow(() -> new ResourceNotFoundException("Sector", "id", sectorId));

       // Check if name is changing and if new name exists
       if (!sector.getName().equalsIgnoreCase(sectorDto.getName()) && sectorRepository.existsByNameIgnoreCase(sectorDto.getName())) {
            throw new BadRequestException("Sector with name '" + sectorDto.getName() + "' already exists.");
       }

       sector.setName(sectorDto.getName());
       Sector updatedSector = sectorRepository.save(sector);
       log.info("Sector updated successfully for ID: {}", updatedSector.getId());
       return SectorDto.fromEntity(updatedSector);
   }

   @Transactional
   public void deleteSector(Long sectorId) {
       log.warn("Admin request to DELETE sector ID: {}", sectorId);
        if (!sectorRepository.existsById(sectorId)) {
           throw new ResourceNotFoundException("Sector", "id", sectorId);
       }
       // TODO: Check if sector is in use by any companies before deleting?
       try {
           sectorRepository.deleteById(sectorId);
           log.info("Sector deleted successfully for ID: {}", sectorId);
       } catch (Exception e) {
            log.error("Error deleting sector ID {}: {}", sectorId, e.getMessage(), e);
            throw new BadRequestException("Could not delete sector ID " + sectorId + ". It might be in use.");
       }
   }
}