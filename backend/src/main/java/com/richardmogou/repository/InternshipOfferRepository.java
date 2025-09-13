package com.richardmogou.repository;

import com.richardmogou.entity.Company;
import com.richardmogou.entity.InternshipOffer;
import com.richardmogou.entity.enums.InternshipOfferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long>, JpaSpecificationExecutor<InternshipOffer> {

    // Find offers by company (for company dashboard)
    Page<InternshipOffer> findByCompany(Company company, Pageable pageable);

    // Find offers by status (e.g., find all OPEN offers for students)
    Page<InternshipOffer> findByStatus(InternshipOfferStatus status, Pageable pageable);

    // Find offers by company and status
    Page<InternshipOffer> findByCompanyAndStatus(Company company, InternshipOfferStatus status, Pageable pageable);

    // Note: Complex filtering (domain, duration, location, skills, search keyword)
    // will likely be implemented using JpaSpecificationExecutor in the service layer.
    // Example basic filters (can be combined using specifications):
    Page<InternshipOffer> findByDomainAndStatus(String domain, InternshipOfferStatus status, Pageable pageable);
    Page<InternshipOffer> findByLocationContainingIgnoreCaseAndStatus(String location, InternshipOfferStatus status, Pageable pageable);

}