package com.richardmogou.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class SchoolRegistrationRequest {

    @NotBlank(message = "Contact first name cannot be blank")
    private String contactFirstName;

    @NotBlank(message = "Contact last name cannot be blank")
    private String contactLastName;

    @NotBlank(message = "Contact email cannot be blank")
    @Email(message = "Invalid email format")
    private String contactEmail;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "School name cannot be blank")
    private String schoolName;

    private String schoolDescription;
    private String schoolAddress;
    private String schoolWebsite;

    @NotEmpty(message = "At least one faculty must be provided")
    private List<String> facultyNames;
}