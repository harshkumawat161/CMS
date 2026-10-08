package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "System", description = "Health checks and platform metadata")
public class HealthController {

    @Value("${spring.application.name:portfolio-backend}")
    private String applicationName;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Returns system liveness status")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Application is healthy and running")
    })
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @GetMapping("/info")
    @Operation(summary = "System information", description = "Returns application profile and metadata")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Application metadata retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> systemInfo() {
        Map<String, Object> infoData = Map.of(
                "application", applicationName,
                "version", "1.0.0",
                "activeProfile", activeProfile,
                "javaVersion", System.getProperty("java.version"),
                "timestamp", Instant.now().toString()
        );
        return ResponseEntity.ok(ApiResponse.success("Application metadata retrieved", infoData));
    }
}
