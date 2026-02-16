package com.hero.leadnurturing.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "leads",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "contact_number"),
                @UniqueConstraint(columnNames = "government_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  BASIC DETAILS 

    @Column(name = "contact_number", nullable = false, length = 15)
    private String contactNumber;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "government_id", length = 50)
    private String governmentId;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "address", length = 255)
    private String address;

    //  LEAD DETAILS 

    @Column(name = "model_name", length = 100)
    private String modelName;

    @Column(name = "lead_source", length = 100)
    private String leadSource;

    @Column(name = "lead_mode", length = 50)
    private String leadMode; // ONLINE / OFFLINE

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private LeadStatus status;

    //Audit Fields

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

  
//Timestamp Handling
  @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = LeadStatus.NEW;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
