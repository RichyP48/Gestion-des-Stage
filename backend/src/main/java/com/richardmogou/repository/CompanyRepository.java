package com.richardmogou.repository;

import com.richardmogou.entity.Company;
import com.richardmogou.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByPrimaryContactUser(User user);

    Optional<Company> findByName(String name); // Useful for checking duplicates or admin lookup

    boolean existsByName(String name);

    // Add other custom query methods as needed
}