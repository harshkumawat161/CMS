package com.portfolio.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Name of author/endorser", example = "Sarah Jenkins", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank(message = "Role is required")
    @Size(max = 100, message = "Role cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Professional title or relationship", example = "VP of Engineering", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String role;

    @Size(max = 100, message = "Company cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Affiliated company or organization", example = "TechCorp Global")
    private String company;

    @NotBlank(message = "Message is required")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Testimonial or review text", example = "Alex delivered an outstanding cloud migration on time and with zero downtime.", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String message;

    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Avatar/headshot image URL", example = "/uploads/media/sarah-jenkins.webp")
    private String image;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order cannot be negative")
    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Sorting order sequence", example = "1", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private Integer displayOrder = 0;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Visibility status", example = "true")
    private Boolean published = true;
}
