package com.portfolio.mapper;

import com.portfolio.dto.request.TestimonialRequest;
import com.portfolio.dto.response.TestimonialResponse;
import com.portfolio.model.Testimonial;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class TestimonialMapper {

    public TestimonialResponse toResponse(Testimonial testimonial) {
        if (testimonial == null) {
            return null;
        }

        return TestimonialResponse.builder()
                .id(testimonial.getId())
                .name(testimonial.getName())
                .role(testimonial.getRole())
                .company(testimonial.getCompany())
                .message(testimonial.getMessage())
                .image(testimonial.getImage())
                .displayOrder(testimonial.getDisplayOrder())
                .published(testimonial.isPublished())
                .createdAt(testimonial.getCreatedAt())
                .updatedAt(testimonial.getUpdatedAt())
                .build();
    }

    public List<TestimonialResponse> toResponseList(List<Testimonial> testimonials) {
        if (testimonials == null || testimonials.isEmpty()) {
            return Collections.emptyList();
        }

        return testimonials.stream()
                .map(this::toResponse)
                .toList();
    }

    public Testimonial toEntity(TestimonialRequest request) {
        if (request == null) {
            return null;
        }

        return Testimonial.builder()
                .name(request.getName().trim())
                .role(request.getRole().trim())
                .company(request.getCompany() != null ? request.getCompany().trim() : null)
                .message(request.getMessage().trim())
                .image(request.getImage() != null ? request.getImage().trim() : null)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .published(request.getPublished() == null || request.getPublished())
                .build();
    }

    public void updateEntityFromRequest(Testimonial testimonial, TestimonialRequest request) {
        if (testimonial == null || request == null) {
            return;
        }

        testimonial.setName(request.getName().trim());
        testimonial.setRole(request.getRole().trim());
        testimonial.setCompany(request.getCompany() != null ? request.getCompany().trim() : null);
        testimonial.setMessage(request.getMessage().trim());
        testimonial.setImage(request.getImage() != null ? request.getImage().trim() : null);
        if (request.getDisplayOrder() != null) {
            testimonial.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getPublished() != null) {
            testimonial.setPublished(request.getPublished());
        }
    }
}
