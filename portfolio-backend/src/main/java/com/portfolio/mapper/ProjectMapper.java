package com.portfolio.mapper;

import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.dto.response.ProjectResponse;
import com.portfolio.model.Project;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project) {
        if (project == null) {
            return null;
        }

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .slug(project.getSlug())
                .shortDescription(project.getShortDescription())
                .description(project.getDescription())
                .image(project.getImage())
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getLiveUrl())
                .technologies(project.getTechnologies() != null ? new ArrayList<>(project.getTechnologies()) : Collections.emptyList())
                .featured(project.isFeatured())
                .displayOrder(project.getDisplayOrder())
                .status(project.getStatus())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    public List<ProjectResponse> toResponseList(List<Project> projects) {
        if (projects == null || projects.isEmpty()) {
            return Collections.emptyList();
        }

        return projects.stream()
                .map(this::toResponse)
                .toList();
    }

    public Project toEntity(ProjectRequest request, String finalSlug) {
        if (request == null) {
            return null;
        }

        return Project.builder()
                .title(request.getTitle().trim())
                .slug(finalSlug)
                .shortDescription(request.getShortDescription() != null ? request.getShortDescription().trim() : null)
                .description(request.getDescription().trim())
                .image(request.getImage() != null ? request.getImage().trim() : null)
                .githubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null)
                .liveUrl(request.getLiveUrl() != null ? request.getLiveUrl().trim() : null)
                .technologies(request.getTechnologies() != null ? sanitizeTechnologies(request.getTechnologies()) : new ArrayList<>())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .status(request.getStatus() != null ? request.getStatus() : com.portfolio.model.enums.ContentStatus.DRAFT)
                .build();
    }

    public void updateEntityFromRequest(Project project, ProjectRequest request, String finalSlug) {
        if (project == null || request == null) {
            return;
        }

        project.setTitle(request.getTitle().trim());
        project.setSlug(finalSlug);
        project.setShortDescription(request.getShortDescription() != null ? request.getShortDescription().trim() : null);
        project.setDescription(request.getDescription().trim());
        project.setImage(request.getImage() != null ? request.getImage().trim() : null);
        project.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        project.setLiveUrl(request.getLiveUrl() != null ? request.getLiveUrl().trim() : null);
        if (request.getTechnologies() != null) {
            if (project.getTechnologies() == null) {
                project.setTechnologies(new ArrayList<>());
            } else {
                project.getTechnologies().clear();
            }
            project.getTechnologies().addAll(sanitizeTechnologies(request.getTechnologies()));
        }
        if (request.getFeatured() != null) {
            project.setFeatured(request.getFeatured());
        }
        if (request.getDisplayOrder() != null) {
            project.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
    }

    private List<String> sanitizeTechnologies(List<String> raw) {
        return raw.stream()
                .filter(t -> t != null && !t.isBlank())
                .map(String::trim)
                .distinct()
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
    }
}
