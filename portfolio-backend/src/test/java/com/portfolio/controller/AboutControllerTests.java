package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.AboutRequest;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.repository.AboutRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AboutControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AboutRepository aboutRepository;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        aboutRepository.deleteAll();

        LoginRequest loginRequest = LoginRequest.builder()
                .email("admin@portfolio.local")
                .password("Admin@123456")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode rootNode = objectMapper.readTree(result.getResponse().getContentAsString());
        adminToken = rootNode.path("data").path("accessToken").asText();
    }

    @Test
    @DisplayName("1. Public GET /api/about returns 404 when profile is not configured without NPE")
    void testPublicGet_WhenProfileNotConfigured_ReturnsAppropriateResponse() throws Exception {
        mockMvc.perform(get("/api/about"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("About profile information has not been configured yet"));
    }

    @Test
    @DisplayName("2. Admin PUT /api/admin/about without authentication returns 401 Unauthorized")
    void testAdminPut_Unauthorized_Returns401() throws Exception {
        AboutRequest request = AboutRequest.builder()
                .name("Alex Morgan")
                .headline("Lead Architect")
                .bio("Building scalable systems.")
                .email("alex@portfolio.local")
                .build();

        mockMvc.perform(put("/api/admin/about")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("3. Admin PUT /api/admin/about with invalid data returns 400 Bad Request with field errors")
    void testAdminPut_InvalidData_Returns400() throws Exception {
        AboutRequest invalidRequest = AboutRequest.builder()
                .name("") // blank name
                .headline("") // blank headline
                .bio("") // blank bio
                .email("not-a-valid-email") // invalid email format
                .build();

        mockMvc.perform(put("/api/admin/about")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.name").isNotEmpty())
                .andExpect(jsonPath("$.errors.headline").isNotEmpty())
                .andExpect(jsonPath("$.errors.bio").isNotEmpty())
                .andExpect(jsonPath("$.errors.email").isNotEmpty());
    }

    @Test
    @DisplayName("4. Admin PUT /api/admin/about with valid data persists and updates profile")
    void testAdminPut_ValidData_PersistsSuccessfully() throws Exception {
        AboutRequest request = AboutRequest.builder()
                .name("Alex Morgan")
                .headline("Lead Full-Stack Cloud Architect")
                .bio("10+ years engineering high-availability platforms.")
                .email("alex.morgan@portfolio.local")
                .location("San Francisco, CA")
                .profileImage("/uploads/profile.png")
                .resumeUrl("/uploads/alex-resume.pdf")
                .githubUrl("https://github.com/alexmorgan")
                .linkedinUrl("https://linkedin.com/in/alexmorgan")
                .twitterUrl("https://x.com/alexmorgan")
                .build();

        mockMvc.perform(put("/api/admin/about")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Alex Morgan"))
                .andExpect(jsonPath("$.data.headline").value("Lead Full-Stack Cloud Architect"))
                .andExpect(jsonPath("$.data.email").value("alex.morgan@portfolio.local"))
                .andExpect(jsonPath("$.data.location").value("San Francisco, CA"));

        // Verify database persistence directly
        assertThat(aboutRepository.count()).isEqualTo(1);
        assertThat(aboutRepository.findFirstByOrderByIdAsc()).isPresent();
        assertThat(aboutRepository.findFirstByOrderByIdAsc().get().getName()).isEqualTo("Alex Morgan");
    }

    @Test
    @DisplayName("5. Public GET /api/about returns current profile information after admin creation")
    void testPublicGet_ReturnsCurrentProfile() throws Exception {
        AboutRequest request = AboutRequest.builder()
                .name("Alex Morgan")
                .headline("Lead Full-Stack Cloud Architect")
                .bio("Building resilient web services.")
                .email("alex.morgan@portfolio.local")
                .location("San Francisco, CA")
                .build();

        // 1. Admin saves profile
        mockMvc.perform(put("/api/admin/about")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // 2. Public unauthenticated user accesses GET /api/about
        mockMvc.perform(get("/api/about"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Alex Morgan"))
                .andExpect(jsonPath("$.data.headline").value("Lead Full-Stack Cloud Architect"))
                .andExpect(jsonPath("$.data.email").value("alex.morgan@portfolio.local"));
    }

    @Test
    @DisplayName("6. Admin PUT updates existing profile idempotently without creating duplicate records")
    void testAdminPut_UpdatesExistingProfileIdempotently() throws Exception {
        AboutRequest initialRequest = AboutRequest.builder()
                .name("Alex Morgan")
                .headline("Software Engineer")
                .bio("Initial bio.")
                .email("alex@portfolio.local")
                .build();

        mockMvc.perform(put("/api/admin/about")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initialRequest)))
                .andExpect(status().isOk());

        AboutRequest updatedRequest = AboutRequest.builder()
                .name("Alex Morgan, Principal Architect")
                .headline("Chief Technology Officer")
                .bio("Updated bio with comprehensive leadership experience.")
                .email("alex.updated@portfolio.local")
                .location("New York, NY")
                .build();

        mockMvc.perform(put("/api/admin/about")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Alex Morgan, Principal Architect"))
                .andExpect(jsonPath("$.data.headline").value("Chief Technology Officer"))
                .andExpect(jsonPath("$.data.location").value("New York, NY"));

        // Only one record should exist in database
        assertThat(aboutRepository.count()).isEqualTo(1);
    }
}
