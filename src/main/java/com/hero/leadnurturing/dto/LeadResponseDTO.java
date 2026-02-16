package com.hero.leadnurturing.dto;

import com.hero.leadnurturing.entity.LeadStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeadResponseDTO {
    
    private Long id;
    private String contactNumber;
    private String firstName;
    private String lastName;
    private String governmentId;
    private String email;
    private String city;
    private String address;
    private String modelName;
    private String leadSource;
    private String leadMode;
    private LocalDate followUpDate;
    private LeadStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
