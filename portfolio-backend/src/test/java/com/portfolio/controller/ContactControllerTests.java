package com.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.request.ContactMessageRequest;
import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.request.UpdateMessageStatusRequest;
import com.portfolio.model.Message;
import com.portfolio.repository.MessageRepository;
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
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MessageRepository messageRepository;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        messageRepository.deleteAll();

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
    @DisplayName("1. Public POST /api/contact submits message without authentication, returns 201 Created")
    void testSubmitMessage_Public_Succeeds() throws Exception {
        ContactMessageRequest request = ContactMessageRequest.builder()
                .name("Jane Developer")
                .email("jane@example.com")
                .subject("Project Inquiry")
                .message("Hello! I would love to discuss an architectural consulting project.")
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.name").value("Jane Developer"))
                .andExpect(jsonPath("$.data.email").value("jane@example.com"))
                .andExpect(jsonPath("$.data.read").value(false));

        assertThat(messageRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("2. Public POST /api/contact with invalid email or blank fields returns 400 Bad Request")
    void testSubmitMessage_ValidationErrors_Returns400() throws Exception {
        ContactMessageRequest invalid = ContactMessageRequest.builder()
                .name("")
                .email("not-an-email")
                .subject("")
                .message("")
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.name").isNotEmpty())
                .andExpect(jsonPath("$.errors.email").isNotEmpty())
                .andExpect(jsonPath("$.errors.subject").isNotEmpty())
                .andExpect(jsonPath("$.errors.message").isNotEmpty());
    }

    @Test
    @DisplayName("3. Admin GET /api/admin/messages returns list of messages")
    void testGetAllMessages_Admin_Succeeds() throws Exception {
        messageRepository.save(Message.builder()
                .name("Alex")
                .email("alex@example.com")
                .subject("Hi")
                .message("Message content")
                .read(false)
                .build());

        mockMvc.perform(get("/api/admin/messages")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].name").value("Alex"));
    }

    @Test
    @DisplayName("4. Admin GET /api/admin/messages/{id} returns message; 404 for missing ID")
    void testGetMessageById() throws Exception {
        Message saved = messageRepository.save(Message.builder()
                .name("Sam")
                .email("sam@example.com")
                .subject("Interview")
                .message("Can we talk?")
                .build());

        mockMvc.perform(get("/api/admin/messages/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Sam"));

        mockMvc.perform(get("/api/admin/messages/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("5. Admin PATCH /api/admin/messages/{id}/read marks message as read")
    void testMarkMessageAsRead_Succeeds() throws Exception {
        Message saved = messageRepository.save(Message.builder()
                .name("David")
                .email("david@example.com")
                .subject("Subject")
                .message("Body")
                .read(false)
                .build());

        UpdateMessageStatusRequest patchRequest = new UpdateMessageStatusRequest(true);

        mockMvc.perform(patch("/api/admin/messages/" + saved.getId() + "/read")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(patchRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.read").value(true));

        Message reloaded = messageRepository.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.isRead()).isTrue();
    }

    @Test
    @DisplayName("6. Admin DELETE /api/admin/messages/{id} deletes message")
    void testDeleteMessage_Succeeds() throws Exception {
        Message saved = messageRepository.save(Message.builder()
                .name("Spam User")
                .email("spam@example.com")
                .subject("Buy Crypto")
                .message("Spam text")
                .build());

        mockMvc.perform(delete("/api/admin/messages/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(messageRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("7. Unauthorized access to /api/admin/messages fails with 401")
    void testAdminMessages_Unauthorized_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/messages"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(delete("/api/admin/messages/1"))
                .andExpect(status().isUnauthorized());
    }
}
