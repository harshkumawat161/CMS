package com.portfolio.service.impl;

import com.portfolio.dto.request.AboutRequest;
import com.portfolio.dto.response.AboutResponse;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.AboutMapper;
import com.portfolio.model.About;
import com.portfolio.repository.AboutRepository;
import com.portfolio.service.AboutService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AboutServiceImpl implements AboutService {

    private final AboutRepository aboutRepository;
    private final AboutMapper aboutMapper;

    public AboutServiceImpl(AboutRepository aboutRepository, AboutMapper aboutMapper) {
        this.aboutRepository = aboutRepository;
        this.aboutMapper = aboutMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public AboutResponse getAbout() {
        return aboutRepository.findFirstByOrderByIdAsc()
                .map(aboutMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "About profile information has not been configured yet"));
    }

    @Override
    @Transactional
    public AboutResponse updateAbout(AboutRequest request) {
        About about = aboutRepository.findFirstByOrderByIdAsc()
                .map(existing -> {
                    aboutMapper.updateEntityFromRequest(existing, request);
                    return existing;
                })
                .orElseGet(() -> aboutMapper.toEntity(request));

        About saved = aboutRepository.save(about);
        return aboutMapper.toResponse(saved);
    }
}
