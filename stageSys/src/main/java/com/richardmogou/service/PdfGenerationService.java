package com.richardmogou.service;

import com.richardmogou.entity.Application;
import com.richardmogou.entity.Company;
import com.richardmogou.entity.InternshipOffer;
import com.richardmogou.entity.User;
import com.richardmogou.exception.FileStorageException;
import jakarta.annotation.PostConstruct;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class PdfGenerationService {

    private static final Logger log = LoggerFactory.getLogger(PdfGenerationService.class);
    private final Path agreementStorageLocation;

    public PdfGenerationService(@Value("${file.agreement-dir}") String agreementDir) {
        this.agreementStorageLocation = Paths.get(agreementDir).toAbsolutePath().normalize();
        log.info("Agreement storage location initialized at: {}", this.agreementStorageLocation);
    }

     @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.agreementStorageLocation);
            log.info("Created agreement storage directory: {}", this.agreementStorageLocation);
        } catch (Exception ex) {
            log.error("Could not create the directory for agreement PDFs.", ex);
            throw new FileStorageException("Could not create the directory for agreement PDFs.", ex);
        }
    }


    /**
     * Generates an internship agreement PDF based on application details.
     *
     * @param application The application for which to generate the agreement.
     * @return The unique filename (including .pdf extension) under which the file is stored.
     * @throws IOException If an error occurs during PDF generation or saving.
     */
    public String generateAgreementPdf(Application application) throws IOException {
        User student = application.getStudent();
        InternshipOffer offer = application.getInternshipOffer();
        Company company = offer.getCompany();
        String uniqueFilename = "agreement-" + UUID.randomUUID().toString() + ".pdf";
        Path targetPath = this.agreementStorageLocation.resolve(uniqueFilename);

        log.info("Generating agreement PDF for application ID: {}, saving to: {}", application.getId(), targetPath);

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA); // Use standard font
            PDType1Font boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                float yPosition = 750; // Starting Y position (from top)
                float margin = 50;
                float width = page.getMediaBox().getWidth() - 2 * margin;
                float leading = 14.5f; // Line spacing

                // Title
                contentStream.beginText();
                contentStream.setFont(boldFont, 16);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Internship Agreement");
                contentStream.endText();
                yPosition -= leading * 2;

                // Basic Content (Add more details as required)
                contentStream.beginText();
                contentStream.setFont(font, 12);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("This agreement confirms the internship details between:");
                contentStream.endText();
                yPosition -= leading * 1.5f;

                // Student Details
                contentStream.beginText();
                contentStream.setFont(boldFont, 12);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Student:");
                contentStream.setFont(font, 12);
                contentStream.showText(" " + student.getFirstName() + " " + student.getLastName() + " (" + student.getEmail() + ")");
                contentStream.endText();
                yPosition -= leading;

                 // Company Details
                contentStream.beginText();
                contentStream.setFont(boldFont, 12);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Company:");
                 contentStream.setFont(font, 12);
                contentStream.showText(" " + company.getName());
                 if (company.getAddress() != null) contentStream.showText(", " + company.getAddress());
                contentStream.endText();
                yPosition -= leading * 1.5f;

                // Offer Details
                contentStream.beginText();
                contentStream.setFont(boldFont, 12);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Internship Offer:");
                contentStream.setFont(font, 12);
                contentStream.showText(" " + offer.getTitle());
                contentStream.endText();
                yPosition -= leading;

                contentStream.beginText();
                contentStream.setFont(font, 12);
                contentStream.newLineAtOffset(margin + 10, yPosition); // Indent details
                contentStream.showText("Domain: " + offer.getDomain());
                contentStream.newLineAtOffset(0, -leading);
                contentStream.showText("Location: " + offer.getLocation());
                 contentStream.newLineAtOffset(0, -leading);
                contentStream.showText("Duration: " + offer.getDuration());
                 if (offer.getStartDate() != null) {
                     contentStream.newLineAtOffset(0, -leading);
                     contentStream.showText("Start Date: " + offer.getStartDate().format(DateTimeFormatter.ISO_DATE));
                 }
                contentStream.endText();
                yPosition -= leading * (offer.getStartDate() != null ? 4 : 3);
                yPosition -= leading; // Extra space


                // Placeholder for terms, responsibilities, signatures etc.
                contentStream.beginText();
                contentStream.setFont(font, 10);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Further terms and conditions apply...");
                contentStream.newLineAtOffset(0, -leading * 2);
                contentStream.showText("Signatures:");
                 contentStream.newLineAtOffset(0, -leading * 3);
                 contentStream.showText("_________________________        _________________________");
                 contentStream.newLineAtOffset(0, -leading);
                 contentStream.showText("Student Signature                Company Representative");

                contentStream.endText();

            } // contentStream closed automatically

            document.save(targetPath.toFile());
            log.info("Agreement PDF generated successfully: {}", uniqueFilename);

        } // document closed automatically

        return uniqueFilename; // Return the name for storage in the Agreement entity
    }

     // Method to delete agreement PDF (if needed when agreement is deleted/rejected)
     public boolean deleteAgreementPdf(String filename) {
         try {
            Path filePath = this.agreementStorageLocation.resolve(filename).normalize();
             log.debug("Attempting to delete agreement PDF: {}", filePath);
            boolean deleted = Files.deleteIfExists(filePath);
             if (deleted) {
                 log.info("Successfully deleted agreement PDF: {}", filename);
             } else {
                 log.warn("Agreement PDF not found for deletion or already deleted: {}", filename);
             }
             return deleted;
        } catch (IOException ex) {
            log.error("Could not delete agreement PDF {}. Please try again!", filename, ex);
             return false;
        }
     }
}