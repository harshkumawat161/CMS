package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.request.ServiceRequest;
import com.portfolio.model.Service;
import com.portfolio.repository.ServiceRepository;
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
class ServiceControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ServiceRepository serviceRepository;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        serviceRepository.deleteAll();

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
    @DisplayName("1. Admin POST /api/admin/services creates service and returns 201 Created")
    void testCreateService_Succeeds() throws Exception {
        ServiceRequest request = ServiceRequest.builder()
                .title("Full-Stack Web Development")
                .description("Custom web applications built with modern tools.")
                .icon("lucide:code-2")
                .displayOrder(1)
                .published(true)
                .build();

        mockMvc.perform(post("/api/admin/services")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.title").value("Full-Stack Web Development"))
                .andExpect(jsonPath("$.data.published").value(true));

        assertThat(serviceRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. Admin POST /api/admin/services with validation errors returns 400 Bad Request")
    void testCreateService_ValidationErrors_Returns400() throws Exception {
        ServiceRequest invalid = ServiceRequest.builder()
                .title("")
                .description("")
                .build();

        mockMvc.perform(post("/api/admin/services")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.title").isNotEmpty())
                .andExpect(jsonPath("$.errors.description").isNotEmpty());
    }

    @Test
    @DisplayName("3. Admin GET /api/admin/services/{id} returns single service; 404 for missing ID")
    void testGetServiceById() throws Exception {
        Service saved = serviceRepository.save(Service.builder()
                .title("DevOps Consulting")
                .description("CI/CD pipeline automation and Kubernetes orchestration.")
                .displayOrder(1)
                .published(true)
                .build());

        mockMvc.perform(get("/api/admin/services/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("DevOps Consulting"));

        mockMvc.perform(get("/api/admin/services/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("4. Admin PUT /api/admin/services/{id} updates service")
    void testUpdateService_Succeeds() throws Exception {
        Service saved = serviceRepository.save(Service.builder()
                .title("UI/UX Design")
                .description("Initial description")
                .displayOrder(1)
                .published(true)
                .build());

        ServiceRequest updateRequest = ServiceRequest.builder()
                .title("Product & UI/UX Design")
                .description("Updated comprehensive design systems and wireframing.")
                .icon("lucide:pen-tool")
                .displayOrder(2)
                .published(true)
                .build();

        mockMvc.perform(put("/api/admin/services/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Product & UI/UX Design"))
                .andExpect(jsonPath("$.data.icon").value("lucide:pen-tool"));

        Service reloaded = serviceRepository.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getTitle()).isEqualTo("Product & UI/UX Design");
    }

    @Test
    @DisplayName("5. Admin DELETE /api/admin/services/{id} removes service")
    void testDeleteService_Succeeds() throws Exception {
        Service saved = serviceRepository.save(Service.builder()
                .title("SEO Optimization")
                .description("Will be deleted")
                .build());

        mockMvc.perform(delete("/api/admin/services/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(serviceRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("6. Public GET /api/services only returns published services")
    void testPublicGetServices_OnlyPublished() throws Exception {
        serviceRepository.saveAll(List.of(
                Service.builder().title("Service 1").description("A").displayOrder(1).published(true).build(),
                Service.builder().title("Service 2").description("B").displayOrder(2).published(true).build(),
                Service.builder().title("Service Draft").description("C").displayOrder(0).published(false).build()
        ));

        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].title").value("Service 1"))
                .andExpect(jsonPath("$.data[1].title").value("Service 2"));
    }

    @Test
    @DisplayName("7. Unauthorized access to /api/admin/services fails with 401")
    void testAdminServices_Unauthorized_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/services"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }
}
