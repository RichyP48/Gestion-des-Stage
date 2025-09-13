package com.richardmogou.service;

import com.richardmogou.dto.DomainDto;
import com.richardmogou.entity.Domain;
import com.richardmogou.exception.BadRequestException;
import com.richardmogou.exception.ResourceNotFoundException;
import com.richardmogou.repository.DomainRepository;
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
public class DomainService {

    private final DomainRepository domainRepository;

    @Transactional(readOnly = true)
    public List<DomainDto> getAllDomains() {
         return domainRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(DomainDto::fromEntity)
                .collect(Collectors.toList());
   }

    // --- Admin Operations ---

   private static final Logger log = LoggerFactory.getLogger(DomainService.class); // Add logger

   @Transactional
   public DomainDto createDomain(DomainDto domainDto) {
       log.info("Admin request to create domain: {}", domainDto.getName());
       if (domainRepository.existsByNameIgnoreCase(domainDto.getName())) {
           throw new BadRequestException("Domain with name '" + domainDto.getName() + "' already exists.");
       }
       Domain domain = new Domain();
       domain.setName(domainDto.getName());
       Domain savedDomain = domainRepository.save(domain);
       log.info("Domain created successfully with ID: {}", savedDomain.getId());
       return DomainDto.fromEntity(savedDomain);
   }

   @Transactional
   public DomainDto updateDomain(Long domainId, DomainDto domainDto) {
       log.info("Admin request to update domain ID: {}", domainId);
       Domain domain = domainRepository.findById(domainId)
               .orElseThrow(() -> new ResourceNotFoundException("Domain", "id", domainId));

       // Check if name is changing and if new name exists
       if (!domain.getName().equalsIgnoreCase(domainDto.getName()) && domainRepository.existsByNameIgnoreCase(domainDto.getName())) {
            throw new BadRequestException("Domain with name '" + domainDto.getName() + "' already exists.");
       }

       domain.setName(domainDto.getName());
       Domain updatedDomain = domainRepository.save(domain);
       log.info("Domain updated successfully for ID: {}", updatedDomain.getId());
       return DomainDto.fromEntity(updatedDomain);
   }

   @Transactional
   public void deleteDomain(Long domainId) {
       log.warn("Admin request to DELETE domain ID: {}", domainId);
        if (!domainRepository.existsById(domainId)) {
           throw new ResourceNotFoundException("Domain", "id", domainId);
       }
       // TODO: Check if domain is in use by any offers before deleting?
       try {
           domainRepository.deleteById(domainId);
           log.info("Domain deleted successfully for ID: {}", domainId);
       } catch (Exception e) {
            log.error("Error deleting domain ID {}: {}", domainId, e.getMessage(), e);
            throw new BadRequestException("Could not delete domain ID " + domainId + ". It might be in use.");
       }
   }
}