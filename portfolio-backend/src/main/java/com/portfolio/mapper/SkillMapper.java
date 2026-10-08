package com.portfolio.mapper;

import com.portfolio.dto.request.SkillRequest;
import com.portfolio.dto.response.SkillResponse;
import com.portfolio.model.Skill;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class SkillMapper {

    public SkillResponse toResponse(Skill skill) {
        if (skill == null) {
            return null;
        }

        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .proficiency(skill.getProficiency())
                .icon(skill.getIcon())
                .displayOrder(skill.getDisplayOrder())
                .published(skill.isPublished())
                .createdAt(skill.getCreatedAt())
                .updatedAt(skill.getUpdatedAt())
                .build();
    }

    public List<SkillResponse> toResponseList(List<Skill> skills) {
        if (skills == null || skills.isEmpty()) {
            return Collections.emptyList();
        }

        return skills.stream()
                .map(this::toResponse)
                .toList();
    }

    public Skill toEntity(SkillRequest request) {
        if (request == null) {
            return null;
        }

        return Skill.builder()
                .name(request.getName().trim())
                .category(request.getCategory().trim())
                .proficiency(request.getProficiency())
                .icon(request.getIcon() != null ? request.getIcon().trim() : null)
                .displayOrder(request.getDisplayOrder())
                .published(request.getPublished() == null || request.getPublished())
                .build();
    }

    public void updateEntityFromRequest(Skill skill, SkillRequest request) {
        if (skill == null || request == null) {
            return;
        }

        skill.setName(request.getName().trim());
        skill.setCategory(request.getCategory().trim());
        skill.setProficiency(request.getProficiency());
        skill.setIcon(request.getIcon() != null ? request.getIcon().trim() : null);
        skill.setDisplayOrder(request.getDisplayOrder());
        if (request.getPublished() != null) {
            skill.setPublished(request.getPublished());
        }
    }
}
