package com.portfolio.controller;

import com.portfolio.dto.request.ContactMessageRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.MessageResponse;
import com.portfolio.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@Tag(name = "Contact", description = "Public endpoint for contact form inquiries")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    @Operation(summary = "Submit contact message", description = "Submits a new contact message and dispatches notifications")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Message sent successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation failed for one or more fields")
    })
    public ResponseEntity<ApiResponse<MessageResponse>> submitMessage(@Valid @RequestBody ContactMessageRequest request) {
        MessageResponse response = contactService.submitContactMessage(request);
        return new ResponseEntity<>(
                ApiResponse.success("Thank you! Your message has been sent successfully.", response),
                HttpStatus.CREATED
        );
    }
}
