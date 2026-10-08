package com.portfolio.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Indicates failure", example = "false")
    private boolean success = false;

    @io.swagger.v3.oas.annotations.media.Schema(description = "High-level error explanation", example = "Validation failed for request fields")
    private String message;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Timestamp when error occurred", example = "2026-10-07T14:30:00Z")
    private Instant timestamp = Instant.now();

    @io.swagger.v3.oas.annotations.media.Schema(description = "Requested resource URI path", example = "/api/contact")
    private String path;

    @io.swagger.v3.oas.annotations.media.Schema(description = "HTTP status code", example = "400")
    private Integer status;

    @io.swagger.v3.oas.annotations.media.Schema(description = "Field-level validation error map if applicable")
    private Map<String, String> errors;
}
