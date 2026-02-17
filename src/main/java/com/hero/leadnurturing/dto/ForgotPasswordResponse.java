package com.hero.leadnurturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordResponse {
    private boolean success;
    private String message;
    private String otpSentTo; // Email or username
    private String otp; // (dev) returned for testing — remove in production
}
