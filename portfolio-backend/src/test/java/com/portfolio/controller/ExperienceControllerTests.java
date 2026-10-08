package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.ExperienceRequest;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.model.Experience;
import com.portfolio.repository.ExperienceRepository;
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

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ExperienceControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ExperienceRepository experienceRepository;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        experienceRepository.deleteAll();

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
    @DisplayName("1. Admin POST /api/admin/experience creates entry and returns 201 Created")
    void testCreateExperience_Succeeds() throws Exception {
        ExperienceRequest request = ExperienceRequest.builder()
                .company("Google")
                .position("Senior Software Engineer")
                .description("Leading cloud native backend infrastructure.")
                .startDate(LocalDate.of(2022, 1, 15))
                .endDate(null)
                .current(true)
                .technologies(List.of("Java", "Kubernetes", "gRPC"))
                .displayOrder(1)
                .published(true)
                .build();

        mockMvc.perform(post("/api/admin/experience")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.company").value("Google"))
                .andExpect(jsonPath("$.data.current").value(true))
                .andExpect(jsonPath("$.data.technologies", hasSize(3)));

        assertThat(experienceRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. Admin POST /api/admin/experience with validation errors returns 400 Bad Request")
    void testCreateExperience_ValidationErrors_Returns400() throws Exception {
        ExperienceRequest invalid = ExperienceRequest.builder()
                .company("")
                .position("")
                .startDate(null)
                .build();

        mockMvc.perform(post("/api/admin/experience")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.company").isNotEmpty())
                .andExpect(jsonPath("$.errors.position").isNotEmpty())
                .andExpect(jsonPath("$.errors.startDate").isNotEmpty());
    }

    @Test
    @DisplayName("3. Admin GET /api/admin/experience/{id} returns single entry; 404 for missing ID")
    void testGetExperienceById() throws Exception {
        Experience saved = experienceRepository.save(Experience.builder()
                .company("Microsoft")
                .position("Cloud Architect")
                .startDate(LocalDate.of(2020, 1, 1))
                .displayOrder(1)
                .published(true)
                .build());

        mockMvc.perform(get("/api/admin/experience/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.company").value("Microsoft"));

        mockMvc.perform(get("/api/admin/experience/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("4. Admin PUT /api/admin/experience/{id} updates experience")
    void testUpdateExperience_Succeeds() throws Exception {
        Experience saved = experienceRepository.save(Experience.builder()
                .company("Meta")
                .position("Software Engineer")
                .startDate(LocalDate.of(2021, 5, 1))
                .displayOrder(2)
                .published(true)
                .build());

        ExperienceRequest updateRequest = ExperienceRequest.builder()
                .company("Meta Platforms")
                .position("Staff Software Engineer")
                .startDate(LocalDate.of(2021, 5, 1))
                .endDate(LocalDate.of(2023, 12, 31))
                .current(false)
                .technologies(List.of("React", "GraphQL"))
                .displayOrder(1)
                .published(true)
                .build();

        mockMvc.perform(put("/api/admin/experience/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.company").value("Meta Platforms"))
                .andExpect(jsonPath("$.data.position").value("Staff Software Engineer"));

        Experience reloaded = experienceRepository.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getCompany()).isEqualTo("Meta Platforms");
        assertThat(reloaded.getPosition()).isEqualTo("Staff Software Engineer");
        assertThat(reloaded.isCurrent()).isFalse();
    }

    @Test
    @DisplayName("5. Admin DELETE /api/admin/experience/{id} removes entry")
    void testDeleteExperience_Succeeds() throws Exception {
        Experience saved = experienceRepository.save(Experience.builder()
                .company("Startup Inc")
                .position("Tech Lead")
                .startDate(LocalDate.of(2019, 1, 1))
                .build());

        mockMvc.perform(delete("/api/admin/experience/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(experienceRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("6. Public GET /api/experience only returns published experiences")
    void testPublicGetExperience_OnlyPublished() throws Exception {
        experienceRepository.saveAll(List.of(
                Experience.builder().company("Company A").position("Dev").startDate(LocalDate.of(2023, 1, 1)).displayOrder(1).published(true).build(),
                Experience.builder().company("Company B").position("Dev").startDate(LocalDate.of(2022, 1, 1)).displayOrder(2).published(true).build(),
                Experience.builder().company("Company Draft").position("Dev").startDate(LocalDate.of(2021, 1, 1)).displayOrder(0).published(false).build()
        ));

        mockMvc.perform(get("/api/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].company").value("Company A"))
                .andExpect(jsonPath("$.data[1].company").value("Company B"));
    }

    @Test
    @DisplayName("7. Unauthorized access to /api/admin/experience fails with 401")
    void testAdminExperience_Unauthorized_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/experience"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/experience")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }
}
