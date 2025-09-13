package com.richardmogou.entity;

import com.richardmogou.entity.enums.ApplicationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_user_id", nullable = false)
    private User student; // User with STUDENT role

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_offer_id", nullable = false)
    private InternshipOffer internshipOffer;

    @NotBlank
    @Column(nullable = false)
    private String cvPath; // Path/URL to the stored CV file

    @Column(columnDefinition = "TEXT")
    private String coverLetter; // Content from rich text editor

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @NotNull
    @Column(nullable = false, updatable = false) // Application date shouldn't change
    private LocalDateTime applicationDate = LocalDateTime.now(); // Set on creation

    @Column(columnDefinition = "TEXT")
    private String companyFeedback;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private InternshipAgreement agreement;

    @OneToMany(mappedBy = "relatedApplication", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Message> messages = new ArrayList<>();

}