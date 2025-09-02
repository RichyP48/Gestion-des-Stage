package com.richardmogou.service;

import com.richardmogou.entity.InternshipAgreement;
import com.richardmogou.entity.enums.InternshipAgreementStatus;
import com.richardmogou.repository.InternshipAgreementRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private static final Logger log = LoggerFactory.getLogger(ExcelExportService.class);
    private final InternshipAgreementRepository agreementRepository;
    // Inject other repositories if needed for filtering

    // Define headers for the Excel file
    private static final String[] HEADERS = {
            "Agreement ID", "Status", "Application ID", "Student Name", "Student Email",
            "Offer Title", "Offer Domain", "Company Name", "Faculty Validator", "Admin Approver",
            "Application Date", "Agreement Created Date", "Faculty Validation Date", "Admin Approval Date"
    };

    @Transactional(readOnly = true)
    public ByteArrayInputStream generateInternshipReport(Map<String, String> filters) throws IOException {
        log.info("Generating internship report Excel file with filters: {}", filters);

        // TODO: Implement filtering logic based on query parameters (e.g., major/domain, status)
        // This might involve creating Specifications for InternshipAgreement similar to InternshipOffer
        // For now, fetch all APPROVED agreements as an example.
        // TODO: Apply actual filters based on the 'filters' map parameter
        List<InternshipAgreement> agreements = agreementRepository.findAllByStatus(InternshipAgreementStatus.APPROVED); // Use the new method
        log.debug("Found {} approved agreements for export.", agreements.size());


        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Approved Internships");

            // Header Font
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerFont.setColor(IndexedColors.BLACK.getIndex());

            // Header Cell Style
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setBorderBottom(BorderStyle.THIN);
            headerCellStyle.setBorderTop(BorderStyle.THIN);
            headerCellStyle.setBorderLeft(BorderStyle.THIN);
            headerCellStyle.setBorderRight(BorderStyle.THIN);


            // Create Header Row
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
                cell.setCellStyle(headerCellStyle);
            }

             // Date Cell Style
            CellStyle dateCellStyle = workbook.createCellStyle();
            CreationHelper createHelper = workbook.getCreationHelper();
            dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss"));


            // Create Data Rows
            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            for (InternshipAgreement agreement : agreements) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(agreement.getId());
                row.createCell(1).setCellValue(agreement.getStatus().name());
                row.createCell(2).setCellValue(agreement.getApplication().getId());
                row.createCell(3).setCellValue(agreement.getApplication().getStudent().getFirstName() + " " + agreement.getApplication().getStudent().getLastName());
                row.createCell(4).setCellValue(agreement.getApplication().getStudent().getEmail());
                row.createCell(5).setCellValue(agreement.getApplication().getInternshipOffer().getTitle());
                row.createCell(6).setCellValue(agreement.getApplication().getInternshipOffer().getDomain());
                row.createCell(7).setCellValue(agreement.getApplication().getInternshipOffer().getCompany().getName());
                row.createCell(8).setCellValue(agreement.getFacultyValidator() != null ? agreement.getFacultyValidator().getFirstName() + " " + agreement.getFacultyValidator().getLastName() : "N/A");
                row.createCell(9).setCellValue(agreement.getAdminApprover() != null ? agreement.getAdminApprover().getFirstName() + " " + agreement.getAdminApprover().getLastName() : "N/A");

                // Dates
                row.createCell(10).setCellValue(agreement.getApplication().getApplicationDate() != null ? agreement.getApplication().getApplicationDate().format(formatter) : "");
                row.createCell(11).setCellValue(agreement.getCreatedAt() != null ? agreement.getCreatedAt().format(formatter) : "");
                row.createCell(12).setCellValue(agreement.getFacultyValidationDate() != null ? agreement.getFacultyValidationDate().format(formatter) : "");
                row.createCell(13).setCellValue(agreement.getAdminApprovalDate() != null ? agreement.getAdminApprovalDate().format(formatter) : "");

                 // Apply date style (optional, POI might handle strings okay)
                 // Cell cell10 = row.createCell(10); if (agreement.getApplication().getApplicationDate() != null) cell10.setCellValue(agreement.getApplication().getApplicationDate()); cell10.setCellStyle(dateCellStyle);
                 // ... apply for other date cells ...
            }

            // Auto-size columns
            for (int col = 0; col < HEADERS.length; col++) {
                sheet.autoSizeColumn(col);
            }

            workbook.write(out);
            log.info("Excel file generated successfully in memory.");
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            log.error("Error generating Excel report: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate Excel report: " + e.getMessage(), e);
        }
    }
}