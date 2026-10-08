package com.portfolio.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Full name of portfolio owner", example = "Alex Mercer", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank(message = "Headline is required")
    @Size(max = 255, message = "Headline must not exceed 255 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Professional title/headline", example = "Staff Software Engineer & Cloud Architect", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String headline;

    @NotBlank(message = "Bio is required")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Comprehensive professional biography", example = "Experienced engineer passionate about scalable distributed systems and developer tooling.", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String bio;

    @Size(max = 500, message = "Profile image URL must not exceed 500 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "URL to avatar or profile photo", example = "/uploads/media/profile-photo.webp")
    private String profileImage;

    @Size(max = 500, message = "Resume URL must not exceed 500 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Downloadable resume/CV link", example = "/uploads/media/alex-mercer-resume.pdf")
    private String resumeUrl;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Primary contact email address", example = "alex@portfolio.local", requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
    private String email;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Location or residence", example = "San Francisco, CA")
    private String location;

    @Size(max = 255, message = "GitHub URL must not exceed 255 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "GitHub profile link", example = "https://github.com/alexmercer")
    private String githubUrl;

    @Size(max = 255, message = "LinkedIn URL must not exceed 255 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "LinkedIn profile link", example = "https://linkedin.com/in/alexmercer")
    private String linkedinUrl;

    @Size(max = 255, message = "Twitter URL must not exceed 255 characters")
    @io.swagger.v3.oas.annotations.media.Schema(description = "Twitter/X profile link", example = "https://x.com/alexmercer")
    private String twitterUrl;
}
