package com.richardmogou.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
// Note: We don't typically use @RequestBody for multipart/form-data.
// The controller will use @RequestPart for file and other parts.
// This DTO is more for conceptual clarity or if parts are sent as JSON alongside the file.

@Data
@NoArgsConstructor
public class ApplicationRequest {

    // CV is handled as MultipartFile in the controller
    // Offer ID is a path variable in the controller

    @NotBlank(message = "Cover letter cannot be blank")
    private String coverLetter; // Content from rich text editor

    // Student ID is derived from the authenticated user
}