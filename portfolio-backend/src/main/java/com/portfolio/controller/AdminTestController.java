package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Authentication", description = "Admin authentication, JWT token refresh, and user session management")
@SecurityRequirement(name = "BearerAuth")
public class AdminTestController {

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin dashboard status check", description = "Verifies caller has ADMIN authority to access CMS management area")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Admin authorization confirmed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN authority")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(Authentication authentication) {
        Map<String, Object> data = Map.of(
                "status", "ADMIN_AUTHORIZED",
                "principal", authentication != null ? authentication.getName() : "anonymous",
                "message", "CMS Admin dashboard accessed successfully with valid ADMIN JWT"
        );
        return ResponseEntity.ok(ApiResponse.success("Admin authorization confirmed", data));
    }
}
