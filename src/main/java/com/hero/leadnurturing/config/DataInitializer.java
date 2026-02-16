package com.hero.leadnurturing.config;

import com.hero.leadnurturing.entity.User;
import com.hero.leadnurturing.entity.UserRole;
import com.hero.leadnurturing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.count() == 0) {

            User hoUser = User.builder()
                    .username("ho_admin")
                    .password(passwordEncoder.encode("1234"))
                    .role(UserRole.ROLE_HO)
                    .build();

            User daUser = User.builder()
                    .username("da_agent")
                    .password(passwordEncoder.encode("1234"))
                    .role(UserRole.ROLE_DA)
                    .build();

            userRepository.save(hoUser);
            userRepository.save(daUser);

            System.out.println("Test users created!");
        }
    }
}
