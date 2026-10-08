package com.portfolio.service;

import com.portfolio.dto.request.SkillRequest;
import com.portfolio.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {

    List<SkillResponse> getPublicSkills();

    List<SkillResponse> getAllSkills();

    SkillResponse getSkillById(Long id);

    SkillResponse createSkill(SkillRequest request);

    SkillResponse updateSkill(Long id, SkillRequest request);

    void deleteSkill(Long id);
}
