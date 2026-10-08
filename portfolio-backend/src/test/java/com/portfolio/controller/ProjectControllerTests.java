package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.request.ProjectRequest;
import com.portfolio.model.Project;
import com.portfolio.model.enums.ContentStatus;
import com.portfolio.repository.ProjectRepository;
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
class ProjectControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        projectRepository.deleteAll();

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
    @DisplayName("1. Admin POST /api/admin/projects creates project with auto-generated slug and returns 201 Created")
    void testCreateProject_AutoSlug_Succeeds() throws Exception {
        ProjectRequest request = ProjectRequest.builder()
                .title("Portfolio CMS Platform!")
                .shortDescription("High performance headless CMS")
                .description("Detailed portfolio description with Spring Boot and React")
                .technologies(List.of("Java", "Spring Boot", "PostgreSQL", "React"))
                .featured(true)
                .displayOrder(1)
                .build();

        mockMvc.perform(post("/api/admin/projects")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.title").value("Portfolio CMS Platform!"))
                .andExpect(jsonPath("$.data.slug").value("portfolio-cms-platform"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"))
                .andExpect(jsonPath("$.data.featured").value(true))
                .andExpect(jsonPath("$.data.technologies", hasSize(4)));

        assertThat(projectRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. Admin POST /api/admin/projects with explicit slug normalizes and uses provided slug")
    void testCreateProject_CustomSlug_Succeeds() throws Exception {
        ProjectRequest request = ProjectRequest.builder()
                .title("E-Commerce Microservices")
                .slug("custom-ecom-store-v2")
                .description("Cloud-native microservices architecture")
                .technologies(List.of("Spring Cloud", "Kafka"))
                .displayOrder(2)
                .build();

        mockMvc.perform(post("/api/admin/projects")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("custom-ecom-store-v2"));
    }

    @Test
    @DisplayName("3. Admin POST /api/admin/projects with duplicate slug returns 400 Bad Request")
    void testCreateProject_DuplicateSlug_Returns400() throws Exception {
        projectRepository.save(Project.builder()
                .title("Project One")
                .slug("project-one")
                .description("First project")
                .status(ContentStatus.PUBLISHED)
                .build());

        ProjectRequest duplicateRequest = ProjectRequest.builder()
                .title("Project One") // Will generate "project-one"
                .description("Another attempt with duplicate slug")
                .build();

        mockMvc.perform(post("/api/admin/projects")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("A project with slug 'project-one' already exists"));
    }

    @Test
    @DisplayName("4. Admin POST /api/admin/projects validation errors return 400 Bad Request")
    void testCreateProject_ValidationErrors_Returns400() throws Exception {
        ProjectRequest invalid = ProjectRequest.builder()
                .title("") // Blank title
                .description("") // Blank description
                .displayOrder(-5) // Negative order
                .build();

        mockMvc.perform(post("/api/admin/projects")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.title").isNotEmpty())
                .andExpect(jsonPath("$.errors.description").isNotEmpty())
                .andExpect(jsonPath("$.errors.displayOrder").isNotEmpty());
    }

    @Test
    @DisplayName("5. Admin GET /api/admin/projects/{id} returns single project")
    void testGetProjectById_Succeeds() throws Exception {
        Project saved = projectRepository.save(Project.builder()
                .title("Single Project")
                .slug("single-project")
                .description("Description")
                .status(ContentStatus.DRAFT)
                .build());

        mockMvc.perform(get("/api/admin/projects/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(saved.getId()))
                .andExpect(jsonPath("$.data.slug").value("single-project"));
    }

    @Test
    @DisplayName("6. Admin GET /api/admin/projects/{id} non-existent ID returns 404")
    void testGetProjectById_NotFound_Returns404() throws Exception {
        mockMvc.perform(get("/api/admin/projects/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("7. Admin PUT /api/admin/projects/{id} updates existing project")
    void testUpdateProject_Succeeds() throws Exception {
        Project saved = projectRepository.save(Project.builder()
                .title("Initial Project")
                .slug("initial-project")
                .description("Initial Desc")
                .displayOrder(1)
                .status(ContentStatus.DRAFT)
                .build());

        ProjectRequest updateRequest = ProjectRequest.builder()
                .title("Updated Project Title")
                .slug("updated-project-slug")
                .description("Updated Detailed Desc")
                .technologies(List.of("TypeScript", "Next.js"))
                .featured(true)
                .displayOrder(5)
                .status(ContentStatus.PUBLISHED)
                .build();

        mockMvc.perform(put("/api/admin/projects/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Updated Project Title"))
                .andExpect(jsonPath("$.data.slug").value("updated-project-slug"))
                .andExpect(jsonPath("$.data.featured").value(true))
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));

        Project reloaded = projectRepository.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getTitle()).isEqualTo("Updated Project Title");
        assertThat(reloaded.getSlug()).isEqualTo("updated-project-slug");
        assertThat(reloaded.getStatus()).isEqualTo(ContentStatus.PUBLISHED);
    }

    @Test
    @DisplayName("8. Admin DELETE /api/admin/projects/{id} deletes project from database")
    void testDeleteProject_Succeeds() throws Exception {
        Project saved = projectRepository.save(Project.builder()
                .title("To Delete")
                .slug("to-delete")
                .description("Will be deleted")
                .status(ContentStatus.DRAFT)
                .build());

        mockMvc.perform(delete("/api/admin/projects/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(projectRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("9. Admin POST /api/admin/projects/{id}/publish and /unpublish toggles status")
    void testPublishAndUnpublishProject_Succeeds() throws Exception {
        Project saved = projectRepository.save(Project.builder()
                .title("Draft Project")
                .slug("draft-project")
                .description("Will be published then unpublished")
                .status(ContentStatus.DRAFT)
                .build());

        // Publish
        mockMvc.perform(post("/api/admin/projects/" + saved.getId() + "/publish")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));

        assertThat(projectRepository.findById(saved.getId()).orElseThrow().getStatus())
                .isEqualTo(ContentStatus.PUBLISHED);

        // Unpublish
        mockMvc.perform(post("/api/admin/projects/" + saved.getId() + "/unpublish")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));

        assertThat(projectRepository.findById(saved.getId()).orElseThrow().getStatus())
                .isEqualTo(ContentStatus.DRAFT);
    }

    @Test
    @DisplayName("10. Public GET /api/projects returns only published projects sorted by displayOrder")
    void testPublicGetProjects_OnlyPublished_Sorted() throws Exception {
        projectRepository.saveAll(List.of(
                Project.builder().title("Project C").slug("project-c").description("Desc").displayOrder(2).status(ContentStatus.PUBLISHED).build(),
                Project.builder().title("Project A").slug("project-a").description("Desc").displayOrder(1).status(ContentStatus.PUBLISHED).build(),
                Project.builder().title("Project Draft").slug("project-draft").description("Desc").displayOrder(0).status(ContentStatus.DRAFT).build()
        ));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(2))) // Draft is omitted
                .andExpect(jsonPath("$.data[0].slug").value("project-a"))
                .andExpect(jsonPath("$.data[1].slug").value("project-c"));
    }

    @Test
    @DisplayName("11. Public GET /api/projects?featured=true filters only published and featured projects")
    void testPublicGetProjects_FeaturedFilter() throws Exception {
        projectRepository.saveAll(List.of(
                Project.builder().title("Featured 1").slug("f-1").description("Desc").featured(true).status(ContentStatus.PUBLISHED).build(),
                Project.builder().title("Regular 1").slug("r-1").description("Desc").featured(false).status(ContentStatus.PUBLISHED).build(),
                Project.builder().title("Draft Featured").slug("d-f").description("Desc").featured(true).status(ContentStatus.DRAFT).build()
        ));

        mockMvc.perform(get("/api/projects").param("featured", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].slug").value("f-1"));
    }

    @Test
    @DisplayName("12. Public GET /api/projects/{slug} returns published project, returns 404 for draft")
    void testPublicGetProjectBySlug() throws Exception {
        projectRepository.saveAll(List.of(
                Project.builder().title("Live App").slug("live-app").description("Active").status(ContentStatus.PUBLISHED).build(),
                Project.builder().title("Draft App").slug("draft-app").description("WIP").status(ContentStatus.DRAFT).build()
        ));

        // Published slug succeeds
        mockMvc.perform(get("/api/projects/live-app"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("live-app"));

        // Draft slug returns 404
        mockMvc.perform(get("/api/projects/draft-app"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));

        // Non-existent slug returns 404
        mockMvc.perform(get("/api/projects/does-not-exist"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("13. Unauthorized requests to admin project endpoints return 401")
    void testAdminEndpoints_WithoutToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/projects"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/projects/1/publish"))
                .andExpect(status().isUnauthorized());
    }
}
