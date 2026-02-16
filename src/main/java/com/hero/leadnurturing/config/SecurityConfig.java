package com.hero.leadnurturing.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor; 

/**
 * Main security configuration for the application
 * Configures JWT authentication, authorization, and CORS
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    /**
     * Configures HTTP security rules
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Enable CORS for frontend communication
                .cors(cors -> {})
                
                // Disable CSRF (not needed for JWT stateless APIs)
                .csrf(csrf -> csrf.disable())
                
                // Configure URL access rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()                    // Login is public
                        .requestMatchers("/api/dashboard/**").hasRole("HO")         // Only HO can access dashboard
                        .requestMatchers("/api/leads/**").hasAnyRole("HO", "DA")    // Both HO and DA can manage leads
                        .anyRequest().authenticated()                               // All other requests need login
                )
                
                // Use stateless sessions (JWT, no server-side sessions)
                .sessionManagement(sess ->
                        sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Add JWT filter before Spring Security's default filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configures CORS to allow frontend (React) to call backend APIs
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow requests from these origins (frontend URLs)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5177",    // Vite dev server
            "http://localhost:5178",    // Vite dev server (alternate port)
            "http://127.0.0.1:5177",    // Alternative localhost
            "http://127.0.0.1:5178"     // Alternative localhost (alternate port)
        ));
        
        // Allow these HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));
        
        // Allow cookies/credentials
        configuration.setAllowCredentials(true);
        
        // Apply CORS to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    /**
     * Authentication manager for login process
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}