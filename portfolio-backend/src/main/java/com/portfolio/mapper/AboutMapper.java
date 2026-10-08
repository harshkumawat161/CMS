package com.portfolio.mapper;

import com.portfolio.dto.request.AboutRequest;
import com.portfolio.dto.response.AboutResponse;
import com.portfolio.model.About;
import org.springframework.stereotype.Component;

@Component
public class AboutMapper {

    public AboutResponse toResponse(About about) {
        if (about == null) {
            return null;
        }

        return AboutResponse.builder()
                .id(about.getId())
                .name(about.getName())
                .headline(about.getHeadline())
                .bio(about.getBio())
                .profileImage(about.getProfileImage())
                .resumeUrl(about.getResumeUrl())
                .email(about.getEmail())
                .location(about.getLocation())
                .githubUrl(about.getGithubUrl())
                .linkedinUrl(about.getLinkedinUrl())
                .twitterUrl(about.getTwitterUrl())
                .createdAt(about.getCreatedAt())
                .updatedAt(about.getUpdatedAt())
                .build();
    }

    public About toEntity(AboutRequest request) {
        if (request == null) {
            return null;
        }

        return About.builder()
                .name(request.getName())
                .headline(request.getHeadline())
                .bio(request.getBio())
                .profileImage(request.getProfileImage())
                .resumeUrl(request.getResumeUrl())
                .email(request.getEmail())
                .location(request.getLocation())
                .githubUrl(request.getGithubUrl())
                .linkedinUrl(request.getLinkedinUrl())
                .twitterUrl(request.getTwitterUrl())
                .build();
    }

    public void updateEntityFromRequest(About about, AboutRequest request) {
        if (about == null || request == null) {
            return;
        }

        about.setName(request.getName());
        about.setHeadline(request.getHeadline());
        about.setBio(request.getBio());
        about.setProfileImage(request.getProfileImage());
        about.setResumeUrl(request.getResumeUrl());
        about.setEmail(request.getEmail());
        about.setLocation(request.getLocation());
        about.setGithubUrl(request.getGithubUrl());
        about.setLinkedinUrl(request.getLinkedinUrl());
        about.setTwitterUrl(request.getTwitterUrl());
    }
}
