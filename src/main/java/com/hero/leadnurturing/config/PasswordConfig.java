package com.hero.leadnurturing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Password encryption configuration
 * Uses BCrypt algorithm to securely hash passwords
 */
@Configuration
public class PasswordConfig {

    /**
     * Creates password encoder bean for encrypting/verifying passwords
     * BCrypt automatically adds salt and is one-way (cannot be decrypted)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}