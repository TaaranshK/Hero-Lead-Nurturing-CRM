package com.hero.leadnurturing.dto;

import lombok.*;

/**
 * Generic API response wrapper
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}