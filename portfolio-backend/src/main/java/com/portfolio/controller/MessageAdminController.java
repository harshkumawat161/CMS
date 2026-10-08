package com.portfolio.controller;

import com.portfolio.dto.request.UpdateMessageStatusRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.MessageResponse;
import com.portfolio.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/messages")
@Tag(name = "Messages", description = "Admin inbox and contact inquiry management")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class MessageAdminController {

    private final ContactService contactService;

    public MessageAdminController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    @Operation(summary = "Get all messages (Admin)", description = "Returns all submitted contact messages ordered newest first")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "All messages retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT")
    })
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getAllMessages() {
        List<MessageResponse> messages = contactService.getAllMessages();
        return ResponseEntity.ok(ApiResponse.success("All messages retrieved successfully", messages));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get message by ID (Admin)", description = "Returns a single contact message by ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Message retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Message not found")
    })
    public ResponseEntity<ApiResponse<MessageResponse>> getMessageById(@PathVariable Long id) {
        MessageResponse message = contactService.getMessageById(id);
        return ResponseEntity.ok(ApiResponse.success("Message retrieved successfully", message));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark message as read/unread (Admin)", description = "Updates the read/unread status of a contact message")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Message status updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Message not found")
    })
    public ResponseEntity<ApiResponse<MessageResponse>> markMessageAsRead(
            @PathVariable Long id,
            @RequestBody(required = false) UpdateMessageStatusRequest request) {
        Boolean isRead = (request != null && request.getRead() != null) ? request.getRead() : true;
        MessageResponse updated = contactService.markMessageAsRead(id, isRead);
        return ResponseEntity.ok(ApiResponse.success("Message status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete message (Admin)", description = "Deletes a contact message by ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Message deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Message not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully", null));
    }
}
