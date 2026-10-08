package com.portfolio.controller;

import com.portfolio.dto.request.TestimonialRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.TestimonialResponse;
import com.portfolio.service.TestimonialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/testimonials")
@Tag(name = "Testimonials", description = "Client and colleague recommendations and reviews")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class TestimonialAdminController {

    private final TestimonialService testimonialService;

    public TestimonialAdminController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping
    @Operation(summary = "Get all testimonials (Admin)", description = "Returns all client and peer testimonials ordered by displayOrder")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "All testimonials retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT")
    })
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> getAllTestimonials() {
        List<TestimonialResponse> testimonials = testimonialService.getAllTestimonials();
        return ResponseEntity.ok(ApiResponse.success("All testimonials retrieved successfully", testimonials));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get testimonial by ID (Admin)", description = "Returns a single testimonial by ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Testimonial retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Testimonial not found")
    })
    public ResponseEntity<ApiResponse<TestimonialResponse>> getTestimonialById(@PathVariable Long id) {
        TestimonialResponse testimonial = testimonialService.getTestimonialById(id);
        return ResponseEntity.ok(ApiResponse.success("Testimonial retrieved successfully", testimonial));
    }

    @PostMapping
    @Operation(summary = "Create testimonial (Admin)", description = "Creates a new client/colleague testimonial")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Testimonial created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload or field validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT")
    })
    public ResponseEntity<ApiResponse<TestimonialResponse>> createTestimonial(@Valid @RequestBody TestimonialRequest request) {
        TestimonialResponse created = testimonialService.createTestimonial(request);
        return new ResponseEntity<>(
                ApiResponse.success("Testimonial created successfully", created),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update testimonial (Admin)", description = "Updates an existing testimonial by ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Testimonial updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload or field validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Testimonial not found")
    })
    public ResponseEntity<ApiResponse<TestimonialResponse>> updateTestimonial(
            @PathVariable Long id,
            @Valid @RequestBody TestimonialRequest request) {
        TestimonialResponse updated = testimonialService.updateTestimonial(id, request);
        return ResponseEntity.ok(ApiResponse.success("Testimonial updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete testimonial (Admin)", description = "Deletes an existing testimonial by ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Testimonial deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Testimonial not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteTestimonial(@PathVariable Long id) {
        testimonialService.deleteTestimonial(id);
        return ResponseEntity.ok(ApiResponse.success("Testimonial deleted successfully", null));
    }
}
