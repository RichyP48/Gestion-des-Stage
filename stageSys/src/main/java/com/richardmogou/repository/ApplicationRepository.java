package com.richardmogou.repository;

import com.richardmogou.entity.Application;
import com.richardmogou.entity.InternshipOffer;
import com.richardmogou.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {

    // Find applications by student (for student dashboard)
    Page<Application> findByStudent(User student, Pageable pageable);

    // Find applications for a specific offer (for company view)
    Page<Application> findByInternshipOffer(InternshipOffer offer, Pageable pageable);

    // Find applications for offers belonging to a specific company (for company dashboard)
    // This requires joining through InternshipOffer
    Page<Application> findByInternshipOffer_Company_Id(Long companyId, Pageable pageable);

    // Check if a student has already applied to a specific offer
    boolean existsByStudentAndInternshipOffer(User student, InternshipOffer offer);

    // Find a specific application by student and offer (might be useful)
    Optional<Application> findByStudentAndInternshipOffer(User student, InternshipOffer offer);

}