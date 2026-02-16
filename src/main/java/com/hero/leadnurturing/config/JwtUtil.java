package com.hero.leadnurturing.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

/**
 * Utility class for JWT token operations
 * Handles token generation, validation, and extraction
 */
@Component
public class JwtUtil {

    // Secret key from application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Token expiration time (30 minutes)
    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey key;

    /**
     * Initialize the secret key after properties are loaded
     */
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Generate JWT token for a username
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)                                          // Set username
                .issuedAt(new Date())                                       // Set creation time
                .expiration(new Date(System.currentTimeMillis() + expiration)) // Set expiry
                .signWith(key)                                              // Sign with secret key
                .compact();
    }

    /**
     * Extract username from token
     */
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * Validate if token is valid and not expired
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}