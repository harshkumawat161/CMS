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
public class BlogResponse {

    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String coverImage;
    private Instant publishedAt;
    private ContentStatus status;
    private List<String> tags;
    private Instant createdAt;
    private Instant updatedAt;
}
