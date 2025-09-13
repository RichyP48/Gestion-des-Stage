package com.richardmogou.repository;

import com.richardmogou.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    List<Faculty> findBySchoolId(Long schoolId);
    Optional<Faculty> findByName(String name);
}