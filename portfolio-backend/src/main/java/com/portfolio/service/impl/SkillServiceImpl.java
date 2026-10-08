package com.portfolio.service.impl;

import com.portfolio.dto.request.SkillRequest;
import com.portfolio.dto.response.SkillResponse;
import com.portfolio.exception.BadRequestException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.SkillMapper;
import com.portfolio.model.Skill;
import com.portfolio.repository.SkillRepository;
import com.portfolio.service.SkillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    public SkillServiceImpl(SkillRepository skillRepository, SkillMapper skillMapper) {
        this.skillRepository = skillRepository;
        this.skillMapper = skillMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getPublicSkills() {
        List<Skill> skills = skillRepository.findByPublishedTrueOrderByDisplayOrderAscIdAsc();
        return skillMapper.toResponseList(skills);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills() {
        List<Skill> skills = skillRepository.findAllByOrderByDisplayOrderAscIdAsc();
        return skillMapper.toResponseList(skills);
    }

    @Override
    @Transactional(readOnly = true)
    public SkillResponse getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        return skillMapper.toResponse(skill);
    }

    @Override
    @Transactional
    public SkillResponse createSkill(SkillRequest request) {
        String name = request.getName().trim();
        if (skillRepository.existsByNameIgnoreCase(name)) {
            throw new BadRequestException("A skill with name '" + name + "' already exists");
        }

        Skill skill = skillMapper.toEntity(request);
        Skill saved = skillRepository.save(skill);
        return skillMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public SkillResponse updateSkill(Long id, SkillRequest request) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));

        String name = request.getName().trim();
        if (skillRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new BadRequestException("Another skill with name '" + name + "' already exists");
        }

        skillMapper.updateEntityFromRequest(skill, request);
        Skill updated = skillRepository.save(skill);
        return skillMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        skillRepository.delete(skill);
    }
}
