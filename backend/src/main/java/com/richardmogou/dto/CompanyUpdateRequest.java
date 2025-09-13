package com.richardmogou.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CompanyUpdateRequest {

    // Company name change might need admin approval or checks, not included here by default.
    // @NotBlank(message = "Company name cannot be blank")
    // private String name;

    private String description;
    private String website;
    private String address;
    private String industrySector;

    // Changing the primary contact user would likely be an admin function or a separate process.
}