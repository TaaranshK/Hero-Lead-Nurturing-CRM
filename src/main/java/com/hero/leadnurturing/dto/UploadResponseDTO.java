package com.hero.leadnurturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response DTO for file upload
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadResponseDTO {
    
    private boolean success;
    private String message;
    private int totalRecords;
    private int successfulRecords;
    private int failedRecords;
}