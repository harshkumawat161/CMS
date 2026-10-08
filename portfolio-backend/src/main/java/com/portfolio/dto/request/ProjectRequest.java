package com.portfolio.dto.request;

import com.portfolio.model.enums.ContentStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Project title", example = "Real-Time Collaborative Code Editor", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String title;

    @Size(max = 150, message = "Slug cannot exceed 150 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Unique URL slug (auto-generated if empty)", example = "real-time-collaborative-code-editor")
    private String slug;

    @Size(max = 500, message = "Short description cannot exceed 500 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Brief summary card description", example = "Web-based collaborative IDE with CRDT synchronization.")
    private String shortDescription;

    @NotBlank(message = "Description is required")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Detailed project overview and case study", example = "Architected a high-concurrency editor using WebSockets and Operational Transformation...", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String description;

    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Cover preview image URL", example = "/uploads/media/editor-screenshot.png")
    private String image;

    @Size(max = 500, message = "GitHub URL cannot exceed 500 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Source code repository URL", example = "https://github.com/example/code-editor")
    private String githubUrl;

    @Size(max = 500, message = "Live URL cannot exceed 500 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Production live demo URL", example = "https://code-editor.example.com")
    private String liveUrl;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "List of technologies utilized", example = "[\"Java\", \"Spring Boot\", \"React\", \"WebSockets\"]")
    private List<String> technologies = new ArrayList<>();

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Highlight as featured project on home page", example = "true")
    private Boolean featured = false;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order cannot be negative")
    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Sorting order priority", example = "1", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private Integer displayOrder = 0;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Publishing lifecycle status", example = "PUBLISHED")
    private ContentStatus status = ContentStatus.DRAFT;
}
