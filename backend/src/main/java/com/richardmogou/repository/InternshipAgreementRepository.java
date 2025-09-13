package com.richardmogou.repository;

import com.richardmogou.entity.Application;
import com.richardmogou.entity.InternshipAgreement;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.InternshipAgreementStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Find agreements for students from a specific faculty with a specific status
    Page<InternshipAgreement> findByApplication_Student_FacultyAndStatus(com.richardmogou.entity.Faculty faculty, InternshipAgreementStatus status, Pageable pageable);
    
    // Custom query to find agreements by faculty user email
    @Query("SELECT ia FROM InternshipAgreement ia JOIN ia.application a JOIN a.student s WHERE s.faculty.id = (SELECT u.faculty.id FROM User u WHERE u.email = :facultyEmail) AND ia.status = :status")
    Page<InternshipAgreement> findAgreementsByFacultyEmailAndStatus(@Param("facultyEmail") String facultyEmail, @Param("status") InternshipAgreementStatus status, Pageable pageable);
    
    // Temporary query to find all agreements for testing
    @Query("SELECT ia FROM InternshipAgreement ia WHERE ia.status = :status")
    Page<InternshipAgreement> findAllAgreementsByStatus(@Param("status") InternshipAgreementStatus status, Pageable pageable);

    // Find agreements for a specific company user
    Page<InternshipAgreement> findByApplication_InternshipOffer_Company_PrimaryContactUser(User companyUser, Pageable pageable);

}