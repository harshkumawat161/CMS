package com.portfolio.dto.response;

import com.portfolio.model.enums.ContentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private String title;
    private String slug;
    private String shortDescription;
    private String description;
    private String image;
    private String githubUrl;
    private String liveUrl;
    private List<String> technologies;
    private boolean featured;
    private Integer displayOrder;
    private ContentStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
