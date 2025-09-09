package com.richardmogou.dto;

import com.richardmogou.entity.Company;
import com.richardmogou.enums.CompanyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private Long id;
    private String name;
    private String description;
    private String website;
    private String address;
    private String industrySector;
    private CompanyStatus status;
    private Long primaryContactUserId; // ID of the contact user
    private String primaryContactUserEmail; // Email of the contact user
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Factory method to convert Company entity to CompanyResponse DTO
    public static CompanyResponse fromEntity(Company company) {
        if (company == null) {
            return null;
        }
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .website(company.getWebsite())
                .address(company.getAddress())
                .industrySector(company.getIndustrySector())
                .status(company.getStatus())
                .primaryContactUserId(company.getPrimaryContactUser() != null ? company.getPrimaryContactUser().getId() : null)
                .primaryContactUserEmail(company.getPrimaryContactUser() != null ? company.getPrimaryContactUser().getEmail() : null)
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}