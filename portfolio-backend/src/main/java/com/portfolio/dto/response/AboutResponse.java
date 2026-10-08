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
public class AboutResponse {

    private Long id;
    private String name;
    private String headline;
    private String bio;
    private String profileImage;
    private String resumeUrl;
    private String email;
    private String location;
    private String githubUrl;
    private String linkedinUrl;
    private String twitterUrl;
    private Instant createdAt;
    private Instant updatedAt;
}
