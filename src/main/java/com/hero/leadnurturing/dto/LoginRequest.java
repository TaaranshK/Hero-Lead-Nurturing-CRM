package com.hero.leadnurturing.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Login request DTO
 */
@Getter
@Setter
public class LoginRequest {
    private String username;
    private String password;
}