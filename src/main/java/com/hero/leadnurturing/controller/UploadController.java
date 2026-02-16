package com.hero.leadnurturing.controller;

import com.hero.leadnurturing.dto.ApiResponse;
import com.hero.leadnurturing.dto.UploadResponseDTO;
import com.hero.leadnurturing.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileUploadService fileUploadService;

    @PostMapping
    public ApiResponse<UploadResponseDTO> uploadFile(@RequestParam("file") MultipartFile file) {
        UploadResponseDTO result = fileUploadService.uploadLeads(file);
        return ApiResponse.<UploadResponseDTO>builder()
                .success(result.isSuccess())
                .message(result.getMessage())
                .data(result)
                .build();
    }
}
