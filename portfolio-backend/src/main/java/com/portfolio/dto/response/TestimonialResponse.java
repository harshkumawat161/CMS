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
public class TestimonialResponse {

    private Long id;
    private String name;
    private String role;
    private String company;
    private String message;
    private String image;
    private Integer displayOrder;
    private boolean published;
    private Instant createdAt;
    private Instant updatedAt;
}
