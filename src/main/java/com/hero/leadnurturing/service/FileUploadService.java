package com.hero.leadnurturing.service;

import com.hero.leadnurturing.dto.UploadResponseDTO;
import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

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
                    Lead lead = Lead.builder()
                            .contactNumber(row.getCell(0).getStringCellValue())
                            .firstName(row.getCell(1).getStringCellValue())
                            .city(row.getCell(2).getStringCellValue())
                            .modelName(row.getCell(3).getStringCellValue())
                            .leadSource(row.getCell(4).getStringCellValue())
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
}
