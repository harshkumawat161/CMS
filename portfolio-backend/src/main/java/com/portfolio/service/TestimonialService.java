package com.portfolio.service;

import com.portfolio.dto.request.TestimonialRequest;
import com.portfolio.dto.response.TestimonialResponse;

import java.util.List;

public interface TestimonialService {

    List<TestimonialResponse> getPublicTestimonials();

    List<TestimonialResponse> getAllTestimonials();

    TestimonialResponse getTestimonialById(Long id);

    TestimonialResponse createTestimonial(TestimonialRequest request);

    TestimonialResponse updateTestimonial(Long id, TestimonialRequest request);

    void deleteTestimonial(Long id);
}
