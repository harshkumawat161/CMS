package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.TestimonialResponse;
import com.portfolio.service.TestimonialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@Tag(name = "Testimonials", description = "Public endpoints for client and peer testimonials")
public class TestimonialController {

    private final TestimonialService testimonialService;

    public TestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping
    @Operation(summary = "Get published testimonials", description = "Returns visible testimonials ordered by display order")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Testimonials retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> getPublicTestimonials() {
        List<TestimonialResponse> testimonials = testimonialService.getPublicTestimonials();
        return ResponseEntity.ok(ApiResponse.success("Testimonials retrieved successfully", testimonials));
    }
}
