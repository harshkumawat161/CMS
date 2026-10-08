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
public class ServiceResponse {

    private Long id;
    private String title;
    private String description;
    private String icon;
    private Integer displayOrder;
    private boolean published;
    private Instant createdAt;
    private Instant updatedAt;
}
