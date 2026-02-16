package com.hero.leadnurturing.dto;

import lombok.*;

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
