package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.BlogRequest;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.model.Blog;
import com.portfolio.model.enums.ContentStatus;
import com.portfolio.repository.BlogRepository;
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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
class BlogControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BlogRepository blogRepository;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        blogRepository.deleteAll();

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
    @DisplayName("1. Admin POST /api/admin/blogs creates blog with auto-generated slug and returns 201 Created")
    void testCreateBlog_AutoSlug_Succeeds() throws Exception {
        BlogRequest request = BlogRequest.builder()
                .title("Architecting Modern Full-Stack Platforms with Spring Boot!")
                .excerpt("A complete guide to clean architecture.")
                .content("# Architecting Modern Full-Stack Platforms\nDetailed content...")
                .coverImage("https://example.com/cover.jpg")
                .tags(List.of("Spring Boot", "Architecture", "Java"))
                .build();

        mockMvc.perform(post("/api/admin/blogs")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.title").value("Architecting Modern Full-Stack Platforms with Spring Boot!"))
                .andExpect(jsonPath("$.data.slug").value("architecting-modern-full-stack-platforms-with-spring-boot"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"))
                .andExpect(jsonPath("$.data.tags", hasSize(3)));

        assertThat(blogRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. Admin POST /api/admin/blogs with custom slug normalizes and uses provided slug")
    void testCreateBlog_CustomSlug_Succeeds() throws Exception {
        BlogRequest request = BlogRequest.builder()
                .title("Spring Security 6 Guide")
                .slug("custom-spring-security-guide")
                .content("Guide content here")
                .tags(List.of("Security", "JWT"))
                .build();

        mockMvc.perform(post("/api/admin/blogs")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("custom-spring-security-guide"));
    }

    @Test
    @DisplayName("3. Admin POST /api/admin/blogs with duplicate slug returns 400 Bad Request")
    void testCreateBlog_DuplicateSlug_Returns400() throws Exception {
        blogRepository.save(Blog.builder()
                .title("Existing Article")
                .slug("existing-article")
                .content("First article content")
                .status(ContentStatus.PUBLISHED)
                .build());

        BlogRequest duplicateRequest = BlogRequest.builder()
                .title("Existing Article")
                .content("Duplicate article content")
                .build();

        mockMvc.perform(post("/api/admin/blogs")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("A blog with slug 'existing-article' already exists"));
    }

    @Test
    @DisplayName("4. Admin POST /api/admin/blogs validation errors return 400 Bad Request")
    void testCreateBlog_ValidationErrors_Returns400() throws Exception {
        BlogRequest invalid = BlogRequest.builder()
                .title("")
                .content("")
                .build();

        mockMvc.perform(post("/api/admin/blogs")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.title").isNotEmpty())
                .andExpect(jsonPath("$.errors.content").isNotEmpty());
    }

    @Test
    @DisplayName("5. Admin GET /api/admin/blogs/{id} returns single blog or 404")
    void testGetBlogById() throws Exception {
        Blog saved = blogRepository.save(Blog.builder()
                .title("Single Blog")
                .slug("single-blog")
                .content("Body")
                .status(ContentStatus.DRAFT)
                .build());

        mockMvc.perform(get("/api/admin/blogs/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(saved.getId()))
                .andExpect(jsonPath("$.data.slug").value("single-blog"));

        mockMvc.perform(get("/api/admin/blogs/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("6. Admin PUT /api/admin/blogs/{id} updates blog and tags")
    void testUpdateBlog_Succeeds() throws Exception {
        Blog saved = blogRepository.save(Blog.builder()
                .title("Initial Blog Title")
                .slug("initial-blog-title")
                .content("Initial Content")
                .status(ContentStatus.DRAFT)
                .build());

        BlogRequest updateRequest = BlogRequest.builder()
                .title("Updated Blog Title")
                .slug("updated-blog-slug")
                .excerpt("New excerpt")
                .content("Updated content body")
                .coverImage("https://example.com/updated.jpg")
                .tags(List.of("Microservices", "Docker"))
                .status(ContentStatus.PUBLISHED)
                .build();

        mockMvc.perform(put("/api/admin/blogs/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Updated Blog Title"))
                .andExpect(jsonPath("$.data.slug").value("updated-blog-slug"))
                .andExpect(jsonPath("$.data.tags", hasSize(2)))
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));

        Blog reloaded = blogRepository.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getTitle()).isEqualTo("Updated Blog Title");
        assertThat(reloaded.getSlug()).isEqualTo("updated-blog-slug");
        assertThat(reloaded.getStatus()).isEqualTo(ContentStatus.PUBLISHED);
    }

    @Test
    @DisplayName("7. Admin DELETE /api/admin/blogs/{id} deletes blog from database")
    void testDeleteBlog_Succeeds() throws Exception {
        Blog saved = blogRepository.save(Blog.builder()
                .title("Blog To Delete")
                .slug("blog-to-delete")
                .content("Delete content")
                .status(ContentStatus.DRAFT)
                .build());

        mockMvc.perform(delete("/api/admin/blogs/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(blogRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("8. Admin POST /api/admin/blogs/{id}/publish sets status and publishedAt date; /unpublish resets to DRAFT")
    void testPublishAndUnpublishBlog_SetsPublicationDate() throws Exception {
        Blog saved = blogRepository.save(Blog.builder()
                .title("Draft Blog")
                .slug("draft-blog")
                .content("Draft Content")
                .status(ContentStatus.DRAFT)
                .build());

        // Publish
        mockMvc.perform(post("/api/admin/blogs/" + saved.getId() + "/publish")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"))
                .andExpect(jsonPath("$.data.publishedAt").isNotEmpty());

        Blog publishedBlog = blogRepository.findById(saved.getId()).orElseThrow();
        assertThat(publishedBlog.getStatus()).isEqualTo(ContentStatus.PUBLISHED);
        assertThat(publishedBlog.getPublishedAt()).isNotNull();

        // Unpublish
        mockMvc.perform(post("/api/admin/blogs/" + saved.getId() + "/unpublish")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));

        Blog unpublishedBlog = blogRepository.findById(saved.getId()).orElseThrow();
        assertThat(unpublishedBlog.getStatus()).isEqualTo(ContentStatus.DRAFT);
    }

    @Test
    @DisplayName("9. Public GET /api/blogs returns only published blogs ordered newest first with pagination")
    void testPublicGetBlogs_PaginationAndOrdering() throws Exception {
        Instant now = Instant.now();

        // Seed 3 published articles at different times and 1 draft article
        Blog blogOld = blogRepository.save(Blog.builder()
                .title("Old Article")
                .slug("old-article")
                .content("Content")
                .status(ContentStatus.PUBLISHED)
                .publishedAt(now.minus(10, ChronoUnit.DAYS))
                .build());

        Blog blogMiddle = blogRepository.save(Blog.builder()
                .title("Middle Article")
                .slug("middle-article")
                .content("Content")
                .status(ContentStatus.PUBLISHED)
                .publishedAt(now.minus(5, ChronoUnit.DAYS))
                .build());

        Blog blogNewest = blogRepository.save(Blog.builder()
                .title("Newest Article")
                .slug("newest-article")
                .content("Content")
                .status(ContentStatus.PUBLISHED)
                .publishedAt(now)
                .build());

        blogRepository.save(Blog.builder()
                .title("Draft Secret")
                .slug("draft-secret")
                .content("Not published yet")
                .status(ContentStatus.DRAFT)
                .build());

        // Page 0 with size 2: Should return newest two articles ("Newest Article", then "Middle Article")
        mockMvc.perform(get("/api/blogs")
                        .param("page", "0")
                        .param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", hasSize(2)))
                .andExpect(jsonPath("$.data.content[0].slug").value("newest-article"))
                .andExpect(jsonPath("$.data.content[1].slug").value("middle-article"))
                .andExpect(jsonPath("$.data.page").value(0))
                .andExpect(jsonPath("$.data.size").value(2))
                .andExpect(jsonPath("$.data.totalElements").value(3))
                .andExpect(jsonPath("$.data.totalPages").value(2))
                .andExpect(jsonPath("$.data.last").value(false));

        // Page 1 with size 2: Should return the oldest published article ("Old Article")
        mockMvc.perform(get("/api/blogs")
                        .param("page", "1")
                        .param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].slug").value("old-article"))
                .andExpect(jsonPath("$.data.last").value(true));
    }

    @Test
    @DisplayName("10. Public GET /api/blogs/{slug} returns published blog; draft or missing slug returns 404")
    void testPublicGetBlogBySlug() throws Exception {
        blogRepository.saveAll(List.of(
                Blog.builder().title("Public Post").slug("public-post").content("Public").status(ContentStatus.PUBLISHED).publishedAt(Instant.now()).build(),
                Blog.builder().title("Secret Post").slug("secret-post").content("Secret").status(ContentStatus.DRAFT).build()
        ));

        // Published blog succeeds
        mockMvc.perform(get("/api/blogs/public-post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("public-post"));

        // Draft blog returns 404
        mockMvc.perform(get("/api/blogs/secret-post"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));

        // Non-existent slug returns 404
        mockMvc.perform(get("/api/blogs/non-existent-article"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("11. Unauthorized requests to admin blog endpoints return 401")
    void testAdminEndpoints_WithoutToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/blogs"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/blogs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/admin/blogs/1/publish"))
                .andExpect(status().isUnauthorized());
    }
}
