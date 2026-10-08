package com.portfolio.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Indicates whether the API operation succeeded", example = "true")
    private boolean success = true;

    @io.swagger.v3.oas.annotations.media.Schema(description = "Human-readable status or feedback message", example = "Operation completed successfully")
    private String message;

    @io.swagger.v3.oas.annotations.media.Schema(description = "Payload response data")
    private T data;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Response timestamp in ISO-8601 UTC format", example = "2026-10-07T14:30:00Z")
    private Instant timestamp = Instant.now();

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("Success")
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(Instant.now())
                .build();
    }
}
