package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.model.Media;
import com.portfolio.repository.MediaRepository;
import com.portfolio.service.storage.MediaStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MediaAdminControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private MediaStorageService mediaStorageService;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        mediaRepository.deleteAll();

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
    @DisplayName("1. Admin POST /api/admin/media with valid PNG stores file and metadata, returns 201 Created")
    void testUploadMedia_ValidPng_Succeeds() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "sample-banner.png",
                "image/png",
                "fake-png-binary-content".getBytes()
        );

        MvcResult result = mockMvc.perform(multipart("/api/admin/media")
                        .file(file)
                        .param("altText", "Portfolio banner image")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.originalFilename").value("sample-banner.png"))
                .andExpect(jsonPath("$.data.contentType").value("image/png"))
                .andExpect(jsonPath("$.data.url").isNotEmpty())
                .andExpect(jsonPath("$.data.altText").value("Portfolio banner image"))
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(result.getResponse().getContentAsString());
        String storagePath = responseNode.path("data").path("storagePath").asText();
        assertThat(mediaStorageService.exists(storagePath)).isTrue();

        // Clean up stored file
        mediaStorageService.delete(storagePath);
    }

    @Test
    @DisplayName("2. Admin POST /api/admin/media with safe SVG succeeds")
    void testUploadMedia_SafeSvg_Succeeds() throws Exception {
        String safeSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"red\"/></svg>";
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "icon.svg",
                "image/svg+xml",
                safeSvg.getBytes()
        );

        MvcResult result = mockMvc.perform(multipart("/api/admin/media")
                        .file(file)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(result.getResponse().getContentAsString());
        String storagePath = responseNode.path("data").path("storagePath").asText();
        mediaStorageService.delete(storagePath);
    }

    @Test
    @DisplayName("3. Admin POST /api/admin/media with malicious script SVG returns 400 Bad Request")
    void testUploadMedia_MaliciousSvg_Returns400() throws Exception {
        String maliciousSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\"><script>alert('XSS')</script></svg>";
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "malicious.svg",
                "image/svg+xml",
                maliciousSvg.getBytes()
        );

        mockMvc.perform(multipart("/api/admin/media")
                        .file(file)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("SVG file rejected: potentially malicious script detected"));
    }

    @Test
    @DisplayName("4. Admin POST /api/admin/media with disallowed file type returns 400 Bad Request")
    void testUploadMedia_DisallowedType_Returns400() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "script.sh",
                "application/x-sh",
                "echo hello".getBytes()
        );

        mockMvc.perform(multipart("/api/admin/media")
                        .file(file)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("5. Admin POST /api/admin/media with empty file returns 400 Bad Request")
    void testUploadMedia_EmptyFile_Returns400() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.jpg",
                "image/jpeg",
                new byte[0]
        );

        mockMvc.perform(multipart("/api/admin/media")
                        .file(file)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("6. Admin POST /api/admin/media with oversized file (>10MB) returns 400 Bad Request")
    void testUploadMedia_OversizedFile_Returns400() throws Exception {
        byte[] largeBytes = new byte[11 * 1024 * 1024]; // 11MB (exceeds 10MB limit)
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "huge.png",
                "image/png",
                largeBytes
        );

        mockMvc.perform(multipart("/api/admin/media")
                        .file(file)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("7. Admin GET /api/admin/media returns list of all media metadata")
    void testGetAllMedia_Succeeds() throws Exception {
        mediaRepository.save(Media.builder()
                .filename("test1.png")
                .originalFilename("orig1.png")
                .contentType("image/png")
                .fileSize(1024L)
                .storagePath("media/test1.png")
                .url("/uploads/media/test1.png")
                .uploadedAt(Instant.now())
                .build());

        mockMvc.perform(get("/api/admin/media")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].originalFilename").value("orig1.png"));
    }

    @Test
    @DisplayName("8. Admin GET /api/admin/media/{id} returns single media; 404 for missing ID")
    void testGetMediaById() throws Exception {
        Media saved = mediaRepository.save(Media.builder()
                .filename("test2.jpg")
                .originalFilename("orig2.jpg")
                .contentType("image/jpeg")
                .fileSize(2048L)
                .storagePath("media/test2.jpg")
                .url("/uploads/media/test2.jpg")
                .uploadedAt(Instant.now())
                .build());

        mockMvc.perform(get("/api/admin/media/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.filename").value("test2.jpg"));

        mockMvc.perform(get("/api/admin/media/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("9. Admin DELETE /api/admin/media/{id} deletes metadata and physical file")
    void testDeleteMedia_Succeeds() throws Exception {
        // Upload a file first
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "to-delete.png",
                "image/png",
                "temp-bytes".getBytes()
        );

        MvcResult uploadResult = mockMvc.perform(multipart("/api/admin/media")
                        .file(file)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(uploadResult.getResponse().getContentAsString());
        long mediaId = responseNode.path("data").path("id").asLong();
        String storagePath = responseNode.path("data").path("storagePath").asText();

        assertThat(mediaStorageService.exists(storagePath)).isTrue();
        assertThat(mediaRepository.findById(mediaId)).isPresent();

        // Perform DELETE
        mockMvc.perform(delete("/api/admin/media/" + mediaId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(mediaRepository.findById(mediaId)).isEmpty();
        assertThat(mediaStorageService.exists(storagePath)).isFalse();
    }

    @Test
    @DisplayName("10. Unauthorized access to /api/admin/media fails with 401")
    void testAdminMedia_Unauthorized_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/media"))
                .andExpect(status().isUnauthorized());

        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", "bytes".getBytes());
        mockMvc.perform(multipart("/api/admin/media").file(file))
                .andExpect(status().isUnauthorized());
    }
}
