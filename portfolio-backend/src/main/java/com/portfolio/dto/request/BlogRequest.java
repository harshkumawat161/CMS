package com.portfolio.dto.request;

import com.portfolio.model.enums.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Article title", example = "Mastering High-Performance Spring Boot APIs", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String title;

    @Size(max = 200, message = "Slug cannot exceed 200 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Unique article slug (auto-generated if omitted)", example = "mastering-high-performance-spring-boot-apis")
    private String slug;

    @Size(max = 1000, message = "Excerpt cannot exceed 1000 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Brief excerpt or TL;DR preview", example = "Deep dive into performance profiling, indexing, and connection pool tuning.")
    private String excerpt;

    @NotBlank(message = "Content is required")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Full article content in Markdown or HTML", example = "## Introduction\nIn this article we explore JVM ergonomics...", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String content;

    @Size(max = 500, message = "Cover image URL cannot exceed 500 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Cover banner image URL", example = "/uploads/media/spring-tuning-cover.webp")
    private String coverImage;

    @io.swagger.v3.oas.annotations.media.Schema(description = "Publication timestamp", example = "2026-10-07T12:00:00Z")
    private Instant publishedAt;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Publishing lifecycle status", example = "PUBLISHED")
    private ContentStatus status = ContentStatus.DRAFT;

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "List of article category tags", example = "[\"Spring Boot\", \"Architecture\", \"Performance\"]")
    private List<String> tags = new ArrayList<>();
}
