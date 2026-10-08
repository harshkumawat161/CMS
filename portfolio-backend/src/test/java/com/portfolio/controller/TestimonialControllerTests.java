package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.request.TestimonialRequest;
import com.portfolio.model.Testimonial;
import com.portfolio.repository.TestimonialRepository;
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
class TestimonialControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TestimonialRepository testimonialRepository;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        testimonialRepository.deleteAll();

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
    @DisplayName("1. Admin POST /api/admin/testimonials creates testimonial and returns 201 Created")
    void testCreateTestimonial_Succeeds() throws Exception {
        TestimonialRequest request = TestimonialRequest.builder()
                .name("Alice Smith")
                .role("VP of Product")
                .company("Acme Corp")
                .message("Outstanding engineer who delivered on every promise.")
                .image("https://example.com/alice.jpg")
                .displayOrder(1)
                .published(true)
                .build();

        mockMvc.perform(post("/api/admin/testimonials")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.name").value("Alice Smith"))
                .andExpect(jsonPath("$.data.published").value(true));

        assertThat(testimonialRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. Admin POST /api/admin/testimonials with validation errors returns 400 Bad Request")
    void testCreateTestimonial_ValidationErrors_Returns400() throws Exception {
        TestimonialRequest invalid = TestimonialRequest.builder()
                .name("")
                .role("")
                .message("")
                .build();

        mockMvc.perform(post("/api/admin/testimonials")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.name").isNotEmpty())
                .andExpect(jsonPath("$.errors.role").isNotEmpty())
                .andExpect(jsonPath("$.errors.message").isNotEmpty());
    }

    @Test
    @DisplayName("3. Admin GET /api/admin/testimonials/{id} returns single entry; 404 for missing ID")
    void testGetTestimonialById() throws Exception {
        Testimonial saved = testimonialRepository.save(Testimonial.builder()
                .name("Bob Jones")
                .role("Engineering Director")
                .message("Highly recommended!")
                .displayOrder(1)
                .published(true)
                .build());

        mockMvc.perform(get("/api/admin/testimonials/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Bob Jones"));

        mockMvc.perform(get("/api/admin/testimonials/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("4. Admin PUT /api/admin/testimonials/{id} updates testimonial")
    void testUpdateTestimonial_Succeeds() throws Exception {
        Testimonial saved = testimonialRepository.save(Testimonial.builder()
                .name("Charlie")
                .role("Lead Dev")
                .message("Initial quote")
                .displayOrder(1)
                .published(true)
                .build());

        TestimonialRequest updateRequest = TestimonialRequest.builder()
                .name("Charlie Brown")
                .role("Principal Architect")
                .company("Global Systems")
                .message("Updated quote text")
                .displayOrder(3)
                .published(true)
                .build();

        mockMvc.perform(put("/api/admin/testimonials/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Charlie Brown"))
                .andExpect(jsonPath("$.data.role").value("Principal Architect"));

        Testimonial reloaded = testimonialRepository.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getName()).isEqualTo("Charlie Brown");
        assertThat(reloaded.getRole()).isEqualTo("Principal Architect");
    }

    @Test
    @DisplayName("5. Admin DELETE /api/admin/testimonials/{id} removes entry")
    void testDeleteTestimonial_Succeeds() throws Exception {
        Testimonial saved = testimonialRepository.save(Testimonial.builder()
                .name("Dave")
                .role("Founder")
                .message("Great work!")
                .build());

        mockMvc.perform(delete("/api/admin/testimonials/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(testimonialRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("6. Public GET /api/testimonials only returns published testimonials")
    void testPublicGetTestimonials_OnlyPublished() throws Exception {
        testimonialRepository.saveAll(List.of(
                Testimonial.builder().name("Testimonial 1").role("CTO").message("A").displayOrder(1).published(true).build(),
                Testimonial.builder().name("Testimonial 2").role("CEO").message("B").displayOrder(2).published(true).build(),
                Testimonial.builder().name("Testimonial Draft").role("VP").message("C").displayOrder(0).published(false).build()
        ));

        mockMvc.perform(get("/api/testimonials"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].name").value("Testimonial 1"))
                .andExpect(jsonPath("$.data[1].name").value("Testimonial 2"));
    }

    @Test
    @DisplayName("7. Unauthorized access to /api/admin/testimonials fails with 401")
    void testAdminTestimonials_Unauthorized_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/testimonials"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/testimonials")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }
}
