package com.richardmogou.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String name;

    // No relationship back to Offer needed here if we store skills as text in Offer
    // If ManyToMany is desired, add:
    // @ManyToMany(mappedBy = "requiredSkills") // Assuming 'requiredSkills' field in InternshipOffer is List<Skill>
    // private List<InternshipOffer> offersRequiringSkill = new ArrayList<>();
}