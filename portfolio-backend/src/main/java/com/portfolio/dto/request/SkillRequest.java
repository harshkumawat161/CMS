package com.portfolio.dto.request;

import jakarta.validation.constraints.Max;
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
public class SkillRequest {

    @NotBlank(message = "Skill name is required")
    @Size(max = 100, message = "Skill name cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Skill name", example = "Spring Boot", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category cannot exceed 50 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Skill grouping category", example = "Backend", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String category;

    @NotNull(message = "Proficiency is required")
    @Min(value = 1, message = "Proficiency must be at least 1")
    @Max(value = 100, message = "Proficiency cannot exceed 100")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Proficiency percentage from 1 to 100", example = "95", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private Integer proficiency;

    @Size(max = 100, message = "Icon identifier cannot exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Icon CSS class or Lucide icon name", example = "si-springboot")
    private String icon;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order cannot be negative")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Sorting order sequence", example = "1", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private Integer displayOrder;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Publication visibility flag", example = "true")
    private Boolean published = true;
}
