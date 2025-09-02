package com.richardmogou.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class InternshipOfferRequest {

    @NotBlank(message = "Offer title cannot be blank")
    private String title;

    @NotBlank(message = "Offer description cannot be blank")
    private String description;

    // Consider using a List<String> and potentially validating against a predefined Skill list
    private String requiredSkills; // e.g., "Java, Spring Boot, SQL" or JSON array string

    @NotBlank(message = "Domain cannot be blank")
    private String domain; // e.g., "Computer Science", "Marketing"

    @NotBlank(message = "Location cannot be blank")
    private String location; // e.g., "Remote", "New York, NY"

    @NotBlank(message = "Duration cannot be blank")
    private String duration; // e.g., "3 months", "June-August"

    // @FutureOrPresent(message = "Start date must be in the present or future") // Uncomment if validation needed
    private LocalDate startDate; // Optional

    // Status is usually set internally (e.g., DRAFT or OPEN), not directly by request on creation
    // @NotNull(message = "Status cannot be null")
    // private InternshipOfferStatus status = InternshipOfferStatus.DRAFT;

    // Company ID is derived from the authenticated user, not passed in request body
}