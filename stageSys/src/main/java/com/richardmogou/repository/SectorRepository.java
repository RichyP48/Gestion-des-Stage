package com.richardmogou.repository;

import com.richardmogou.entity.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SectorRepository extends JpaRepository<Sector, Long> {
    Optional<Sector> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}