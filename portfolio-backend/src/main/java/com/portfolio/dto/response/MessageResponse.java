package com.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private boolean read;
    private Instant createdAt;
    private Instant updatedAt;
}
