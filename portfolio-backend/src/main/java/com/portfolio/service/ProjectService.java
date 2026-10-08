package com.portfolio.service;

import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.dto.response.ProjectResponse;

import java.util.List;

public interface ProjectService {

    List<ProjectResponse> getPublicProjects(Boolean featured);

    ProjectResponse getPublicProjectBySlug(String slug);

    List<ProjectResponse> getAllProjects();

    ProjectResponse getProjectById(Long id);

    ProjectResponse createProject(ProjectRequest request);

    ProjectResponse updateProject(Long id, ProjectRequest request);

    void deleteProject(Long id);

    ProjectResponse publishProject(Long id);

    ProjectResponse unpublishProject(Long id);
}
