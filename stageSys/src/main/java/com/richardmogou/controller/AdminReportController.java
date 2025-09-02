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
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminReportController {

    private static final Logger log = LoggerFactory.getLogger(AdminReportController.class);
    private final ExcelExportService excelExportService;
    // Inject services for stats endpoints later

    /**
     * GET /api/admin/reports/internships/export : Export internship data as Excel.
     */
    @GetMapping("/internships/export")
    public ResponseEntity<Resource> exportInternshipsToExcel(
            @RequestParam(required = false) Map<String, String> filters) { // Capture filters like ?major=..., ?status=...

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
    @GetMapping("/stats/internships-by-major")
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
    @GetMapping("/stats/agreement-status")
    public ResponseEntity<?> getStatsAgreementStatus() {
         log.info("Admin request for agreement-status stats");
         // TODO: Implement service logic to query and aggregate data
         // Example response structure:
         // Map<String, Long> stats = Map.of("APPROVED", 50L, "PENDING_ADMIN_APPROVAL", 5L, "REJECTED", 10L);
        return ResponseEntity.ok("Stats endpoint not yet implemented."); // Placeholder
    }
}