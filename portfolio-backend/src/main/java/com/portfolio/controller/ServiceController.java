package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.ServiceResponse;
import com.portfolio.service.ServiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@Tag(name = "Services", description = "Public endpoints for professional services and offerings")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    @Operation(summary = "Get published services", description = "Returns visible services ordered by display order")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Services retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getPublicServices() {
        List<ServiceResponse> services = serviceService.getPublicServices();
        return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
    }
}
