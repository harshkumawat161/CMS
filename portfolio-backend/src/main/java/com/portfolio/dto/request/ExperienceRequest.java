package com.portfolio.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceRequest {

    @NotBlank(message = "Company is required")
    @Size(max = 100, message = "Company cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Company or employer name", example = "Google", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String company;

    @NotBlank(message = "Position is required")
    @Size(max = 100, message = "Position cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Job title or role", example = "Senior Software Engineer", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String position;

    @io.swagger.v3.oas.annotations.media.Schema(description = "Key responsibilities and achievements", example = "Led core infrastructure team in migrating monolithic services to microservices.")
    private String description;

    @NotNull(message = "Start date is required")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Position start date", example = "2021-03-01", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private LocalDate startDate;

    @io.swagger.v3.oas.annotations.media.Schema(description = "Position end date (null if current position)", example = "2024-05-31")
    private LocalDate endDate;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Flag indicating current ongoing employment", example = "false")
    private Boolean current = false;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Tech stack used in role", example = "[\"Java\", \"Kubernetes\", \"GCP\"]")
    private List<String> technologies = new ArrayList<>();

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order cannot be negative")
    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Sorting order priority", example = "1", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private Integer displayOrder = 0;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Public visibility flag", example = "true")
    private Boolean published = true;
}
