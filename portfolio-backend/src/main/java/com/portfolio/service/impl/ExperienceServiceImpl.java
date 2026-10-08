package com.portfolio.service.impl;

import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.dto.response.ExperienceResponse;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.ExperienceMapper;
import com.portfolio.model.Experience;
import com.portfolio.repository.ExperienceRepository;
import com.portfolio.service.ExperienceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final ExperienceMapper experienceMapper;

    public ExperienceServiceImpl(ExperienceRepository experienceRepository, ExperienceMapper experienceMapper) {
        this.experienceRepository = experienceRepository;
        this.experienceMapper = experienceMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceResponse> getPublicExperiences() {
        List<Experience> experiences = experienceRepository.findByPublishedTrueOrderByDisplayOrderAscStartDateDesc();
        return experienceMapper.toResponseList(experiences);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceResponse> getAllExperiences() {
        List<Experience> experiences = experienceRepository.findAllByOrderByDisplayOrderAscStartDateDesc();
        return experienceMapper.toResponseList(experiences);
    }

    @Override
    @Transactional(readOnly = true)
    public ExperienceResponse getExperienceById(Long id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        return experienceMapper.toResponse(experience);
    }

    @Override
    @Transactional
    public ExperienceResponse createExperience(ExperienceRequest request) {
        Experience experience = experienceMapper.toEntity(request);
        Experience saved = experienceRepository.save(experience);
        return experienceMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ExperienceResponse updateExperience(Long id, ExperienceRequest request) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));

        experienceMapper.updateEntityFromRequest(experience, request);
        Experience updated = experienceRepository.save(experience);
        return experienceMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteExperience(Long id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        experienceRepository.delete(experience);
    }
}
