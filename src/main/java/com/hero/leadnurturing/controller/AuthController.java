package com.hero.leadnurturing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hero.leadnurturing.config.JwtUtil;
import com.hero.leadnurturing.dto.LoginRequest;
import com.hero.leadnurturing.dto.LoginResponse;
import com.hero.leadnurturing.dto.ForgotPasswordRequest;
import com.hero.leadnurturing.dto.ForgotPasswordResponse;
import com.hero.leadnurturing.dto.VerifyOtpRequest;
import com.hero.leadnurturing.dto.ResetPasswordRequest;
import com.hero.leadnurturing.dto.ApiResponse;
import com.hero.leadnurturing.entity.User;
import com.hero.leadnurturing.service.UserService;
import com.hero.leadnurturing.service.PasswordResetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userService.findByUsername(request.getUsername());
        String token = jwtUtil.generateToken(user.getUsername());

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {
        try {
            // verify username exists and email matches the user record
            User user = userService.findByUsername(request.getUsername());
            if (user.getEmail() == null || !user.getEmail().equalsIgnoreCase(request.getEmail())) {
                return ResponseEntity.badRequest().body(ApiResponse.<ForgotPasswordResponse>builder()
                        .success(false)
                        .message("Username and email do not match")
                        .build());
            }

            String otp = passwordResetService.generateAndStoreOtp(request.getUsername());
            
            ForgotPasswordResponse response = ForgotPasswordResponse.builder()
                    .success(true)
                    .message("OTP sent successfully")
                    .otpSentTo(maskEmail(user.getEmail()))
                    .otp(otp) // include OTP in response for local testing
                    .build();

            return ResponseEntity.ok(ApiResponse.<ForgotPasswordResponse>builder()
                    .success(true)
                    .message("OTP generated and sent to: " + maskEmail(user.getEmail()))
                    .data(response)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<ForgotPasswordResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(
            @RequestBody VerifyOtpRequest request) {
        try {
            boolean isValid = passwordResetService.verifyOtp(request.getUsername(), request.getOtp());
            
            if (!isValid) {
                return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                        .success(false)
                        .message("Invalid or expired OTP")
                        .build());
            }

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .success(true)
                    .message("OTP verified successfully")
                    .data("OTP verified")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @RequestBody ResetPasswordRequest request) {
        try {
            // Validate passwords match
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                        .success(false)
                        .message("Passwords do not match")
                        .build());
            }

            // Validate password length
            if (request.getNewPassword().length() < 4) {
                return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                        .success(false)
                        .message("Password must be at least 4 characters")
                        .build());
            }

            passwordResetService.resetPassword(request.getUsername(), request.getNewPassword());

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .success(true)
                    .message("Password reset successfully")
                    .data("Password updated")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    // Helper method to mask email
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        
        if (name.length() <= 2) {
            return "*@" + domain;
        }
        
        return name.charAt(0) + "*****@" + domain;
    }
}
