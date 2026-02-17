package com.hero.leadnurturing.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hero.leadnurturing.entity.ChatMessage;
import com.hero.leadnurturing.entity.Lead;
import com.hero.leadnurturing.entity.LeadModification;
import com.hero.leadnurturing.entity.LeadStatus;
import com.hero.leadnurturing.entity.User;
import com.hero.leadnurturing.entity.UserRole;
import com.hero.leadnurturing.repository.ChatMessageRepository;
import com.hero.leadnurturing.repository.LeadModificationRepository;
import com.hero.leadnurturing.repository.LeadRepository;
import com.hero.leadnurturing.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Initializes default users and sample data on application startup
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LeadRepository leadRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final LeadModificationRepository leadModificationRepository;

    /**
     * Runs on application startup to create default users and populate sample data
     */
    @Override
    public void run(String... args) {

        // Ensure test users exist and have emails (idempotent)
        if (userRepository.count() == 0) {

            // Create Head Office admin user
            User hoUser = User.builder()
                    .username("ho_admin")
                    .email("admin@hero.com")
                    .password(passwordEncoder.encode("1234"))
                    .role(UserRole.ROLE_HO)
                    .build();

            // Create Dealer Agent user
            User daUser = User.builder()
                    .username("da_agent")
                    .email("agent@hero.com")
                    .password(passwordEncoder.encode("1234"))
                    .role(UserRole.ROLE_DA)
                    .build();

            // Save users to database
            userRepository.save(hoUser);
            userRepository.save(daUser);

            System.out.println("Test users created!");
        } else {
            // If users already exist, ensure their emails are populated (helps when DataInitializer was updated)
            userRepository.findByUsername("ho_admin").ifPresent(u -> {
                boolean changed = false;
                if (u.getEmail() == null || u.getEmail().isEmpty()) {
                    u.setEmail("admin@hero.com");
                    changed = true;
                    System.out.println("Updated ho_admin email");
                }
                // Ensure demo password is set correctly for local testing
                u.setPassword(passwordEncoder.encode("1234"));
                changed = true;
                if (changed) {
                    userRepository.save(u);
                }
            });

            userRepository.findByUsername("da_agent").ifPresent(u -> {
                boolean changed = false;
                if (u.getEmail() == null || u.getEmail().isEmpty()) {
                    u.setEmail("agent@hero.com");
                    changed = true;
                    System.out.println("Updated da_agent email");
                }
                // Ensure demo password is set correctly for local testing
                u.setPassword(passwordEncoder.encode("1234"));
                changed = true;
                if (changed) {
                    userRepository.save(u);
                }
            });
        }

        // Check if leads already exist
        if (leadRepository.count() == 0) {
            createSampleLeads();
        }
    }

    /**
     * Creates comprehensive sample lead data for dashboard demonstration
     */
    private void createSampleLeads() {
        List<Lead> leads = new ArrayList<>();
        String[] cities = {"Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"};
        String[] modelNames = {"Model X", "Model Y", "Model Z", "Model S", "Model 3"};
        String[] leadSources = {"Online", "Dealership", "Facebook", "Google", "WhatsApp", "Referral"};
        String[] lastNames = {"Sharma", "Patel", "Singh", "Gupta", "Kumar", "Verma", "Rao", "Nair"};

        LocalDateTime now = LocalDateTime.now();
        int leadCounter = 1;

        // Create QUALIFIED leads
        for (int i = 0; i < 15; i++) {
            Lead lead = Lead.builder()
                    .contactNumber(String.format("91%010d", 9000000000L + leadCounter++))
                    .firstName("Customer" + (i + 1))
                    .lastName(lastNames[i % lastNames.length])
                    .email("customer" + (i + 1) + "@example.com")
                    .city(cities[i % cities.length])
                    .address("Address Line " + (i + 1) + ", " + cities[i % cities.length])
                    .modelName(modelNames[i % modelNames.length])
                    .leadSource(leadSources[i % leadSources.length])
                    .leadMode(i % 2 == 0 ? "ONLINE" : "OFFLINE")
                    .status(LeadStatus.QUALIFIED)
                    .governmentId("ID" + String.format("%09d", i + 1000))
                    .followUpDate(LocalDate.now().plusDays(5 + (i % 10)))
                    .createdAt(now.minusDays(30 - (i % 30)))
                    .updatedAt(now.minusDays(15 - (i % 15)))
                    .build();
            leads.add(lead);
        }

        // Create UNQUALIFIED leads
        for (int i = 0; i < 10; i++) {
            Lead lead = Lead.builder()
                    .contactNumber(String.format("91%010d", 9000000000L + leadCounter++))
                    .firstName("Prospect" + (i + 1))
                    .lastName(lastNames[(i + 5) % lastNames.length])
                    .email("prospect" + (i + 1) + "@example.com")
                    .city(cities[(i + 3) % cities.length])
                    .address("Address Line " + (i + 100) + ", " + cities[(i + 3) % cities.length])
                    .modelName(modelNames[(i + 2) % modelNames.length])
                    .leadSource(leadSources[(i + 1) % leadSources.length])
                    .leadMode(i % 2 == 0 ? "ONLINE" : "OFFLINE")
                    .status(LeadStatus.UNQUALIFIED)
                    .governmentId("ID" + String.format("%09d", i + 2000))
                    .followUpDate(LocalDate.now().plusDays(10))
                    .createdAt(now.minusDays(25))
                    .updatedAt(now.minusDays(10))
                    .build();
            leads.add(lead);
        }

        // Create NEW leads
        for (int i = 0; i < 20; i++) {
            Lead lead = Lead.builder()
                    .contactNumber(String.format("91%010d", 9000000000L + leadCounter++))
                    .firstName("NewLead" + (i + 1))
                    .lastName(lastNames[i % lastNames.length])
                    .email("newlead" + (i + 1) + "@example.com")
                    .city(cities[(i + 2) % cities.length])
                    .address("Address Line " + (i + 200) + ", " + cities[(i + 2) % cities.length])
                    .modelName(modelNames[i % modelNames.length])
                    .leadSource(leadSources[(i + 3) % leadSources.length])
                    .leadMode(i % 2 == 0 ? "ONLINE" : "OFFLINE")
                    .status(LeadStatus.NEW)
                    .governmentId("ID" + String.format("%09d", i + 3000))
                    .followUpDate(LocalDate.now().plusDays(7))
                    .createdAt(now.minusDays(5 - (i % 5)))
                    .updatedAt(now.minusDays(3))
                    .build();
            leads.add(lead);
        }

        // Create LOST leads
        for (int i = 0; i < 5; i++) {
            Lead lead = Lead.builder()
                    .contactNumber(String.format("91%010d", 9000000000L + leadCounter++))
                    .firstName("LostLead" + (i + 1))
                    .lastName(lastNames[(i + 2) % lastNames.length])
                    .email("lostlead" + (i + 1) + "@example.com")
                    .city(cities[(i + 4) % cities.length])
                    .address("Address Line " + (i + 300) + ", " + cities[(i + 4) % cities.length])
                    .modelName(modelNames[(i + 1) % modelNames.length])
                    .leadSource(leadSources[(i + 2) % leadSources.length])
                    .leadMode("OFFLINE")
                    .status(LeadStatus.LOST)
                    .governmentId("ID" + String.format("%09d", i + 4000))
                    .followUpDate(LocalDate.now().minusDays(30))
                    .createdAt(now.minusDays(60))
                    .updatedAt(now.minusDays(20))
                    .build();
            leads.add(lead);
        }

        // Save all leads
        List<Lead> savedLeads = leadRepository.saveAll(leads);
        System.out.println("Sample leads created: " + savedLeads.size());

        // Add chat messages for some leads
        for (int i = 0; i < Math.min(10, savedLeads.size()); i++) {
            Lead lead = savedLeads.get(i);
            
            // Add multiple messages per lead
            for (int j = 0; j < 3; j++) {
                ChatMessage message = ChatMessage.builder()
                        .lead(lead)
                        .sender(j % 2 == 0 ? "ho_admin" : "da_agent")
                        .message("Message " + (j + 1) + " for lead " + lead.getFirstName() + ": Discussing vehicle details and pricing.")
                        .timestamp(now.minusDays(5 - j))
                        .build();
                chatMessageRepository.save(message);
            }
        }
        System.out.println("Chat messages created!");

        // Add modification history for some leads
        for (int i = 0; i < Math.min(5, savedLeads.size()); i++) {
            Lead lead = savedLeads.get(i);
            
            // Add status change history
            LeadModification modification = LeadModification.builder()
                    .lead(lead)
                    .modifiedBy("ho_admin")
                    .modifiedField("status")
                    .oldValue("NEW")
                    .newValue(lead.getStatus().toString())
                    .modifiedAt(now.minusDays(3))
                    .build();
            leadModificationRepository.save(modification);
        }
        System.out.println("Lead modifications created!");
    }
}