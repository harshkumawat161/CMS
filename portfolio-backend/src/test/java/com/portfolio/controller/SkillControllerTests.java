package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.request.SkillRequest;
import com.portfolio.model.Skill;
import com.portfolio.repository.SkillRepository;
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
class SkillControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SkillRepository skillRepository;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        skillRepository.deleteAll();

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
    @DisplayName("1. Admin POST /api/admin/skills creates new skill and returns 201 Created")
    void testCreateSkill_Succeeds() throws Exception {
        SkillRequest request = SkillRequest.builder()
                .name("Java")
                .category("Backend")
                .proficiency(95)
                .icon("simple-icons:java")
                .displayOrder(1)
                .published(true)
                .build();

        mockMvc.perform(post("/api/admin/skills")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.name").value("Java"))
                .andExpect(jsonPath("$.data.proficiency").value(95))
                .andExpect(jsonPath("$.data.published").value(true));

        assertThat(skillRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. Admin POST /api/admin/skills with invalid proficiency (>100 or <1) returns 400 Bad Request")
    void testCreateSkill_InvalidProficiency_Returns400() throws Exception {
        SkillRequest invalidRequest = SkillRequest.builder()
                .name("TypeScript")
                .category("Frontend")
                .proficiency(150) // Invalid: greater than 100
                .displayOrder(1)
                .build();

        mockMvc.perform(post("/api/admin/skills")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.proficiency").isNotEmpty());
    }

    @Test
    @DisplayName("3. Admin GET /api/admin/skills/{id} returns single skill")
    void testGetSkillById_Succeeds() throws Exception {
        Skill saved = skillRepository.save(Skill.builder()
                .name("Spring Boot")
                .category("Backend")
                .proficiency(90)
                .displayOrder(1)
                .published(true)
                .build());

        mockMvc.perform(get("/api/admin/skills/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(saved.getId()))
                .andExpect(jsonPath("$.data.name").value("Spring Boot"));
    }

    @Test
    @DisplayName("4. Admin GET /api/admin/skills/{id} with non-existent ID returns 404 Not Found")
    void testGetSkillById_NotFound_Returns404() throws Exception {
        mockMvc.perform(get("/api/admin/skills/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("5. Admin PUT /api/admin/skills/{id} updates existing skill")
    void testUpdateSkill_Succeeds() throws Exception {
        Skill saved = skillRepository.save(Skill.builder()
                .name("React")
                .category("Frontend")
                .proficiency(80)
                .displayOrder(2)
                .published(true)
                .build());

        SkillRequest updateRequest = SkillRequest.builder()
                .name("React 18 / Next.js")
                .category("Frontend")
                .proficiency(92)
                .icon("simple-icons:nextdotjs")
                .displayOrder(1)
                .published(true)
                .build();

        mockMvc.perform(put("/api/admin/skills/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("React 18 / Next.js"))
                .andExpect(jsonPath("$.data.proficiency").value(92));

        Skill reloaded = skillRepository.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getName()).isEqualTo("React 18 / Next.js");
        assertThat(reloaded.getProficiency()).isEqualTo(92);
    }

    @Test
    @DisplayName("6. Admin DELETE /api/admin/skills/{id} deletes skill from database")
    void testDeleteSkill_Succeeds() throws Exception {
        Skill saved = skillRepository.save(Skill.builder()
                .name("Docker")
                .category("DevOps")
                .proficiency(85)
                .displayOrder(3)
                .published(true)
                .build());

        mockMvc.perform(delete("/api/admin/skills/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(skillRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("7. Public GET /api/skills only returns published skills sorted by displayOrder")
    void testPublicGetSkills_FiltersPublishedAndSorts() throws Exception {
        // Seed 3 skills: 2 published with orders 2 and 1, 1 unpublished with order 0
        skillRepository.saveAll(List.of(
                Skill.builder().name("Skill C").category("Backend").proficiency(80).displayOrder(2).published(true).build(),
                Skill.builder().name("Skill A").category("Backend").proficiency(90).displayOrder(1).published(true).build(),
                Skill.builder().name("Skill Draft").category("Backend").proficiency(70).displayOrder(0).published(false).build()
        ));

        // Public call: unauthenticated
        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(2))) // Only 2 published
                .andExpect(jsonPath("$.data[0].name").value("Skill A")) // displayOrder 1 first
                .andExpect(jsonPath("$.data[1].name").value("Skill C")); // displayOrder 2 second
    }

    @Test
    @DisplayName("8. Admin GET /api/admin/skills returns all skills including unpublished")
    void testAdminGetAllSkills_ReturnsAllSkills() throws Exception {
        skillRepository.saveAll(List.of(
                Skill.builder().name("Skill Published").category("Backend").proficiency(80).displayOrder(1).published(true).build(),
                Skill.builder().name("Skill Draft").category("Backend").proficiency(70).displayOrder(2).published(false).build()
        ));

        mockMvc.perform(get("/api/admin/skills")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(2))); // All 2 returned
    }

    @Test
    @DisplayName("9. Unauthorized requests to admin endpoints fail with 401")
    void testAdminEndpoints_WithoutToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/skills"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }
}
