package com.richardmogou.controller;

import com.richardmogou.service.ExcelExportService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminReportController {

    private static final Logger log = LoggerFactory.getLogger(AdminReportController.class);
    private final ExcelExportService excelExportService;
    // Inject services for stats endpoints later

    /**
     * GET /api/admin/reports : Get comprehensive admin reports data.
     */
    @GetMapping("/reports")
    public ResponseEntity<?> getReports(@RequestParam(defaultValue = "month") String period) {
        log.info("Admin request for reports with period: {}", period);
        
        // Mock data for now - replace with actual service calls
        Map<String, Object> reportData = Map.of(
            "systemStats", Map.of(
                "totalUsers", 456,
                "totalStudents", 245,
                "totalCompanies", 67,
                "totalFaculty", 23,
                "totalOffers", 189,
                "totalApplications", 567,
                "totalAgreements", 234
            ),
            "userActivity", Map.of(
                "dailyLogins", 89,
                "weeklyLogins", 234,
                "monthlyLogins", 1245
            ),
            "platformUsage", java.util.List.of(
                Map.of("month", "Janvier", "users", 234, "offers", 45, "applications", 123),
                Map.of("month", "Février", "users", 267, "offers", 52, "applications", 145),
                Map.of("month", "Mars", "users", 289, "offers", 48, "applications", 167),
                Map.of("month", "Avril", "users", 312, "offers", 61, "applications", 189),
                Map.of("month", "Mai", "users", 345, "offers", 58, "applications", 201)
            ),
            "topCompanies", java.util.List.of(
                Map.of("name", "TechCorp Solutions", "offers", 25, "applications", 89, "rating", 4.8),
                Map.of("name", "InnovateLab", "offers", 18, "applications", 67, "rating", 4.6),
                Map.of("name", "DataSolutions Inc", "offers", 15, "applications", 54, "rating", 4.4),
                Map.of("name", "WebAgency Pro", "offers", 12, "applications", 43, "rating", 4.2),
                Map.of("name", "StartupXYZ", "offers", 10, "applications", 38, "rating", 4.0)
            ),
            "systemHealth", Map.of(
                "uptime", 99.8,
                "responseTime", 245,
                "errorRate", 0.2,
                "storage", 67
            ),
            "agreementStats", Map.of(
                "totalAgreements", 234,
                "pendingAgreements", 45,
                "approvedAgreements", 189,
                "rejectedAgreements", 12,
                "signedAgreements", 156
            )
        );
        
        return ResponseEntity.ok(reportData);
    }

    /**
     * GET /api/admin/reports/export : Export admin report as PDF.
     */
    @GetMapping("/reports/export")
    public ResponseEntity<Resource> exportReport(@RequestParam(defaultValue = "month") String period) {
        log.info("Admin request to export report for period: {}", period);
        
        // Mock PDF export - replace with actual implementation
        String mockPdf = "Mock PDF content for period: " + period;
        ByteArrayInputStream in = new ByteArrayInputStream(mockPdf.getBytes());
        Resource resource = new InputStreamResource(in);
        
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String filename = "rapport-admin-" + period + "-" + timestamp + ".pdf";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    /**
     * GET /api/admin/reports/internships/export : Export internship data as Excel.
     */
    @GetMapping("/reports/internships/export")
    public ResponseEntity<Resource> exportInternshipsToExcel(
            @RequestParam(required = false) Map<String, String> filters) {

        log.info("Admin request to export internships to Excel with filters: {}", filters);
        try {
            ByteArrayInputStream in = excelExportService.generateInternshipReport(filters);
            Resource resource = new InputStreamResource(in);

            // Generate filename
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String filename = "internship_report_" + timestamp + ".xlsx";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(resource);

        } catch (IOException e) {
            log.error("Error generating Excel export: {}", e.getMessage(), e);
            String errorMsg = "Failed to generate Excel report: " + e.getMessage();
            // Returning an error message within a standard response might be better for frontend
            return ResponseEntity.internalServerError().body(new InputStreamResource(new ByteArrayInputStream(errorMsg.getBytes())));
        } catch (Exception e) {
             log.error("Unexpected error during Excel export", e);
             String errorMsg = "An unexpected error occurred during export.";
             return ResponseEntity.internalServerError().body(new InputStreamResource(new ByteArrayInputStream(errorMsg.getBytes())));
        }
    }

    /**
     * GET /api/admin/reports/stats/internships-by-major : Get aggregated data for charts.
     * TODO: Implement this endpoint. Requires aggregation query in repository/service.
     */
    @GetMapping("/reports/stats/internships-by-major")
    public ResponseEntity<?> getStatsInternshipsByMajor() {
        log.info("Admin request for internships-by-major stats");
        // TODO: Implement service logic to query and aggregate data
        // Example response structure:
        // Map<String, Long> stats = Map.of("Computer Science", 15L, "Marketing", 8L, "Finance", 12L);
        return ResponseEntity.ok("Stats endpoint not yet implemented."); // Placeholder
    }

    /**
     * GET /api/admin/reports/stats/agreement-status : Get counts of agreements by status.
     * TODO: Implement this endpoint. Requires aggregation query in repository/service.
     */
    @GetMapping("/reports/stats/agreement-status")
    public ResponseEntity<?> getStatsAgreementStatus() {
         log.info("Admin request for agreement-status stats");
         // TODO: Implement service logic to query and aggregate data
         // Example response structure:
         // Map<String, Long> stats = Map.of("APPROVED", 50L, "PENDING_ADMIN_APPROVAL", 5L, "REJECTED", 10L);
        return ResponseEntity.ok("Stats endpoint not yet implemented."); // Placeholder
    }
}