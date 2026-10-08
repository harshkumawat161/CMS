package com.portfolio.mapper;

import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.dto.response.ExperienceResponse;
import com.portfolio.model.Experience;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExperienceMapper {

    public ExperienceResponse toResponse(Experience experience) {
        if (experience == null) {
            return null;
        }

        return ExperienceResponse.builder()
                .id(experience.getId())
                .company(experience.getCompany())
                .position(experience.getPosition())
                .description(experience.getDescription())
                .startDate(experience.getStartDate())
                .endDate(experience.getEndDate())
                .current(experience.isCurrent())
                .technologies(experience.getTechnologies() != null ? new ArrayList<>(experience.getTechnologies()) : Collections.emptyList())
                .displayOrder(experience.getDisplayOrder())
                .published(experience.isPublished())
                .createdAt(experience.getCreatedAt())
                .updatedAt(experience.getUpdatedAt())
                .build();
    }

    public List<ExperienceResponse> toResponseList(List<Experience> experiences) {
        if (experiences == null || experiences.isEmpty()) {
            return Collections.emptyList();
        }

        return experiences.stream()
                .map(this::toResponse)
                .toList();
    }

    public Experience toEntity(ExperienceRequest request) {
        if (request == null) {
            return null;
        }

        return Experience.builder()
                .company(request.getCompany().trim())
                .position(request.getPosition().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .current(request.getCurrent() != null ? request.getCurrent() : false)
                .technologies(request.getTechnologies() != null ? sanitizeTechnologies(request.getTechnologies()) : new ArrayList<>())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .published(request.getPublished() == null || request.getPublished())
                .build();
    }

    public void updateEntityFromRequest(Experience experience, ExperienceRequest request) {
        if (experience == null || request == null) {
            return;
        }

        experience.setCompany(request.getCompany().trim());
        experience.setPosition(request.getPosition().trim());
        experience.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        experience.setStartDate(request.getStartDate());
        experience.setEndDate(request.getEndDate());
        if (request.getCurrent() != null) {
            experience.setCurrent(request.getCurrent());
        }
        if (request.getDisplayOrder() != null) {
            experience.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getPublished() != null) {
            experience.setPublished(request.getPublished());
        }
        if (request.getTechnologies() != null) {
            if (experience.getTechnologies() == null) {
                experience.setTechnologies(new ArrayList<>());
            } else {
                experience.getTechnologies().clear();
            }
            experience.getTechnologies().addAll(sanitizeTechnologies(request.getTechnologies()));
        }
    }

    private List<String> sanitizeTechnologies(List<String> raw) {
        return raw.stream()
                .filter(t -> t != null && !t.isBlank())
                .map(String::trim)
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
