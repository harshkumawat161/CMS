package com.portfolio.service.impl;

import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.dto.response.ProjectResponse;
import com.portfolio.exception.BadRequestException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.ProjectMapper;
import com.portfolio.model.Project;
import com.portfolio.model.enums.ContentStatus;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.service.ProjectService;
import com.portfolio.util.SlugUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getPublicProjects(Boolean featured) {
        List<Project> projects;
        if (featured != null) {
            projects = projectRepository.findByStatusAndFeaturedOrderByDisplayOrderAscCreatedAtDesc(ContentStatus.PUBLISHED, featured);
        } else {
            projects = projectRepository.findByStatusOrderByDisplayOrderAscCreatedAtDesc(ContentStatus.PUBLISHED);
        }
        return projectMapper.toResponseList(projects);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getPublicProjectBySlug(String slug) {
        Project project = projectRepository.findBySlugAndStatus(slug, ContentStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "slug", slug));
        return projectMapper.toResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        List<Project> projects = projectRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc();
        return projectMapper.toResponseList(projects);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return projectMapper.toResponse(project);
    }

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        String slug = resolveAndValidateSlug(request.getSlug(), request.getTitle());

        if (projectRepository.existsBySlugIgnoreCase(slug)) {
            throw new BadRequestException("A project with slug '" + slug + "' already exists");
        }

        Project project = projectMapper.toEntity(request, slug);
        Project saved = projectRepository.save(project);
        return projectMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        String slug = resolveAndValidateSlug(request.getSlug(), request.getTitle());

        if (projectRepository.existsBySlugIgnoreCaseAndIdNot(slug, id)) {
            throw new BadRequestException("Another project with slug '" + slug + "' already exists");
        }

        projectMapper.updateEntityFromRequest(project, request, slug);
        Project updated = projectRepository.save(project);
        return projectMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        projectRepository.delete(project);
    }

    @Override
    @Transactional
    public ProjectResponse publishProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        project.setStatus(ContentStatus.PUBLISHED);
        Project saved = projectRepository.save(project);
        return projectMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ProjectResponse unpublishProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        project.setStatus(ContentStatus.DRAFT);
        Project saved = projectRepository.save(project);
        return projectMapper.toResponse(saved);
    }

    private String resolveAndValidateSlug(String requestedSlug, String title) {
        String rawSlug = (requestedSlug != null && !requestedSlug.isBlank()) ? requestedSlug : title;
        String candidate = SlugUtils.toSlug(rawSlug);
        if (candidate.isBlank() || !SlugUtils.isValidSlug(candidate)) {
            throw new BadRequestException("Could not generate a valid URL slug from the provided title or slug");
        }
        return candidate;
    }
}
