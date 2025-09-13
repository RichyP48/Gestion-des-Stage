package com.richardmogou.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CompanyRegistrationRequest {

    // User Details (Primary Contact)
    @NotBlank(message = "Contact first name cannot be blank")
    private String contactFirstName;

    @NotBlank(message = "Contact last name cannot be blank")
    private String contactLastName;

    @NotBlank(message = "Contact email cannot be blank")
    @Email(message = "Invalid contact email format")
    private String contactEmail;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private String contactPhoneNumber; // Optional

    // Company Details
    @NotBlank(message = "Company name cannot be blank")
    private String companyName;

    private String companyDescription;
    private String companyWebsite;
    private String companyAddress;
    private String companyIndustrySector;

}