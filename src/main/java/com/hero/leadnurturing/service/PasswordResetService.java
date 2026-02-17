package com.hero.leadnurturing.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;
import com.hero.leadnurturing.entity.User;
import com.hero.leadnurturing.repository.UserRepository;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    // In-memory OTP storage (email -> {otp, expiry_time})
    private final Map<String, OtpData> otpStorage = new HashMap<>();

    public PasswordResetService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Generate and store OTP for forgot password
     */
    public String generateAndStoreOtp(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        
        // Store OTP with 10-minute expiry
        long expiryTime = System.currentTimeMillis() + (10 * 60 * 1000);
        otpStorage.put(username, new OtpData(otp, expiryTime));

        // In production, send via email/SMS
        System.out.println("OTP for " + username + ": " + otp);
        
        return otp; // For testing only, remove in production
    }

    /**
     * Verify OTP
     */
    public boolean verifyOtp(String username, String otp) {
        OtpData otpData = otpStorage.get(username);
        
        if (otpData == null) {
            return false;
        }

        // Check if OTP expired
        if (System.currentTimeMillis() > otpData.expiryTime) {
            otpStorage.remove(username);
            return false;
        }

        // Check if OTP matches
        return otpData.otp.equals(otp);
    }

    /**
     * Reset password after OTP verification
     */
    public void resetPassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Clear OTP after successful reset
        otpStorage.remove(username);
    }

    /**
     * Inner class to store OTP and expiry time
     */
    private static class OtpData {
        String otp;
        long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}
