package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.AboutResponse;
import com.portfolio.service.AboutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/about")
@Tag(name = "About", description = "Portfolio owner profile, bio, resume, and social links")
public class AboutController {

    private final AboutService aboutService;

    public AboutController(AboutService aboutService) {
        this.aboutService = aboutService;
    }

    @GetMapping
    @Operation(summary = "Get published About profile", description = "Returns public portfolio owner profile details")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile details retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "About profile information has not been configured yet")
    })
    public ResponseEntity<ApiResponse<AboutResponse>> getAbout() {
        AboutResponse response = aboutService.getAbout();
        return ResponseEntity.ok(ApiResponse.success("Profile details retrieved successfully", response));
    }
}
