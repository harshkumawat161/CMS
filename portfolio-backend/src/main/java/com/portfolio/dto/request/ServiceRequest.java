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
public class ServiceRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Service title", example = "Cloud Architecture & Scalability", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String title;

    @NotBlank(message = "Description is required")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Detailed service overview", example = "Designing distributed systems, microservice transitions, and cost-effective cloud deployments.", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String description;

    @Size(max = 100, message = "Icon identifier cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Lucide icon name or CSS class", example = "lucide-cloud")
    private String icon;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order cannot be negative")
    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Sorting order sequence", example = "1", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private Integer displayOrder = 0;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Service visibility flag", example = "true")
    private Boolean published = true;
}
