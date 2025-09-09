package com.richardmogou.service;

import com.richardmogou.entity.Application;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PdfGenerationService {

    private static final Logger log = LoggerFactory.getLogger(PdfGenerationService.class);
    private static final String AGREEMENTS_DIR = "agreements";

    public String generateAgreementPdf(Application application) throws IOException {
        log.info("Generating PDF for application ID: {}", application.getId());
        
        // Create agreements directory if it doesn't exist
        Path agreementsPath = Paths.get(AGREEMENTS_DIR);
        if (!Files.exists(agreementsPath)) {
            Files.createDirectories(agreementsPath);
        }
        
        // Generate filename
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = String.format("agreement_%d_%s.pdf", application.getId(), timestamp);
        Path filePath = agreementsPath.resolve(filename);
        
        // For now, create a simple text file as placeholder
        // In a real implementation, you would use a PDF library like iText or Apache PDFBox
        String content = generateAgreementContent(application);
        Files.write(filePath, content.getBytes());
        
        log.info("PDF generated successfully: {}", filePath.toString());
        return filePath.toString();
    }
    
    private String generateAgreementContent(Application application) {
        return String.format("""
            CONVENTION DE STAGE
            
            Étudiant: %s %s
            Entreprise: %s
            Offre: %s
            
            Date de génération: %s
            
            Cette convention sera remplacée par un vrai PDF dans une implémentation complète.
            """,
            application.getStudent().getFirstName(),
            application.getStudent().getLastName(),
            application.getInternshipOffer().getCompany().getName(),
            application.getInternshipOffer().getTitle(),
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
        );
    }
}