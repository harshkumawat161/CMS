package com.portfolio.controller;

import com.portfolio.dto.request.AboutRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.AboutResponse;
import com.portfolio.service.AboutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/about")
@Tag(name = "About", description = "Portfolio owner profile, bio, resume, and social links")
@SecurityRequirement(name = "BearerAuth")
public class AboutAdminController {

    private final AboutService aboutService;

    public AboutAdminController(AboutService aboutService) {
        this.aboutService = aboutService;
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update About profile", description = "Creates or updates the portfolio owner profile details. Requires ADMIN role.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload or field validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN authority")
    })
    public ResponseEntity<ApiResponse<AboutResponse>> updateAbout(@Valid @RequestBody AboutRequest request) {
        AboutResponse response = aboutService.updateAbout(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }
}
