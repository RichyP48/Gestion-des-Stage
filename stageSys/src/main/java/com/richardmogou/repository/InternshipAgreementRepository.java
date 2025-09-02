package com.richardmogou.repository;

import com.richardmogou.entity.Application;
import com.richardmogou.entity.InternshipAgreement;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.InternshipAgreementStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InternshipAgreementRepository extends JpaRepository<InternshipAgreement, Long>, JpaSpecificationExecutor<InternshipAgreement> {

    Optional<InternshipAgreement> findByApplication(Application application);

    // Find agreements assigned to a specific faculty validator with a specific status
    Page<InternshipAgreement> findByFacultyValidatorAndStatus(User facultyValidator, InternshipAgreementStatus status, Pageable pageable);

    // Find agreements with a specific status (e.g., PENDING_ADMIN_APPROVAL for admin)
    Page<InternshipAgreement> findByStatus(InternshipAgreementStatus status, Pageable pageable);

    // Find agreements related to a specific student (via Application)
    Page<InternshipAgreement> findByApplication_Student(User student, Pageable pageable);

    // Find all agreements with a specific status (for export)
    List<InternshipAgreement> findAllByStatus(InternshipAgreementStatus status);

}