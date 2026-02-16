package com.hero.leadnurturing.service;

import com.hero.leadnurturing.dto.UploadResponseDTO;
import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.entity.LeadStatus;
import com.hero.leadnurturing.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final LeadRepository leadRepository;

    public UploadResponseDTO uploadLeads(MultipartFile file) {

        int totalRecords = 0;
        int successfulRecords = 0;
        int failedRecords = 0;

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // skip header

                totalRecords++;

                try {
                    String contactNumber = getCellString(row.getCell(0));
                    String firstName = getCellString(row.getCell(1));

                    if (contactNumber.isBlank() || firstName.isBlank()) {
                        failedRecords++;
                        continue;
                    }

                    Lead lead = Lead.builder()
                            .contactNumber(contactNumber)
                            .firstName(firstName)
                            .city(getCellString(row.getCell(2)))
                            .modelName(getCellString(row.getCell(3)))
                            .leadSource(getCellString(row.getCell(4)))
                            .status(LeadStatus.NEW)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    leadRepository.save(lead);
                    successfulRecords++;
                } catch (Exception e) {
                    failedRecords++;
                }
            }

            return UploadResponseDTO.builder()
                    .success(failedRecords == 0)
                    .message("File uploaded successfully. " + successfulRecords + " records processed.")
                    .totalRecords(totalRecords)
                    .successfulRecords(successfulRecords)
                    .failedRecords(failedRecords)
                    .build();

        } catch (Exception e) {
            return UploadResponseDTO.builder()
                    .success(false)
                    .message("File processing failed: " + e.getMessage())
                    .totalRecords(0)
                    .successfulRecords(0)
                    .failedRecords(0)
                    .build();
        }
    }

    private String getCellString(Cell cell) {
        if (cell == null) {
            return "";
        }

        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                double value = cell.getNumericCellValue();
                if (value == Math.floor(value)) {
                    yield String.valueOf((long) value);
                }
                yield String.valueOf(value);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> getFormulaValue(cell);
            default -> "";
        };
    }

    private String getFormulaValue(Cell cell) {
        try {
            return switch (cell.getCachedFormulaResultType()) {
                case STRING -> cell.getStringCellValue().trim();
                case NUMERIC -> {
                    double value = cell.getNumericCellValue();
                    if (value == Math.floor(value)) {
                        yield String.valueOf((long) value);
                    }
                    yield String.valueOf(value);
                }
                case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
                default -> "";
            };
        } catch (IllegalStateException ex) {
            return "";
        }
    }
}
