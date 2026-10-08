package com.portfolio.service.impl;

import com.portfolio.dto.request.TestimonialRequest;
import com.portfolio.dto.response.TestimonialResponse;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.TestimonialMapper;
import com.portfolio.model.Testimonial;
import com.portfolio.repository.TestimonialRepository;
import com.portfolio.service.TestimonialService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TestimonialServiceImpl implements TestimonialService {

    private final TestimonialRepository testimonialRepository;
    private final TestimonialMapper testimonialMapper;

    public TestimonialServiceImpl(TestimonialRepository testimonialRepository, TestimonialMapper testimonialMapper) {
        this.testimonialRepository = testimonialRepository;
        this.testimonialMapper = testimonialMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestimonialResponse> getPublicTestimonials() {
        List<Testimonial> testimonials = testimonialRepository.findByPublishedTrueOrderByDisplayOrderAscIdAsc();
        return testimonialMapper.toResponseList(testimonials);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestimonialResponse> getAllTestimonials() {
        List<Testimonial> testimonials = testimonialRepository.findAllByOrderByDisplayOrderAscIdAsc();
        return testimonialMapper.toResponseList(testimonials);
    }

    @Override
    @Transactional(readOnly = true)
    public TestimonialResponse getTestimonialById(Long id) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", "id", id));
        return testimonialMapper.toResponse(testimonial);
    }

    @Override
    @Transactional
    public TestimonialResponse createTestimonial(TestimonialRequest request) {
        Testimonial testimonial = testimonialMapper.toEntity(request);
        Testimonial saved = testimonialRepository.save(testimonial);
        return testimonialMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public TestimonialResponse updateTestimonial(Long id, TestimonialRequest request) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", "id", id));

        testimonialMapper.updateEntityFromRequest(testimonial, request);
        Testimonial updated = testimonialRepository.save(testimonial);
        return testimonialMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTestimonial(Long id) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", "id", id));
        testimonialRepository.delete(testimonial);
    }
}
