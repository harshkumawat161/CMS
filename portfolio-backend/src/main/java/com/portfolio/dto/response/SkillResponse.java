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
public class SkillResponse {

    private Long id;
    private String name;
    private String category;
    private Integer proficiency;
    private String icon;
    private Integer displayOrder;
    private boolean published;
    private Instant createdAt;
    private Instant updatedAt;
}
